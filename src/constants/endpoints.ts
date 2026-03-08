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
    POST_ASSIGN_ROLE:`${API_PREFIX}/Auth/users/{id}/assign-role`,
    GET_USER_ROLE:`${API_PREFIX}/User/role/admin`,
    ASSIGN_TEACHER_ROLE:`${API_PREFIX}/Class/assign-teacher-role`
}
const ProblemEndPoint = {
  GET_LIST_PROBLEM :`${API_PREFIX}/Problems`,
  CREATE_PROBLEM_DAFT:`${API_PREFIX}/Problems/drafts`,
  CREATE_TESTSET_PROBLEM:`${API_PREFIX}/problems/{id}/testsets`,
  CREATE_TESTCASE_PROBLEM:`${API_PREFIX}/problems/{id}/testcases`
}
const ProblemListEndpoint = {
  GET_LIST_PUBLIC_PROBLEM : `${API_PREFIX}/Problems`,
  GET_DETAIL_PUBLIC_PROBLEM:`${API_PREFIX}/Problems/{id}`,
}
const SubmittionEndPoint = {
  GET_SUBMITTION_FROM_USER:`${API_PREFIX}/problems/{problemId}/submissions`
}
const RuntimeEndpoint = {
  GET_ALL_RUNTIME: `${API_PREFIX}/Runtimes`,
  GET_DETAIL_RUNTIME : `${API_PREFIX}/Runtimes/{id}​`
}
const SubjectEndpoint = {
  GET_ALL_SUBJECT: `${API_PREFIX}/Subject`,
  GET_DETAIL_SUBJECT: `${API_PREFIX}/Subject/{id}`,
  UPDATE_SUBJECT: `${API_PREFIX}/Subject/{id}`,
  CREATE_SUBJECT: `${API_PREFIX}/Subject`,
};
const ClassEndpoint = {
  GET_ALL_CLASS:`${API_PREFIX}/Class`,
  CREATE_CLASS:`${API_PREFIX}/Class`,
  GET_DETAIL_CLASS:`${API_PREFIX}/Class/{id}`,
   PUT_CLASS_TEACHER:`${API_PREFIX}/Class/{id}/teacher`,
   CREATE_INVITE_CODE:`${API_PREFIX}/Class/{id}/invite-code`,
   DELETE_INVITE_CODE:`${API_PREFIX}/Class/{id}/members`,
   GET_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members`,
   POST_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members/{userId}`,
   DELETE_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members/{userId}`,
   JOIN_CLASS_BY_INVITECODE:`${API_PREFIX}/Class/join`,
  OUTOF_CLASS:`${API_PREFIX}/Class/{id}/members/me`,
  // /api/v1/Class/{id}/report/export // cái này là gì hong biết
}
export {
  authEndpoint,
  userProfileEndpoint,
  AdminUserEndPoint,
  ProblemEndPoint,
  ProblemListEndpoint,
  SubmittionEndPoint,
  RuntimeEndpoint,
  ClassEndpoint,
  SubjectEndpoint
};

