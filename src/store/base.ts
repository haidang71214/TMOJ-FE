import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User","Problem","ProblemList","submittion","Class","Subject","Semester","ClassSlot","Discussion","Reports"],
  endpoints: () => ({}),
});