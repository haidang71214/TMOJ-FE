const API_PREFIX = "api/v1";
// ví dụ về những cái endpoint

const authEndpoint = {
  LOGIN: `${API_PREFIX}/auth/login`,
  GOOGLE_LOGIN: `${API_PREFIX}/auth/google-login`,
};
const userProfileEndpoint = {
  GET_PROFILE: `${API_PREFIX}/users/profile`,
  UPDATE_INFOMATION: `${API_PREFIX}/users/profile`
}
export {
  authEndpoint,
  userProfileEndpoint
};

