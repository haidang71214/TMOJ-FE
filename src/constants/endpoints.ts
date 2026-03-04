const API_PREFIX = "api/v1";
// ví dụ về những cái endpoint

const authEndpoint = {
  LOGIN: `${API_PREFIX}/Auth/login`,
  GOOGLE_LOGIN: `${API_PREFIX}/auth/google-login`,
  REGISTER:`${API_PREFIX}/auth/register`,
  LOGOUT:`${API_PREFIX}/Auth/logout`,
  FORGOT_PASSWORD:`${API_PREFIX}/Auth/forgot-password`,
  RESET_PASSWORD:`${API_PREFIX}/Auth/reset-password`
};
const userProfileEndpoint = {
  GET_PROFILE: `${API_PREFIX}/User/me`,
  UPDATE_INFOMATION: `${API_PREFIX}/users/profile`
}
const AdminUserEndPoint = {
  GET_LIST_USER : `${API_PREFIX}/User/list-all`,
  CREATE_USER : `${API_PREFIX}/User`,
  GET_DETAIL_USER: `${API_PREFIX}/User/{id}`,
  DELETE_USER:`${API_PREFIX}/User/Pid}`,
  LOCK_USER_PUT:`${API_PREFIX}/Auth/users/{id}/lock`,
   UNLOCK_USER_PUT:`${API_PREFIX}/Auth/users/{id}/unlock`,
  GET_USER_UNLOCK:`${API_PREFIX}/Auth/users/unlock`,
    GET_USER_LOCK:`${API_PREFIX}/Auth/users/lock`,
    POST_ASSIGN_ROLE:`${API_PREFIX}/Auth/users/{id}/assign-role`
}

export {
  authEndpoint,
  userProfileEndpoint,
  AdminUserEndPoint
};

