const API_PREFIX = "api/v1";
// ví dụ về những cái endpoint
const API_LON = "api/v2";
const authEndpoint = {
  LOGIN: `${API_PREFIX}/Auth/login`,
  GOOGLE_LOGIN: `${API_PREFIX}/auth/google-login`,
  REGISTER:`${API_PREFIX}/Auth/register`,
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
  DELETE_USER:`${API_PREFIX}/User/{id}`,
  LOCK_USER_PUT:`${API_PREFIX}/User/{id}/lock`,
   UNLOCK_USER_PUT:`${API_PREFIX}/User/{id}/unlock`,
  GET_USER_UNLOCK:`${API_PREFIX}/User/unlocked`,
    GET_USER_LOCK:`${API_PREFIX}/User/locked`,
    POST_ASSIGN_ROLE:`${API_PREFIX}/User/{id}/role`,
    GET_USER_ROLE:`${API_PREFIX}/User/role/{roleName}`,
    ASSIGN_TEACHER_ROLE:`${API_PREFIX}/Class/assign-teacher-role`,
    GET_USER_IMPORT_TEMPLATE: `${API_PREFIX}/user/import/template`,
    IMPORT_USERS: `${API_PREFIX}/user/import`,
}
const ProblemEndPoint = {
  GET_LIST_PROBLEM :`${API_PREFIX}/Problems`, 
  CREATE_PROBLEM_DAFT:`${API_LON}/Problems/drafts`,
  CREATE_TESTSET_PROBLEM:`${API_PREFIX}/problems/{id}/testsets`,
  CREATE_TESTCASE_PROBLEM:`${API_LON}/Testsets/{id}/testcases`
}
const ProblemListEndpoint = {
  // cẩn thận chỗ này, nó lấy problem public và nó không lấy hết problem
  GET_LIST_PUBLIC_PROBLEM : `${API_LON}/Problems/public`,
  GET_DETAIL_PUBLIC_PROBLEM:`${API_PREFIX}/Problems/{id}`,
}
const SubmittionEndPoint = {
  GET_SUBMITTION_FROM_USER:`${API_LON}/problems/{problemId}/submissions`, // thực ra cái này là post
  GET_SUBMITTION:`${API_LON}/submissions/{submissionId}`,
  GET_SUBMISSIONS_LIST_BY_PROBLEM: `${API_LON}/submissions/{problemId}/submissionslist`
}
const RuntimeEndpoint = {
  GET_ALL_RUNTIME: `${API_PREFIX}/Runtimes`,
  GET_DETAIL_RUNTIME : `${API_PREFIX}/Runtimes/{id}`
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
   UPDATE_CLASS_SEMESTER: `${API_PREFIX}/Class/{id}/semesters/{classSemesterId}`,
   GET_INVITE_CODE:`${API_PREFIX}/Class/{classSemesterId}/invite-code`,
   CREATE_INVITE_CODE:`${API_PREFIX}/Class/{classSemesterId}/invite-code`,
   DELETE_INVITE_CODE:`${API_PREFIX}/Class/{classSemesterId}/invite-code`,
   GET_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/students`, // đang làm

   ADD_CLASS_MEMBERS:`${API_PREFIX}/Class/{classSemesterId}/students/manual`, // add student vào 
   POST_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members/{userId}`,
   DELETE_CLASS_MEMBERS:`${API_PREFIX}/Class/{id}/members/{userId}`,
   DELETE_STUDENT_CLASS_SEMESTER:`${API_PREFIX}/Class/{classSemesterId}/students/{studentId}`,
   JOIN_CLASS_BY_INVITECODE:`${API_PREFIX}/Class/join`, // chưa làm
  OUTOF_CLASS:`${API_PREFIX}/Class/{id}/members/me`,
  EXPORT_CLASS: `${API_PREFIX}/Class/{id}/report/export`, // đang sửa
  EXPORT_TEMPLATE_CLASS:`${API_PREFIX}/Class/export/template`,
  IMPORT_PROBLEM_CLASS:`${API_PREFIX}/class-instance/{instanceId}/slots/{slotId}/problems`,


  GET_STUDENTS_IMPORT_TEMPLATE: `${API_PREFIX}/Class/{classSemesterId}/students/import/template`,
  
  
  IMPORT_STUDENTS: `${API_PREFIX}/students/import`,
  IMPORT_STUDENTS_CLASS_SEMESTER: `${API_PREFIX}/Class/{classSemesterId}/students/import`,
  EXPORT_STUDENTS_CLASS_SEMESTER: `${API_PREFIX}/Class/{classSemesterId}/students/export`,
  UPDATE_SLOT_PROBLEMS:`${API_PREFIX}/class-instance/{instanceId}/slots/{slotId}/problems`,
  DELETE_SLOT_PROBLEMS:`${API_PREFIX}/class-instance/{instanceId}/slots/{slotId}/problems`,
  GET_MY_CLASSES_STUDENT: `${API_PREFIX}/Class/my-classes/student`,
  GET_MY_CLASSES_TEACHER: `${API_PREFIX}/Class/my-classes/teacher`,
}
const SemesterEndpoint = {
  GET_PUBLIC_SEMESTER: `${API_PREFIX}/Semester`,
  GET_DETAIL_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  CREATE_SEMESTER: `${API_PREFIX}/Semester`,
  UPDATE_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  DELETE_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  GET_ALL_SEMESTER:`${API_PREFIX}/Semester/all-semester`,
  IMPORT_TEMPLATE: `${API_PREFIX}/Semester/import/template`,
  IMPORT_SEMESTER: `${API_PREFIX}/Semester/import`,
};
const ClassSlotEndpoint = {
  GET_CLASS_SLOTS: `${API_PREFIX}/class-instance/{classId}/slots`,
  CREATE_CLASS_SLOT: `${API_PREFIX}/class-instance/{instanceId}/slots`,
  
  UPDATE_SLOT_DUE_DATE: `${API_PREFIX}/class-instance/{classId}/slots/{slotId}/due-date`,
  PUBLISH_SLOT: `${API_PREFIX}/class-instance/{classId}/slots/{slotId}/publish`,
  GET_SLOT_SCORES: `${API_PREFIX}/class-instance/{classId}/slots/{slotId}/scores`,
  GET_USER_SUBMISSION: `${API_PREFIX}/class-instance/{classId}/slots/{slotId}/submissions/{userId}`,
};
const NotificationEndpoint = {
  CREATE_NOTIFICATION: `${API_PREFIX}/notification`,
  GET_NOTIFICATION_BY_USER: `${API_PREFIX}/notification/user/{userId}`,
  GET_ALL_NOTIFICATION: `${API_PREFIX}/notification/all`,
  MARK_AS_READ: `${API_PREFIX}/notification/read/{id}`,
  DELETE_NOTIFICATION: `${API_PREFIX}/notification/{id}`,
};
const DiscussionEndpoint = {
  GET_PROBLEM_DISCUSSIONS: `${API_PREFIX}/problems/{problemId}/discussions`,
  CREATE_DISCUSSION: `${API_PREFIX}/problems/{problemId}/discussions`,
  GET_DISCUSSION: `${API_PREFIX}/discussions/{id}`,
  DELETE_DISCUSSION: `${API_PREFIX}/discussions/{id}`,
  VOTE_DISCUSSION: `${API_PREFIX}/discussions/{id}/vote`,
  UPDATE_DISCUSSION: `${API_PREFIX}/discussions/{id}`,

  CREATE_COMMENT: `${API_PREFIX}/discussions/{id}/comments`,
  GET_DISCUSSION_COMMENTS: `${API_PREFIX}/discussions/{id}/comments`,
  
  UPDATE_COMMENT: `${API_PREFIX}/comments/{id}`,
  DELETE_COMMENT: `${API_PREFIX}/comments/{id}`,
  VOTE_COMMENT: `${API_PREFIX}/comments/{id}/vote`,
  HIDE_COMMENT: `${API_PREFIX}/comments/{id}/hide`,
};
const TagEndpoint = {
  GET_TAGS: `${API_PREFIX}/Problems/tags`,
  CREATE_TAG: `${API_LON}/Problems/tags`, // làm rồi
  ATTACH_TAGS_PROBLEM:`${API_LON}Problems/{problemId}/tags/attach`,
 UPDATE_PROBLEM_TAGS: `${API_LON}/Problems/{problemId}/tags` // sẽ làm
};

const ReportEndpoint = {
  CREATE_REPORT: `${API_PREFIX}/reports`,
  APPROVE_REPORT: `${API_PREFIX}/reports/{id}/approve`,
  REJECT_REPORT: `${API_PREFIX}/reports/{id}/reject`,
  GET_PENDING_REPORTS: `${API_PREFIX}/reports/pending`,
  GET_MY_REPORTS: `${API_PREFIX}/reports/my`,
  GET_ALL_REPORTS: `${API_PREFIX}/reports`,
  GET_REPORT_BY_ID: `${API_PREFIX}/reports/{id}`,
  GET_REPORT_GROUPS: `${API_PREFIX}/reports/groups`,
};

const ContestEndpoint = {
  CREATE_CONTEST: `${API_PREFIX}/contests`,
  GET_CONTEST_LIST: `${API_PREFIX}/contests`,
  GET_CONTEST_DETAIL: `${API_PREFIX}/contests/{id}`,
  JOIN_CONTEST: `${API_PREFIX}/contests/{id}/join`,
  ADD_PROBLEM_TO_CONTEST: `${API_PREFIX}/contests/{contestId}/problems`,
  GET_CONTEST_PROBLEMS: `${API_PREFIX}/contests/{contestId}/problems`,
  SUBMIT_CONTEST: `${API_PREFIX}/contests/{contestId}/submit`,
  PUBLISH_CONTEST: `${API_PREFIX}/contests/{id}/publish`,
  LEADERBOARD: `${API_PREFIX}/contests/{contestId}/leaderboard`,
  PING: `${API_PREFIX}/contests/ping`,
};

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
  NotificationEndpoint,
  DiscussionEndpoint,
  TagEndpoint,
  ReportEndpoint,
  ContestEndpoint
};
