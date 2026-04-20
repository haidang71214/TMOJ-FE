import { CollectionEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  CollectionResponse,
  CollectionDetailResponse,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  ReorderCollectionRequest
} from "@/types";

export const collectionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Manage Collections
    createCollection: builder.mutation<CollectionDetailResponse, CreateCollectionRequest>({
      query: (body) => ({
        url: CollectionEndpoint.CREATE_COLLECTION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Collections"],
    }),
    updateCollection: builder.mutation<CollectionDetailResponse, { id: string; body: UpdateCollectionRequest }>({
      query: ({ id, body }) => ({
        url: CollectionEndpoint.UPDATE_COLLECTION.replace("{id}", id),
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Collections", "CollectionDetail"],
    }),
    deleteCollection: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: CollectionEndpoint.DELETE_COLLECTION.replace("{id}", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Collections"],
    }),
    getCollections: builder.query<CollectionResponse, void>({
      query: () => ({
        url: CollectionEndpoint.GET_COLLECTIONS,
        method: "GET",
      }),
      providesTags: ["Collections"],
    }),
    getCollectionDetail: builder.query<CollectionDetailResponse, string>({
      query: (id) => ({
        url: CollectionEndpoint.GET_COLLECTION_DETAIL.replace("{id}", id),
        method: "GET",
      }),
      providesTags: ["CollectionDetail"],
    }),

    // Items
    addProblemToCollection: builder.mutation<{ message: string }, { id: string; problemId: string }>({
      query: ({ id, problemId }) => ({
        url: CollectionEndpoint.ADD_PROBLEM.replace("{id}", id),
        method: "POST",
        body: { problemId },
      }),
      invalidatesTags: ["CollectionDetail"],
    }),
    addContestToCollection: builder.mutation<{ message: string }, { id: string; contestId: string }>({
      query: ({ id, contestId }) => ({
        url: CollectionEndpoint.ADD_CONTEST.replace("{id}", id),
        method: "POST",
        body: { contestId },
      }),
      invalidatesTags: ["CollectionDetail"],
    }),
    deleteCollectionItem: builder.mutation<{ message: string }, { id: string; itemId: string }>({
      query: ({ id, itemId }) => ({
        url: CollectionEndpoint.DELETE_ITEM.replace("{id}", id).replace("{itemId}", itemId),
        method: "DELETE",
      }),
      invalidatesTags: ["CollectionDetail"],
    }),
    reorderCollectionItems: builder.mutation<{ message: string }, { id: string; body: ReorderCollectionRequest }>({
      query: ({ id, body }) => ({
        url: CollectionEndpoint.REORDER_ITEMS.replace("{id}", id),
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CollectionDetail"],
    }),

    // Public / Sharing
    getPublicCollections: builder.query<CollectionResponse, { page?: number; pageSize?: number }>({
      query: (params) => ({
        url: CollectionEndpoint.GET_PUBLIC,
        method: "GET",
        params,
      }),
      providesTags: ["PublicCollections"],
    }),
    getUserCollections: builder.query<CollectionResponse, { userId: string; page?: number; pageSize?: number }>({
      query: ({ userId, ...params }) => ({
        url: CollectionEndpoint.GET_USER_COLLECTIONS.replace("{userId}", userId),
        method: "GET",
        params,
      }),
      providesTags: ["UserCollections"],
    }),
    copyCollection: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: CollectionEndpoint.COPY_COLLECTION.replace("{id}", id),
        method: "POST",
      }),
      invalidatesTags: ["Collections"],
    }),
  }),
});

export const {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
  useGetCollectionDetailQuery,
  useAddProblemToCollectionMutation,
  useAddContestToCollectionMutation,
  useDeleteCollectionItemMutation,
  useReorderCollectionItemsMutation,
  useGetPublicCollectionsQuery,
  useGetUserCollectionsQuery,
  useCopyCollectionMutation,
} = collectionApi;
