const {
  validateParams,
  retrievePosts,
  filterPosts,
  sortPosts,
} = require("./apiUtils");
const {
  INVALID_SORTBY_PARAM,
  INVALID_DIRECTION_PARAM,
  MISSING_TAG_PARAMS,
  errorMessages,
  newError,
} = require("../errorCodes");
const testData = require("../testData");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const HATCHWAY_BASE_URL = "https://api.hatchways.io/assessment/blog/posts";

describe("validateParams", () => {
  it("should return tags, sortBy, and directionParams", () => {
    const queryParams = {
      tags: "tag1,tag2",
      sortBy: "likes",
      direction: "desc",
    };

    const { tags, sortBy, direction } = validateParams(queryParams);

    expect(tags).toEqual(["tag1", "tag2"]);
    expect(sortBy).toEqual("likes");
    expect(direction).toEqual("desc");
  });

  it("should throw MISSING_TAG_PARAMS error if no tags param is provided in url", () => {
    const missingTagParamError = newError(
      MISSING_TAG_PARAMS,
      "validateParams: could not find tags param"
    );
    const queryParams = {
      sortBy: "likes",
      direction: "desc",
    };
    expect(() => {
      validateParams(queryParams);
    }).toThrow(missingTagParamError);
  });

  it("should throw INVALID_SORTBY_PARAM error if sortBy param is invalid", () => {
    const invalidSortedByParamError = newError(
      INVALID_SORTBY_PARAM,
      "validateParams: sortBy param is invalid"
    );
    const queryParams = {
      tags: "tag1,tag2",
      sortBy: "invalidParam",
    };

    expect(() => {
      validateParams(queryParams);
    }).toThrow(invalidSortedByParamError);
  });

  it("should throw INVALID_DIRECTION_PARAM error if direction param is invalid", () => {
    const invalidDirectionParamError = newError(
      INVALID_DIRECTION_PARAM,
      "validateParams: direction param is invalid"
    );
    const queryParams = {
      tags: "tag1,tag2",
      direction: "invalidParam",
    };

    expect(() => {
      validateParams(queryParams);
    }).toThrow(invalidDirectionParamError);
  });
});

describe("retrievePosts", () => {
  beforeEach(() => jest.resetModules());
  it("should return posts from each tag", async () => {
    const axiosMock = new MockAdapter(axios);
    const postsWithHistoryTag = testData.unsorted[0];
    const postsWithTechTag = testData.unsorted[1];

    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=history`).reply(200, {
      posts: postsWithHistoryTag,
    });

    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=tech`).reply(200, {
      posts: postsWithTechTag,
    });

    const queryParams = {
      tags: ["history", "tech"],
      sortBy: "likes",
      direction: "desc",
    };

    const posts = await retrievePosts(queryParams);
    expect(posts).toEqual(testData.unsorted);
  });

  it("should throw error when any of the api call fails", () => {
    const axiosMock = new MockAdapter(axios);
    const queryParams = {
      tags: ["history", "tech"],
      sortBy: "likes",
      direction: "desc",
    };

    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=history`).reply(500);
    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=tech`).reply(500);

    expect(retrievePosts(queryParams)).rejects.toThrow(
      new Error(errorMessages.DEFAULT)
    );
  });
});

describe("filterPosts", () => {
  it("should flattens the postsByTag array and remove duplicates", () => {
    const filteredPosts = filterPosts(testData.unsorted);
    expect(filteredPosts).toEqual(testData.filtered);
  });
});

describe("sortPosts", () => {
  it("should sort by likes descendingly", () => {
    const sortedPosts = sortPosts(testData.filtered, "likes", "desc");
    expect(sortedPosts).toEqual(testData.ascSorted.byLikes.reverse());
  });

  it("should sort by Id descendingly if key wasn't provided, but direction is descending", () => {
    const sortedPosts = sortPosts(testData.filtered, "", "desc");
    expect(sortedPosts).toEqual(testData.ascSorted.byId.reverse());
  });

  it("should return sorted array by id ascendingly if neither key nor direction were provided", () => {
    const sortedPosts = sortPosts(testData.filtered, "", "");
    expect(sortedPosts).toEqual(testData.ascSorted.byId);
  });
});
