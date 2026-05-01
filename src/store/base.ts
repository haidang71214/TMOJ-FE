import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

// phần này là baseApi của RTK, add thêm các tagtypes cho các module khác vào 
// để dùng chung cho tiện, nếu có api nào mà không cần dùng tag thì bỏ qua
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Problem", "ProblemList", "submittion", "Class", "Subject", "Semester", "ClassSlot", "Discussion", "InviteCode", "Reports", "MyClass", "Tag", "ProblemDetail", "Contest", "Team", "ProblemEditorial", "Collections", "CollectionDetail", "PublicCollections", "UserCollections", "Favorites", "Gamification", "StudyPlan", "ProblemBank", "Payment", "Wallet", "ContestClass", "Notification", "Announcement", "Ranking"],
  endpoints: () => ({}),
});