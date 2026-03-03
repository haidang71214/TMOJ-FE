const API_PREFIX = "api/v1";
// ví dụ về những cái endpoint

const authEndpoint = {
  LOGIN: `${API_PREFIX}/Auth/login`,
  GOOGLE_LOGIN: `${API_PREFIX}/auth/google-login`,
  REGISTER:`${API_PREFIX}/auth/register`,
  LOGOUT:`${API_PREFIX}/Auth/logout`
};
const userProfileEndpoint = {
  GET_PROFILE: `${API_PREFIX}/User/me`,
  UPDATE_INFOMATION: `${API_PREFIX}/users/profile`
}
export {
  authEndpoint,
  userProfileEndpoint
};

