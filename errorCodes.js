const MISSING_TAG_PARAMS = "MISSING_TAG_PARAMS";
const INVALID_SORTBY_PARAM = "INVALID_SORTBY_PARAM";
const INVALID_DIRECTION_PARAM = "INVALID_DIRECTION_PARAM";
const FAILED_TO_CALL_HATCHWAY_URL = "FAILED_TO_CALL_HATCHWAY_URL";
const DEFAULT = "DEFAULT";

const errorMessages = {
  MISSING_TAG_PARAMS: "Tag parameter is required",
  INVALID_SORTBY_PARAM: "sortBy parameter is invalid",
  INVALID_DIRECTION_PARAM: "direction parameter is invalid",
  DEFAULT: "Unable to retrieve posts",
};

function newError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

module.exports = {
  MISSING_TAG_PARAMS,
  INVALID_SORTBY_PARAM,
  INVALID_DIRECTION_PARAM,
  FAILED_TO_CALL_HATCHWAY_URL,
  DEFAULT,
  errorMessages,
  newError,
};
