require("dotenv").config();
const axios = require("axios");
const {
  INVALID_SORTBY_PARAM,
  INVALID_DIRECTION_PARAM,
  MISSING_TAG_PARAMS,
  FAILED_TO_CALL_HATCHWAY_URL,
  newError,
} = require("../errorCodes");

const HATCHWAY_BASE_URL = process.env.HATCHWAY_BASE_URL;

// Using Redis here is more scalable, but thought to keep it simple.
const simpleCache = {};

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

    const unChachedTags = tags.filter((tag) => !(tag in simpleCache));
    // Concurrently retrieve posts from each tag
    const perTagRequests = unChachedTags.map((tag) => {
      if (tag in simpleCache) {
        // return promise of cached data
        return simpleCache[tag];
      } else {
        const outboundURL = `${HATCHWAY_BASE_URL}?tag=${tag}`;
        return axios.get(outboundURL);
      }
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

    // Store api posts in cache
    for (let i = 0; i < posts.length; i++) {
      if (unChachedTags[i] && !simpleCache[unChachedTags[i]]) {
        simpleCache[unChachedTags[i]] = posts[i];
      }
    }

    // Concatenate posts from api calls with chached posts
    tags.forEach((tag) => {
      if (tag in simpleCache && !unChachedTags.includes(tag)) {
        posts.push(simpleCache[tag]);
      }
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
};
