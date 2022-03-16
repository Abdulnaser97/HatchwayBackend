const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const request = require("supertest");
const app = require("./app");
const testData = require("./testData.js");

const HATCHWAY_BASE_URL = "https://api.hatchways.io/assessment/blog/posts";
describe("api calls", () => {
  beforeEach(() => {
    const axiosMock = new MockAdapter(axios);
    const postsWithHistoryTag = testData.unsorted[0];
    const postsWithTechTag = testData.unsorted[1];

    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=history`).reply(200, {
      posts: postsWithHistoryTag,
    });

    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=tech`).reply(200, {
      posts: postsWithTechTag,
    });
  });
  it("GET /api/ping --> success object", () => {
    return request(app)
      .get("/api/ping")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
          })
        );
      });
  });

  expect.arr;

  it("GET /api/posts, params: {tags: [tagThatDoesn'tExist1, tagThatDoesn'tExist2]} --> empty array if no match found", () => {
    const axiosMock = new MockAdapter(axios);

    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=tagThatDoesntExist1`).reply(200, {
      posts: [],
    });

    axiosMock.onGet(`${HATCHWAY_BASE_URL}?tag=tagThatDoesntExist2`).reply(200, {
      posts: [],
    });

    return request(app)
      .get("/api/posts?tags=tagThatDoesntExist1,tagThatDoesntExist2")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            posts: [],
          })
        );
      });
  });

  it("GET /api/posts, params: {tags: [history,tech]} --> object containing posts sorted by default ascendingly by id", () => {
    return request(app)
      .get("/api/posts?tags=history,tech")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual({ posts: testData.ascSorted.byId });
      });
  });

  it("GET /api/posts, params: {tags: [history,tech], sortBy: reads} --> object containing posts sorted asc by reads", () => {
    return request(app)
      .get("/api/posts?tags=history,tech&sortBy=reads")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual({ posts: testData.ascSorted.byReads });
      });
  });

  it("GET /api/posts, params: {tags: [history,tech], sortBy: likes, direction: desc} --> object containing posts sorted desc by likes", () => {
    return request(app)
      .get("/api/posts?tags=history,tech&sortBy=likes&direction=desc")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual({
          posts: testData.ascSorted.byLikes.reverse(),
        });
      });
  });

  it("GET /api/posts, params: {tags: [history,tech], sortBy: popularity, direction: desc} --> object containing posts sorted desc by popularity", () => {
    return request(app)
      .get("/api/posts?tags=history,tech&sortBy=popularity&direction=desc")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual({
          posts: testData.ascSorted.byPopularity.reverse(),
        });
      });
  });
});

describe("api error scenarios", () => {
  it("GET /api/posts --> 400 Tag parameter is required", () => {
    return request(app)
      .get("/api/posts")
      .expect(400)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            error: "Tag parameter is required",
          })
        );
      });
  });
  it("GET /api/posts, params: {tags: [history,tech], sortBy: visits} --> 400 sortBy parameter is invalid", () => {
    return request(app)
      .get("/api/posts?tags=history,tech&sortBy=visits")
      .expect(400)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            error: "sortBy parameter is invalid",
          })
        );
      });
  });
  it("GET /api/posts, params: {tags: [history,tech], sortBy: popularity, direction: missSpelledDirection} --> 400 direction parameter is invalid", () => {
    return request(app)
      .get(
        "/api/posts?tags=history,tech&sortBy=popularity&direction=missSpelledDirection"
      )
      .expect(400)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            error: "direction parameter is invalid",
          })
        );
      });
  });
});
