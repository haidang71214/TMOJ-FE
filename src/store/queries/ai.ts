import { AiEndpoint } from "@/constants/endpoints";
import { AiDebugRequest, AiDebugResponse, AiEditorialRequest, AiEditorialResponse } from "@/types/ai";
import { baseApi } from "../base";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateAiDebug: builder.mutation<AiDebugResponse, AiDebugRequest>({
      query: ({ submissionId, ...body }) => ({
        url: AiEndpoint.DEBUG.replace("{submissionId}", submissionId),
        method: "POST",
        body,
      }),
    }),
    generateAiEditorial: builder.mutation<AiEditorialResponse, AiEditorialRequest>({
      query: ({ problemId, ...body }) => ({
        url: AiEndpoint.GENERATE_EDITORIAL.replace("{problemId}", problemId),
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGenerateAiDebugMutation,
  useGenerateAiEditorialMutation,
} = aiApi;
