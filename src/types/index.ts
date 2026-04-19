import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};
// đã nhét user vào đây
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: Users;
}
export interface LoginGGResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
  user: Users;
}
export interface Logout {
  message: string
}
export enum RoleEnums {
  CLIENT = 0,
  ADMIN = 1,
}
// ép kiểu đầu ra
export interface Users {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  rollNumber: string | null,
  memberCode: string | null,
  status?: boolean;
}

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  MANAGER = "manager",
  ADMIN = "admin",
}

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.STUDENT]: "Student",
  [UserRole.TEACHER]: "Teacher",
  [UserRole.MANAGER]: "Manager",
  [UserRole.ADMIN]: "Admin",
};
export interface ImportUsersResponse {
  code: number;
  message: string;
  data: {
    totalProcessed: number;
    successCount: number;
    failedCount: number;
    errors: string[];
  };
}
export interface ClassMemberResponse {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  joinedAt: string;
  isActive: boolean;
}
export interface ImportProblemClassRequest {
  problemId: string;
  ordinal: number | null;
  points: number | null;
  isRequired: boolean;
}
export interface RegisterRequestDto {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export interface RegisterResponseDto {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}
export interface sendEmailForgotPassword {
  email: string,
}
export interface resetPasswordInformation {
  email: string,
  token: string,
  newPassword: string
}
export interface UserDto {
  id: string;
  name?: string | null;
  email?: string | null;
  imagesUrl?: string | null;
  age: number;
  role?: string | null;
}
export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  statusCode: "draft" | "published";
  isActive: boolean;
  content?: string;
  acceptancePercent: number | null;
  timeLimitMs: number;
  memoryLimitKb: number;
  createdAt: string;
  publishedAt: string | null;
}
export interface ProblemListResponse {
  data: Problem[];
  message: string | null;
  traceId: string;
}
export interface CreateProblemDraftRequest {
  slug: string;
  title: string;
  // difficulty: "easy" | "medium" | "hard";
  typeCode: "algorithm" | "frontend" | "sql" /* thêm nếu có */;
  visibilityCode: "public" | "private";
  scoringCode: "acm" | "partial" | "oi" /* tùy hệ thống */;
  descriptionMd: string;
  displayIndex?: number;
  timeLimitMs: number;
  memoryLimitKb: number;
}
export interface ProblemDraft {
  id: string;                    // UUID dạng string
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";  // hoặc string nếu API linh hoạt hơn
  statusCode: "draft" | "published";       // dựa trên response & code trước
  isActive: boolean;
  acceptancePercent: number | null;
  timeLimitMs: number;
  memoryLimitKb: number;
  createdAt: string;             // ISO datetime string
  publishedAt: string | null;    // ISO hoặc null
}
export interface CreateProblemDraftResponse {
  data: ProblemDraft;
  message: string | null;
  traceId: string;
}
export interface CreateUserDto {
  name?: string | null;
  password?: string | null;
  imagesUrl?: string | null;
  age: number;
}
export interface ProblemTestsetResponse {
  data: HiHi
}
export interface HiHi {
  id: string;
  problemId: string;
  type: string;
  isActive: boolean;
  note?: string;
  storageBlobId?: string;
  expireAt?: string;
  createdAt: string;
}
export interface ProblemTestCaseUploadResult {
  problemId: string;
  slug: string;
  testsetId: string;
  savedTo: string;
  total: number;
}
export interface ProblemTestCaseUploadResponse {
  data: ProblemTestCaseUploadResult;
  message?: string | null;
  traceId: string;
}
export interface ProblemTestsetCreate {
  type: string;
  note?: string;
  createdBy?: string;
  expireAt?: string;
}
export interface UpdateUserDto {
  name?: string | null;
  password?: string | null;
  email?: string | null;
  imagesUrl?: string | null;
  age?: number | null;
}

export enum ProblemTag {
  DP = "dp",
  GREEDY = "greedy",
  GRAPH = "graph",
  TREE = "tree",
  STRING = "string",
  MATH = "math",
  SORTING = "sorting",
  BINARY_SEARCH = "binary_search",
  TWO_POINTERS = "two_pointers",
}
export const PROBLEM_TAG_LABEL: Record<ProblemTag, string> = {
  [ProblemTag.DP]: "Dynamic Programming",
  [ProblemTag.GREEDY]: "Greedy",
  [ProblemTag.GRAPH]: "Graph",
  [ProblemTag.TREE]: "Tree",
  [ProblemTag.STRING]: "String",
  [ProblemTag.MATH]: "Math",
  [ProblemTag.SORTING]: "Sorting",
  [ProblemTag.BINARY_SEARCH]: "Binary Search",
  [ProblemTag.TWO_POINTERS]: "Two Pointers",
};

export interface Contest {
  id: number;
  title: string;
  status: string;
  endsIn?: string;
  startsIn?: string;
  participants: number;
  image: string;
}

export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  progress: number;
  total: number;
  solved?: number;
  dob?: string;
  address?: string;
}

export interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  dept: string;
  status: string;
  progress?: number;
  total?: number;
  solved?: number;
  dob?: string;
  address?: string;
}

export interface Subject {
  subjectId: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}


export type PracticePackage = {
  id: string;
  name: string;
  description?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  published: boolean;
  disabled: boolean;
  price: number;
  image: string;
  createdAt: string;
  problems?: string[];
};
export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard"; // lowercase như trong mock
  points: number;
  // thêm field khác nếu cần, ví dụ:
  // acceptance?: string;
  // tags?: string[];
}
export interface ErrorForm {
  data: Data;
}
export interface Data {
  data: MessageError;
}

export interface MessageError {
  message: string;
}
export interface SubmitResponse {
  submissionId: string
  statusCode: string
  verdictCode: string
  compile: SubmitCompile
  summary: SubmitSummary
  failed: SubmitFailedCase[]
}
export interface SubmitCreateForm {
  code: string,
  name: string,
  description: string
}

export interface SubmitCompile {
  ok: boolean
  exitCode: number
  stdout: string
  stderr: string
}

export interface SubmitSummary {
  passed: number
  total: number
  timeMs: number
}

export interface SubmitFailedCase {
  ordinal: number
  verdict: string
  message: string
}
export interface Runtime {
  id: string
  runtimeName: string
  runtimeVersion: string
  imageRef: string | null
  defaultTimeLimitMs: number
  defaultMemoryLimitKb: number
  isActive: boolean
}export interface RuntimeResponse {
  data: Runtime[]
  message: string | null
  traceId: string
}
export interface SubmissionData {
  id: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  notes: string;
  timestamp: string;
}
export enum VerdictCode {
  AC = "ac",
  WA = "wa",
  RTE = "rte",
  IR = "ir",
  OLE = "ole",
  MLE = "mle",
  TLE = "tle",
  IE = "ie",
  CE = "ce"
}
// Interface đơn giản, gọn, dùng string từ enum
export interface SubmissionResponse {
  data: {
    submissionId: string;
    statusCode: string;           // "done", "pending", ...
    verdictCode: VerdictCode;     // dùng enum ở đây
    compile: {
      ok: boolean;
      exitCode: number;
      stdout: string;
      stderr: string;
    };
    summary: {
      passed: number;
      total: number;
      timeMs: number;
    };
    failed: Array<{
      ordinal: number;
      message: string;
      verdict?: VerdictCode;      // optional
    }>;
  };
  message: string | null;
  traceId: string;
}

export interface SubmissionListItemDto {
  id: string;
  userId: string;
  problemId: string;
  statusCode: string | null;
  verdictCode: string | null;
  finalScore: number | null;
  timeMs: number | null;
  memoryKb: number | null;
  createdAt: string;
  judgedAt: string | null;
}

export interface SubmissionListResponse {
  data: SubmissionListItemDto[];
  message: string | null;
  traceId: string | null;
}

export interface Semester {
  semesterId: string;
  semesterCode: string;
  code: string;
  name: string;
}
export interface SubjectCreateForm {
  code: string;
  name: string;
  description: string
}
export interface SubjectResponseForm {
  subjectId: string,
  code: string,
  name: string,
  description: string,
  isActive: boolean,
}
export interface Teacher {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
}
export interface ClassInstance {
  classSemesterId: string;
  semesterId: string;
  semesterCode: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  subjectDescription: string;
  startAt: string;           // ví dụ: "2026-03-11"
  endAt: string;             // ví dụ: "2026-03-29"
  inviteCode: string | null;
  inviteCodeExpiresAt: string | null;
  createdAt: string;
  teacher: Teacher;
  memberCount: number;
}
export interface ClassItem {
  classId: string;
  classCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  instances: ClassInstance[];     // ← Quan trọng: một class có thể có nhiều instance (nhiều môn/semester)

  totalMemberCount: number;       // tổng thành viên của tất cả instances
}
export interface ClassListData {
  items: ClassItem[];
  totalCount: number;
}
export interface ClassResponse {
  data: ClassListData;
  message: string;
  traceId: string | null;
}
export interface CreateClassRequest {
  subjectId: string;
  semesterId: string;
  classCode?: string | null;
  teacherId?: string | null;
}
export interface UpdateClassTeacherPayload {
  teacherId: string;
}

export interface SemesterItem {
  semesterId: string;
  code: string;
  name: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface SemesterResponse {
  data: {
    items: SemesterItem[];
    totalCount: number;
  };
  message: string;
  traceId: string | null;
}

export interface CreateSemesterRequest {
  code: string;
  name: string;
  startAt: string;
  endAt: string;
}

export interface UpdateSemesterRequest {
  code?: string;
  name?: string;
  startAt?: string;
  endAt?: string;
  isActive: boolean
}

// ── ClassSlot (Assignment) Requests ───────────────────────

export interface CreateClassSlotRequest {
  slotNo: number;
  title: string;
  description?: string;
  rules?: string;
  openAt?: string;
  dueAt?: string;
  closeAt?: string;
  mode: string; // "problemset" | "contest"
  problems?: SlotProblemItem[];
}

export interface SlotProblemItem {
  problemId: string;
  ordinal?: number;
  points?: number;
  isRequired: boolean;
}

export interface UpdateClassSlotRequest {
  title?: string;
  description?: string;
  rules?: string;
  openAt?: string;
  dueAt?: string;
  closeAt?: string;
  isPublished?: boolean;
}

export interface SetDueDateRequest {
  dueAt: string;
  closeAt?: string;
}
export interface ClassSlotResponse {
  id: string;
  classId: string;
  slotNo: number;
  title: string;
  description?: string;
  rules?: string;
  openAt?: string;
  dueAt?: string;
  closeAt?: string;
  mode: string;
  contestId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  problems: SlotProblemResponse[];
}
export interface SlotProblemResponse {
  problemId: string;
  problemTitle?: string;
  problemSlug?: string;
  ordinal?: number;
  points?: number;
  isRequired: boolean;
}
export interface StudentSlotScoreResponse {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  problemScores: ProblemScoreEntry[];
  totalScore: number;
  solvedCount: number;
}export interface ProblemScoreEntry {
  problemId: string;
  problemTitle?: string;
  verdictCode?: string;
  score?: number;
  attempts: number;
  lastSubmittedAt?: string;

}
export interface StudentSubmissionDetailResponse {
  submissionId: string;
  problemId: string;
  problemTitle?: string;
  verdictCode?: string;
  finalScore?: number;
  timeMs?: number;
  memoryKb?: number;
  statusCode?: string;
  createdAt: string;
  results: SubmissionResultEntry[];
}export interface SubmissionResultEntry {
  resultId: string;
  statusCode?: string;
  runtimeMs?: number;
  memoryKb?: number;
  checkerMessage?: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
}

export interface addClassMemberRequest {
  memberCode?: string | null;
  rollNumber?: string | null;
}

export interface DeleteClassStudentRequest {
  classSemesterId: string;
  studentId: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  username: string;
  roles: string[];
}

export interface CreateUserResponse {
  message: string;
  userId: string;
}

export interface UpdateUserRequest {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  password?: string | null;
  roleCode?: string | null;
  status?: boolean | null;
}

export interface SubmitResponseV1 {
  submissionId: string;      // Guid → string trong TS
  judgeRunId: string; // Guid? → optional
  judgeJobId: string;        // Guid → string
  status: string;
  verdictCode: string;
}
export interface SubmitResponseV2 {
  data: SubmitResponseV1
}
export interface DiscussionCommentItem {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
  children: DiscussionCommentItem[];
}

export interface DiscussionItem {
  id: string;
  problemId: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string | null;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt?: string;
  voteCount: number;
  userVote: number;
  comments: DiscussionCommentItem[];
}

export interface ProblemDiscussionsResponse {
  data: {
    items: DiscussionItem[];
    nextCursorCreatedAt: string | null;
    nextCursorId: string | null;
    hasMore: boolean;
  };
  message: string | null;
  traceId: string | null;
}

export interface DiscussionDetailResponse {
  data: DiscussionItem;
  message: string | null;
  traceId: string | null;
}

export interface CreateDiscussionResponse {
  data: DiscussionItem;
  message: string | null;
  traceId: string | null;
}

export interface DiscussionCommentDetail {
  commentId: string;
  discussionId: string;
  parentId: string | null;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
  voteCount: number;
  userVote: number;
  replies: DiscussionCommentDetail[];
}

export interface DiscussionCommentsResponse {
  data: DiscussionCommentDetail[];
  message: string | null;
  traceId: string | null;
}

export interface CreateCommentResponse {
  data: {
    commentId: string;
  };
  message: string | null;
  traceId: string | null;
}

export interface CreateDiscussionRequest {
  problemId: string;
  title?: string | null;
  content?: string | null;
}

export interface UpdateDiscussionRequest {
  id: string;
  title?: string | null;
  content?: string | null;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string | null;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface VoteCommentRequest {
  id: string;
  voteType: number;
}

export interface HideCommentRequest {
  id: string;
  hide: boolean;
}

export interface VoteDiscussionRequest {
  id: string;
  voteType: number;
}
export interface UpdateSlotProblemRequest {
  problemId: string;
  ordinal: number;
  points: number;
  isRequired: boolean;
}

export interface UpdateSlotProblemResponse {
  message: string;
  updated: number;
}

// ── Report API Definitions ───────────────────────

export interface CreateReportRequest {
  targetId: string;
  targetType: "Comment" | "Discussion" | string;
  reason: string;
}

export interface ReportItem {
  id: string;
  targetId: string;
  targetType: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | string;
  createdAt: string;
  authorId?: string;
  authorName?: string;
  problemId?: string;
  moderatorNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface PendingReportsResponse {
  data: {
    items: ReportItem[];
    nextCursorCreatedAt: string | null;
    nextCursorId: string | null;
    hasMore: boolean;
  };
  message: string;
  traceId: string | null;
}

export interface ReportGroupsResponse {
  data: {
    targetId: string;
    targetType: string;
    totalReports: number;
    pendingCount: number;
    approvedCount: number;
    latestCreatedAt: string;
    reasons: string[];
  }[];
  message: string;
  traceId: string | null;
}

export interface MyReportsResponse {
  data: ReportItem[];
  message: string;
  traceId: string | null;
}

export interface AllReportsResponse {
  data: ReportItem[];
  message: string;
  traceId: string | null;
}

export interface ReportDetailResponse {
  data: ReportItem;
  message: string;
  traceId: string | null;
}

// ── Contest API Definitions ───────────────────────

export interface ContestDto {
  id: string;
  title: string;
  description?: string; // Tùy chọn vì trong list của user không có, nhưng response cũ có thể có
  startAt: string;
  endAt: string;
  visibilityCode: string; // Đổi từ visibility sang visibilityCode cho list
  allowTeams: boolean;
  status: string;
  contestType: string;
  isRegistered?: boolean;
  participants?: number; // Thêm nếu cần, từ UpcomingContests.tsx đang dùng (contest as any).participants
}

export interface ContestPagedResult {
  items: ContestDto[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ContestListResponse {
  data: ContestPagedResult;
  message: string | null;
  traceId: string | null;
}

export interface ContestProblemDto {
  id?: string; // contestProblemId
  problemId: string;
  problemTitle?: string;
  alias?: string;
  ordinal?: number;
  displayIndex?: number;
  points?: number;
  maxScore?: number;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  outputLimitKb?: number;
  penaltyPerWrong?: number;
  scoringCode?: string;
  overrideTestsetId?: string;
}

export interface ContestDetailDto {
  id: string;
  title: string;
  description: string;
  slug: string;
  visibility: string;
  contestType: string;
  allowTeams: boolean;
  status: string;
  phase: string;
  isPublished: boolean;
  isFrozen: boolean;
  freezeAt: string | null;
  canViewProblems: boolean;
  canViewDetail: boolean;
  canJoin: boolean;
  isRegistered: boolean;
  hasLeaderboard: boolean;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  problemCount: number;
  totalPoints: number;
  problems: ContestProblemDto[];
}

export interface ContestDetailResponse {
  data: ContestDetailDto;
  message: string | null;
  traceId: string | null;
}

export interface CreateContestRequest {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  visibilityCode: string;
  allowTeams: boolean;
  contestType?: string;
}

export interface CreateContestResponse {
  success: boolean;
  data: string; // contestId
  message: string;
}

export interface UpdateContestResponse {
  success: boolean;
  data: boolean;
  message: string;
}

export interface ChangeVisibilityRequest {
  visibilityCode: "public" | "private" | "hidden" | string;
}

export interface ChangeVisibilityResponse {
  success: boolean;
  data: boolean;
  message: string;
}

export interface UnregisterContestResponse {
  success: boolean;
  data: boolean;
  message: string;
}

export interface JoinContestRequest {
  contestId: string;
  teamId?: string;
}

export interface JoinContestResponse {
  data: string; // contestTeamId
  message: string;
}

export interface AddProblemToContestRequest extends ContestProblemDto {
}

export interface AddProblemToContestResponse {
  success: boolean;
  data: string; // contestProblemId
  message: string;
}

export interface ContestProblemsResponse {
  data: {
    items: ContestProblemDto[];
    totalCount: number;
    page?: number;
    pageSize?: number;
  };
  message: string | null;
  traceId: string | null;
}

export interface SubmitContestRequest {
  contestId: string;
  contestProblemId: string;
  code: string;
  language: string;
}

export interface SubmitContestResponse {
  data: string; // submissionId
  message: string;
}

export interface PublishContestResultDto {
  contestId: string;
  status: string;
  [key: string]: any;
}

export interface PublishContestResponse {
  success: boolean;
  data: PublishContestResultDto;
  message: string;
}

export interface LeaderboardTeamProblem {
  problemId: string;
  solved: boolean;
  penalty: number;
  attempts: number;
}

export interface LeaderboardTeam {
  rank: number;
  teamId: string;
  teamName: string;
  solved: number;
  penalty: number;
  problems: LeaderboardTeamProblem[];
}

export interface LeaderboardResponse {
  contestId: string;
  teams: LeaderboardTeam[];
}

// ── Team API Definitions ───────────────────────

export interface CreateTeamRequest {
  teamName: string;
  avatarUrl?: string | null;
}

export interface CreateTeamResponse {
  data: {
    teamId: string;
    inviteCode: string;
  };
  message: string;
  traceId: string | null;
}

export interface TeamMember {
  userId: string;
  joinedAt: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface TeamDetail {
  id: string;
  teamName: string;
  leaderId: string;
  teamSize: number;
  isPersonal: boolean;
  inviteCode: string;
  createdAt: string;
  members: TeamMember[];
}

export interface TeamDetailResponse {
  data: TeamDetail;
  message: string;
  traceId: string | null;
}

export interface AddTeamMemberRequest {
  teamId: string;
  userId: string;
}

export interface JoinTeamByCodeRequest {
  code: string;
}

export interface JoinTeamByCodeResponse {
  data: any;
  message: string;
  traceId: string | null;
}

// ── New Contest Registration ───────────────────

export interface RegisterContestRequest {
  contestId: string;
  isTeam: boolean;
  teamName: string | null; // This is string as requested in the doc even if it's solo
  memberIds: string[];
}

export interface RegisterContestResponse {
  data: string; // Registration ID
  message: string;
  traceId: string | null;
}
export interface StudentNotYet {
  avatarUrl: string | null;
  displayName: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  memberCode: string | null;
  role: string;
  rollNumber: string | null;
  userId: string;
  username: string;
  // thêm các field khác nếu sau này API trả thêm
}

export interface StudentsNotYetResponse {
  data: {
    items: StudentNotYet[];
    // total?: number;     // nếu sau này API có trường total thì mở ra
  };
}

// ── Problem Editorial API Definitions ───────────────────────

export interface ProblemEditorial {
  id: string;
  problemId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialListResponse {
  data: {
    success: boolean;
    count: number;
    data: ProblemEditorial[];
  };
  message: string | null;
  traceId: string;
}

export interface EditorialDetailResponse {
  data: {
    success: boolean;
    data: ProblemEditorial;
  };
  message: string | null;
  traceId: string;
}

export interface CreateEditorialRequest {
  problemId: string;
  content: string;
}

export interface UpdateEditorialRequest {
  id: string;
  content: string;
}

export interface DeleteEditorialResponse {
  data: {
    success: boolean;
    message: string;
  };
  message: string | null;
  traceId: string;
}

export interface MyContestsResponse {
  success: boolean;
  data: ContestDto[];
  message: string;
}

export interface ContestParticipantMember {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  username: string;
  rollNumber: string | null;
}

export interface ContestParticipantTeam {
  teamId: string;
  teamName: string;
  isPersonal: boolean;
  leaderId: string;
  joinAt: string;
  rank: number;
  score: number;
  solvedProblem: number;
  members: ContestParticipantMember[];
}

export interface ContestParticipantsData {
  totalTeams: number;
  totalUsers: number;
  teams: ContestParticipantTeam[];
}

export interface ContestParticipantsResponse {
  success: boolean;
  data: ContestParticipantsData;
}
