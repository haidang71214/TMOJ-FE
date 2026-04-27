export const API_PREFIX = "api/v1";
// ví dụ về những cái endpoint
export const API_LON = "api/v2";
const authEndpoint = {
  LOGIN: `${API_PREFIX}/Auth/login`,
  GOOGLE_LOGIN: `${API_PREFIX}/auth/google-login`,
  GITHUB_LOGIN: `${API_PREFIX}/Auth/github-login`,
  REGISTER: `${API_PREFIX}/Auth/register`,
  LOGOUT: `${API_PREFIX}/Auth/logout`,
  FORGOT_PASSWORD: `${API_PREFIX}/Auth/forgot-password`,
  RESET_PASSWORD: `${API_PREFIX}/Auth/reset-password`
};
const userProfileEndpoint = {
  GET_PROFILE: `${API_PREFIX}/User/me`,
  UPDATE_INFOMATION: `${API_PREFIX}/users/profile`,
  UPDATE_ME: `${API_PREFIX}/User/me`,
  UPDATE_AVATAR: `${API_PREFIX}/User/me/avatar`,
  DELETE_AVATAR: `${API_PREFIX}/User/me/avatar`,
  GET_ALL_USERS: `${API_PREFIX}/User`,
  GET_USER_BY_EMAIL: `${API_PREFIX}/User/email/{email}`,
}
const AdminUserEndPoint = {
  GET_LIST_USER: `${API_PREFIX}/User/list-all`, // bệt đuôi api vô
  CREATE_USER: `${API_PREFIX}/User`,
  GET_DETAIL_USER: `${API_PREFIX}/User/{id}`,
  DELETE_USER: `${API_PREFIX}/User/{id}`,
  LOCK_USER_PUT: `${API_PREFIX}/User/{id}/lock`,
  UNLOCK_USER_PUT: `${API_PREFIX}/User/{id}/unlock`,
  GET_USER_UNLOCK: `${API_PREFIX}/User/unlocked`,
  GET_USER_LOCK: `${API_PREFIX}/User/locked`,
  POST_ASSIGN_ROLE: `${API_PREFIX}/User/{id}/role`,
  GET_USER_ROLE: `${API_PREFIX}/User/role/{roleName}`,
  GET_STUDENT_BY_ID: `${API_PREFIX}/User/students/{id}`,
  GET_TEACHER_BY_ID: `${API_PREFIX}/User/teachers/{id}`,
  ASSIGN_TEACHER_ROLE: `${API_PREFIX}/Class/assign-teacher-role`,
  GET_USER_IMPORT_TEMPLATE: `${API_PREFIX}/user/import/template`,
  IMPORT_USERS: `${API_PREFIX}/user/import`,
  UPDATE_USER: `${API_PREFIX}/User/{id}`,
}
// published là để public thuộc status code. ok, auto published. 
// , visibility là để public/private - in -bank.
const ProblemEndPoint = {
  // làm lại cái public problm cho student -> draft cho manager/teacher/admin thấy
  GET_LIST_PROBLEM_PUBLIC: `${API_LON}/Problems/public`, // public là để public thuộc status code. ok, auto published. cho sinh viên, 
  GET_LIST_PROBLEM: `${API_LON}/Problems/public`, // cái ni đang là lấy hết. // visibility code = published/
  CREATE_PROBLEM_DAFT: `${API_LON}/Problems`, // bỏ create mặc định thành cái này
  UPDATE_PROBLEM: `${API_LON}/Problems/{problemId}/content`,
  CREATE_TESTSET_PROBLEM: `${API_PREFIX}/problems/{id}/testsets`,
  CREATE_TESTCASE_PROBLEM: `${API_LON}/Testsets/{id}/testcases`,
  UPDATE_PROBLEM_DIFFICULTY: `${API_LON}/Problems/{problemId}/difficulty`,
  DOWNLOAD_PROBLEM_STATEMENT: `${API_LON}/Problems/{problemId}/statement`,
  // có 1 cái để quản lí problem draft cho problem
  // create problem draft để student tạo -> admin và manager duyệt
  CREATE_PROBLEM_STUDENT: `${API_LON}/Problems/drafts`,
  DONATE_PROBLEM: `${API_LON}/Problems/donate`, // create problem bank
  GET_LIST_PROBLEM_BANK: `${API_LON}/Problems/banks`,
  CREATE_VIRTUAL_PROBLEM: `${API_LON}/Problems/virtual`,
  CREATE_REMIX_PROBLEM: `${API_LON}/Problems/remix`,
}
const ProblemListEndpoint = {
  // cẩn thận chỗ này, nó lấy problem public và nó không lấy hết problem
  GET_LIST_PUBLIC_PROBLEM: `${API_LON}/Problems/public`,
  GET_DETAIL_PUBLIC_PROBLEM: `${API_LON}/Problems/{id}`,
}
// phần này nhớ tách biệt 2 cái, và kiểm soát cờ cho 2 cái khác nhau để update vào state.
const SubmittionEndPoint = {
  GET_SUBMITTION_FROM_USER: `${API_LON}/problems/{problemId}/submissions`, // thực ra cái này là post
  GET_SUBMITTION: `${API_LON}/submissions/{submissionId}`,
  GET_SUBMISSIONS_LIST_BY_PROBLEM: `${API_LON}/submissions/{problemId}/submissionslist`,
  // tách biệt ở đây

}
const RuntimeEndpoint = {
  GET_ALL_RUNTIME: `${API_PREFIX}/Runtimes`,
  GET_DETAIL_RUNTIME: `${API_PREFIX}/Runtimes/{id}`
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
  GET_ALL_CLASS: `${API_PREFIX}/Class`,
  CREATE_CLASS: `${API_PREFIX}/Class`,
  GET_DETAIL_CLASS: `${API_PREFIX}/Class/{id}`,
  PUT_CLASS_TEACHER: `${API_PREFIX}/Class/{id}/teacher`,
  UPDATE_CLASS_SEMESTER: `${API_PREFIX}/Class/{id}/semesters/{classSemesterId}`,
  GET_INVITE_CODE: `${API_PREFIX}/Class/{classSemesterId}/invite-code`,
  CREATE_INVITE_CODE: `${API_PREFIX}/Class/{classSemesterId}/invite-code`,
  DELETE_INVITE_CODE: `${API_PREFIX}/Class/{classSemesterId}/invite-code`,
  GET_CLASS_MEMBERS: `${API_PREFIX}/Class/{classSemesterId}/students`,
  ADD_CLASS_MEMBERS: `${API_PREFIX}/Class/{classSemesterId}/students/manual`,
  DELETE_STUDENT_CLASS_SEMESTER: `${API_PREFIX}/Class/{classSemesterId}/students/{studentId}`,
  JOIN_CLASS_BY_INVITECODE: `${API_PREFIX}/Class/join`,
  EXPORT_CLASS: `${API_PREFIX}/Class/{classSemesterId}/report/export`,
  EXPORT_TEMPLATE_CLASS: `${API_PREFIX}/Class/export/template`,
  IMPORT_CLASS: `${API_PREFIX}/Class/import`,
  IMPORT_TEMPLATE: `${API_PREFIX}/Class/import/template`,
  IMPORT_PROBLEM_CLASS: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/problems`,


  GET_STUDENTS_IMPORT_TEMPLATE: `${API_PREFIX}/Class/{classSemesterId}/students/import/template`,


  IMPORT_STUDENTS: `${API_PREFIX}/students/import`,
  IMPORT_STUDENTS_CLASS_SEMESTER: `${API_PREFIX}/Class/{classSemesterId}/students/import`,
  EXPORT_STUDENTS_CLASS_SEMESTER: `${API_PREFIX}/Class/{classSemesterId}/students/export`,

  UPDATE_SLOT_PROBLEMS: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/problems`,
  DELETE_SLOT_PROBLEMS: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/problems`,
  GET_MY_CLASSES_STUDENT: `${API_PREFIX}/Class/my-classes/student`,
  GET_MY_CLASSES_TEACHER: `${API_PREFIX}/Class/my-classes/teacher`,
  STUDENT_NOT_YET: `${API_PREFIX}/Class/{classSemesterId}/students/available`,
  CREATE_CLASS_CONTEST: `${API_PREFIX}/Class/{classSemesterId}/contests`,
  GET_CLASS_CONTESTS: `${API_PREFIX}/Class/{classSemesterId}/contests`,
  GET_CLASS_CONTEST_DETAIL: `${API_PREFIX}/Class/{classSemesterId}/contests/{contestId}`,
}
const SemesterEndpoint = {
  GET_PUBLIC_SEMESTER: `${API_PREFIX}/Semester`,
  GET_DETAIL_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  CREATE_SEMESTER: `${API_PREFIX}/Semester`,
  UPDATE_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  DELETE_SEMESTER: `${API_PREFIX}/Semester/{id}`,
  GET_ALL_SEMESTER: `${API_PREFIX}/Semester/all-semester`,
  IMPORT_TEMPLATE: `${API_PREFIX}/Semester/import/template`,
  IMPORT_SEMESTER: `${API_PREFIX}/Semester/import`,
  EXPORT_SEMESTER: `${API_PREFIX}/Semester/export`,
};
const ClassSlotEndpoint = {
  GET_CLASS_SLOTS: `${API_PREFIX}/class-semester/{semesterId}/slots`,
  CREATE_CLASS_SLOT: `${API_PREFIX}/class-semester/{semesterId}/slots`,
  UPDATE_SLOT: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}`,
  DELETE_SLOT: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}`,

  UPDATE_SLOT_DUE_DATE: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/due-date`,
  PUBLISH_SLOT: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/publish`,
  GET_SLOT_SCORES: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/scores`,
  GET_USER_SUBMISSION: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/submissions/{userId}`,
  GET_SLOT_RANKINGS: `${API_PREFIX}/class-semester/{semesterId}/slots/{slotId}/rankings`,
};
const NotificationEndpoint = {
  CREATE_NOTIFICATION: `/api/notification`,
  BROADCAST_NOTIFICATION: `/api/notification/broadcast`,
  GET_NOTIFICATION_BY_USER: `/api/notification/user/{userId}`,
  GET_ALL_NOTIFICATION: `/api/notification/all`,
  MARK_AS_READ: `/api/notification/read/{id}`,
  DELETE_NOTIFICATION: `/api/notification/{id}`,
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
  GET_TAGS: `${API_LON}/Problems/tags`,
  CREATE_TAG: `${API_LON}/Problems/tags`, // làm rồi
  ATTACH_TAGS_PROBLEM: `${API_LON}Problems/{problemId}/tags/attach`,
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
  ADD_PROBLEM_TO_CONTEST: `${API_PREFIX}/contests/{contestId}/problems`,
  GET_CONTEST_PROBLEMS: `${API_PREFIX}/contests/{contestId}/problems`,
  SUBMIT_CONTEST: `${API_PREFIX}/contests/{contestId}/submit`,
  PUBLISH_CONTEST: `${API_PREFIX}/contests/{id}/publish`,
  UPDATE_CONTEST: `${API_PREFIX}/contests/{id}`,
  LEADERBOARD: `${API_PREFIX}/contests/{contestId}/leaderboard`,
  REGISTER: `${API_PREFIX}/contests/{contestId}/register`,
  UNREGISTER: `${API_PREFIX}/contests/{contestId}/unregister`,
  DELETE_CONTEST: `${API_PREFIX}/contests/{id}/hard-before-start`,
  GET_MY_CONTESTS: `${API_PREFIX}/contests/me`,
  REMOVE_PROBLEM_FROM_CONTEST: `${API_PREFIX}/contests/{contestId}/problems/{contestProblemId}`,
  CHANGE_VISIBILITY: `${API_PREFIX}/contests/{id}/visibility`,
  EXTEND_CONTEST: `${API_PREFIX}/contests/{id}/extend`,
  JOIN_CONTEST_TEAM_BY_CODE: `${API_PREFIX}/contests/{contestId}/teams/join-by-code`,
  JOIN_CONTEST_BY_CODE: `${API_PREFIX}/contests/join-by-code`,
  GET_CONTEST_PARTICIPANTS: `${API_PREFIX}/contests/{id}/participants`,
  GET_SCOREBOARD: `${API_PREFIX}/contests/{id}/scoreboard`,
  FREEZE_CONTEST: `${API_PREFIX}/contests/{id}/freeze`,
  UNFREEZE_CONTEST: `${API_PREFIX}/contests/{id}/unfreeze`,
  GET_MY_TEAM_IN_CONTEST: `${API_PREFIX}/contests/{id}/my-team`,
};

const TeamEndpoint = {
  CREATE_TEAM: `${API_PREFIX}/teams`,
  GET_TEAM_DETAIL: `${API_PREFIX}/teams/{id}`,
  ADD_TEAM_MEMBER: `${API_PREFIX}/teams/{id}/members`,
  DELETE_TEAM_MEMBER: `${API_PREFIX}/teams/{id}/members/{userId}`,
  JOIN_BY_CODE: `${API_PREFIX}/teams/join-by-code`,
  UPDATE_AVATAR: `${API_PREFIX}/teams/{id}/avatar`,
};

const ProblemEditorialEndpoint = {
  GET_EDITORIALS: `${API_PREFIX}/problem-editorials`,
  CREATE_EDITORIAL: `${API_PREFIX}/problem-editorials`,
  GET_EDITORIAL_BY_ID: `${API_PREFIX}/problem-editorials/{id}`,
  UPDATE_EDITORIAL: `${API_PREFIX}/problem-editorials/{id}`,
  DELETE_EDITORIAL: `${API_PREFIX}/problem-editorials/{id}`,
};

const FavoriteEndpoint = {
  TOGGLE_PROBLEM: `${API_PREFIX}/favorites/problems/{problemId}/toggle`,
  TOGGLE_CONTEST: `${API_PREFIX}/favorites/contests/{contestId}/toggle`,
  CHECK: `${API_PREFIX}/favorites/check`,
  GET_PROBLEMS: `${API_PREFIX}/favorites/problems`,
  GET_CONTESTS: `${API_PREFIX}/favorites/contests`,
};

const CollectionEndpoint = {
  CREATE_COLLECTION: `${API_PREFIX}/favorites/collections`,
  UPDATE_COLLECTION: `${API_PREFIX}/favorites/collections/{id}`,
  DELETE_COLLECTION: `${API_PREFIX}/favorites/collections/{id}`,
  GET_COLLECTIONS: `${API_PREFIX}/favorites/collections`,
  GET_COLLECTION_DETAIL: `${API_PREFIX}/favorites/collections/{id}`,

  ADD_PROBLEM: `${API_PREFIX}/favorites/collections/{id}/problems`,
  ADD_CONTEST: `${API_PREFIX}/favorites/collections/{id}/contests`,
  DELETE_ITEM: `${API_PREFIX}/favorites/collections/{id}/items/{itemId}`,
  REORDER_ITEMS: `${API_PREFIX}/favorites/collections/{id}/reorder`,

  GET_PUBLIC: `${API_PREFIX}/favorites/collections/public`,
  GET_USER_COLLECTIONS: `${API_PREFIX}/users/{userId}/collections`,
  COPY_COLLECTION: `${API_PREFIX}/favorites/collections/{id}/copy`,
};

const StudyPlanEndpoint = {
  GET_ALL: `${API_PREFIX}/study-plans`,
  CREATE_STUDY_PLAN: `${API_PREFIX}/study-plans`,
  CREATE_PROBLEM_INPLAN: `/problem/in-plan`,
  GET_DETAIL: `${API_PREFIX}/study-plans/{id}`,
  ADD_PROBLEM_TO_PLAN: `${API_PREFIX}/study-plans/{planId}/problems/{problemId}`,
}
const GamificationEndpoint = {
  ME: `${API_PREFIX}/gamification/me`,
  BADGES: `${API_PREFIX}/gamification/badges`,
  PROGRESS: `${API_PREFIX}/gamification/badges/progress`,
  STREAK: `${API_PREFIX}/gamification/streak`,
  HISTORY: `${API_PREFIX}/gamification/history`,
  LEADERBOARD: `${API_PREFIX}/gamification/leaderboard`,
  DAILY_ACTIVITIES: `${API_PREFIX}/gamification/daily-activities`,
};

const AdminGamificationEndpoint = {
  BADGES: `${API_PREFIX}/gamification/badges/all`,
  BADGE_ID: `${API_PREFIX}/gamification/badges/{id}`,
  BADGE_RULES: `${API_PREFIX}/gamification/badge-rules`,
  BADGE_RULE_ID: `${API_PREFIX}/gamification/badge-rules/{id}`,
};

const ProblemTemplateEndPoint = {
  CREATE_TEMPLATE: `${API_LON}/ProblemTemplates/{problemId}/templates`,
  GET_TEMPLATES: `${API_LON}/ProblemTemplates/{problemId}/templates`,
  UPDATE_TEMPLATE: `${API_LON}/ProblemTemplates/templates/{codeTemplateId}`,
}
const PaymentEndpoint = {
  VNPAY_CREATE: `${API_PREFIX}/payments/vnpay`,
  VNPAY_CALLBACK: `${API_PREFIX}/payments/vnpay/callback`,
  VNPAY_RETURN: `${API_PREFIX}/payments/vnpay/return`,
  GET_BY_ID: `${API_PREFIX}/payments/{id}`,
  CONVERSION_RATE: `${API_PREFIX}/payments/conversion-rate`,
  HISTORY_ME: `${API_PREFIX}/payments/history/me`,
  HISTORY_ADMIN: `${API_PREFIX}/payments/history/admin`,
};

const WalletEndpoint = {
  BALANCE: `${API_PREFIX}/wallet`,
  TRANSACTIONS: `${API_PREFIX}/wallet/transactions`,
};

const AnnouncementEndpoint = {
  GET_ALL: `${API_PREFIX}/announcements`,
  CREATE: `${API_PREFIX}/announcements`,
  DELETE: `${API_PREFIX}/announcements/{id}`,
};

export {
  ProblemTemplateEndPoint,
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
  ContestEndpoint,
  TeamEndpoint,
  ProblemEditorialEndpoint,
  FavoriteEndpoint,
  CollectionEndpoint,
  StudyPlanEndpoint,
  GamificationEndpoint,
  AdminGamificationEndpoint,
  PaymentEndpoint,
  WalletEndpoint,
  AnnouncementEndpoint
};
