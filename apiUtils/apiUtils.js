const axios = require("axios");
const {
  INVALID_SORTBY_PARAM,
  INVALID_DIRECTION_PARAM,
  MISSING_TAG_PARAMS,
  FAILED_TO_CALL_HATCHWAY_URL,
  DEFAULT,
  errorMessages,
  newError,
} = require("../errorCodes");

const HATCHWAY_BASE_URL = "https://api.hatchways.io/assessment/blog/posts";

function validateParams(params) {
  try {
    const tags = params["tags"];
    const sortBy = params["sortBy"];
    const direction = params["direction"];

    if (!tags) {
      throw newError(
        MISSING_TAG_PARAMS,
        "validateParams: could not find tags param"
      );
    }
    const tagsArr = tags.split(",");

    if (sortBy && !["id", "reads", "likes", "popularity"].includes(sortBy)) {
      throw newError(
        INVALID_SORTBY_PARAM,
        "validateParams: sortBy param is invalid"
      );
    }

    if (direction && !["asc", "desc"].includes(direction)) {
      throw newError(
        INVALID_DIRECTION_PARAM,
        "validateParams: direction param is invalid"
      );
    }

    return { tags: tagsArr, sortBy: sortBy, direction: direction };
  } catch (e) {
    throw e;
  }
}

async function retrievePosts(params) {
  try {
    const { tags, sortBy, direction } = params;

    // Concurrently retrieve posts from each tag
    const perTagRequests = tags.map((tag) => {
      const outboundURL = `${HATCHWAY_BASE_URL}?tag=${tag}`;
      return axios.get(outboundURL);
    });

    // Wait for all api calls to return
    const posts = await Promise.all(perTagRequests)
      .then((bulkResponses) => {
        return bulkResponses.map((response) => response.data.posts);
      })
      .catch((error) => {
        // In this case, we only log the error code, but error message will be the same as the default error message
        // because we don't want to expose the specific internal problem to the end user.
        // Also, we can have an internal logger that logs the error message internally in this case
        throw newError(FAILED_TO_CALL_HATCHWAY_URL, error);
      });
    return posts;
  } catch (e) {
    throw e;
  }
}

function filterPosts(posts) {
  const filteredPosts = {};
  // O(k*Ni) where k is the number of tags and Ni is the number of posts for each tag
  // i.e. O(N)
  posts.forEach((postsForTag, idx) => {
    postsForTag.forEach((post, idx) => {
      if (post.id) {
        if (!(post.id in filteredPosts)) {
          filteredPosts[post.id] = post;
        }
      }
    });
  });
  return Object.values(filteredPosts);
}

function sortPosts(posts, key, direction) {
  // items are sorted by ID ascendingly by default, so return immediately
  if (!key && !direction) {
    return posts;
  }

  const sortKey = key || "id";

  if (direction === "desc") {
    return posts.sort((a, b) => {
      return a[sortKey] < b[sortKey] ? 1 : -1;
    });
  } else {
    return posts.sort((a, b) => {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    });
  }
}

module.exports = {
  validateParams,
  retrievePosts,
  filterPosts,
  sortPosts,
  HATCHWAY_BASE_URL,
};
