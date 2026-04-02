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
  GET_LIST_USER : `${API_PREFIX}/User/list-all`, // bệt đuôi api vô
  CREATE_USER : `${API_PREFIX}/User`,
  GET_DETAIL_USER: `${API_PREFIX}/User/{id}`,
  DELETE_USER:`${API_PREFIX}/User/Pid}`,
  LOCK_USER_PUT:`${API_PREFIX}/Auth/users/{id}/lock`,
   UNLOCK_USER_PUT:`${API_PREFIX}/Auth/users/{id}/unlock`,
  GET_USER_UNLOCK:`${API_PREFIX}/Auth/users/unlock`,
    GET_USER_LOCK:`${API_PREFIX}/Auth/users/lock`,
    POST_ASSIGN_ROLE:`${API_PREFIX}/Auth/users/{id}/assign-role`,
    GET_USER_ROLE:`${API_PREFIX}/User/role/{roleName}`,
    ASSIGN_TEACHER_ROLE:`${API_PREFIX}/Class/assign-teacher-role`
}
const ProblemEndPoint = {
  GET_LIST_PROBLEM :`${API_PREFIX}/Problems`, 
  CREATE_PROBLEM_DAFT:`${API_PREFIX}/Problems/drafts`,
  CREATE_TESTSET_PROBLEM:`${API_PREFIX}/problems/{id}/testsets`,
  CREATE_TESTCASE_PROBLEM:`${API_PREFIX}/problems/{id}/testcases`
}
const ProblemListEndpoint = {
  GET_LIST_PUBLIC_PROBLEM : `${API_PREFIX}/problems?status=published`,
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
  IMPORT_TEMPLATE: `${API_PREFIX}/Class/import/template`,
  IMPORT_CLASS: `${API_PREFIX}/Class/import`,
};
const ClassEndpoint = {
  GET_ALL_CLASS:`${API_PREFIX}/Class`,
  CREATE_CLASS:`${API_PREFIX}/Class`,
  GET_DETAIL_CLASS:`${API_PREFIX}/Class/{id}`,
   PUT_CLASS_TEACHER:`${API_PREFIX}/Class/{id}/teacher`,
   CREATE_INVITE_CODE:`${API_PREFIX}/Class/{id}/invite-code`, // chưa làm
   DELETE_INVITE_CODE:`${API_PREFIX}/Class/{id}/members`, // chưa làm
   GET_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members`,
   ADD_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members`, // add student vào 
   POST_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members/{userId}`,
   DELETE_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members/{userId}`,
   JOIN_CLASS_BY_INVITECODE:`${API_PREFIX}/Class/join`, // chưa làm
  OUTOF_CLASS:`${API_PREFIX}/Class/{id}/members/me`,
  EXPORT_CLASS: `${API_PREFIX}/Class/{id}/report/export`,
}
const SemesterEndpoint = {
  GET_PUBLIC_SEMESTER: `${API_PREFIX}/Semester`,
  GET_DETAIL_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  CREATE_SEMESTER: `${API_PREFIX}/Semester`,
  UPDATE_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  DELETE_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  GET_ALL_SEMESTER:`${API_PREFIX}/Semester/all-semester`
};
const ClassSlotEndpoint = {
  GET_CLASS_SLOTS: `${API_PREFIX}/class/{classId}/slots`,
  CREATE_CLASS_SLOT: `${API_PREFIX}/class/{classId}/slots`,
  UPDATE_SLOT_DUE_DATE: `${API_PREFIX}/class/{classId}/slots/{slotId}/due-date`,
  PUBLISH_SLOT: `${API_PREFIX}/class/{classId}/slots/{slotId}/publish`,
  GET_SLOT_SCORES: `${API_PREFIX}/class/{classId}/slots/{slotId}/scores`,
  GET_USER_SUBMISSION: `${API_PREFIX}/class/{classId}/slots/{slotId}/submissions/{userId}`,
};
const NotificationEndpoint = {
  CREATE_NOTIFICATION: `${API_PREFIX}/notification`,
  GET_NOTIFICATION_BY_USER: `${API_PREFIX}/notification/user/{userId}`,
  GET_ALL_NOTIFICATION: `${API_PREFIX}/notification/all`,
  MARK_AS_READ: `${API_PREFIX}/notification/read/{id}`,
  DELETE_NOTIFICATION: `${API_PREFIX}/notification/{id}`,
};
// rim đã ở đây 
// a hihi 
export {
  ClassSlotEndpoint,
  authEndpoint,
  userProfileEndpoint,
  AdminUserEndPoint,
  ProblemEndPoint,
  ProblemListEndpoint,
  SubmittionEndPoint,
  RuntimeEndpoint,
  ClassEndpoint,
  SubjectEndpoint,
  SemesterEndpoint,
  NotificationEndpoint
};

