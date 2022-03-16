const {
  errorMessages,
  newError,
  FAILED_TO_CALL_HATCHWAY_URL,
  DEFAULT,
} = require("../errorCodes");
var createError = require("http-errors");
const {
  validateParams,
  retrievePosts,
  filterPosts,
  sortPosts,
} = require("../apiUtils/apiUtils");

const postsController = () => {
  return async (req, res, next) => {
    // Get req params

    try {
      const params = validateParams(req.query);
      const posts = await retrievePosts(params);

      // Remove Duplicates and flatted posts array
      // Initially posts is [[Ni*{}]*K] where Ni is the number of posts for each tag and K is the number of tags
      // We want to flatten it to [{}*N] where N is the total number of posts
      const filteredPosts = await filterPosts(posts);

      const sortedPosts = await sortPosts(
        filteredPosts,
        params.sortBy,
        params.direction
      );

      res.status(200).json({ posts: sortedPosts });
    } catch (e) {
      console.log(e);
      const errorCode = e.code;
      const errorMessage =
        errorCode && errorMessages[errorCode]
          ? errorMessages[errorCode]
          : errorMessages[DEFAULT];

      // Since all response status codes in handout are 400 (Bad Request), I am returning 400 for all types of error
      res.status(400).json({ error: errorMessage });
    }
  };
};

module.exports = postsController;
