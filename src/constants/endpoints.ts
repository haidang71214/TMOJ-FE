const API_PREFIX = "api";
// ví dụ về những cái endpoint

const authEndpoint = {
  LOGIN: `${API_PREFIX}/auth/login`,
};
const userProfileEndpoint = {
  GET_PROFILE: `${API_PREFIX}/users/profile`,
  UPDATE_INFOMATION : `${API_PREFIX}/users/profile`
}
export {
  authEndpoint,
  userProfileEndpoint
};

