import { StoreEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  StoreItem,
  CreateStoreItemRequest,
  UpdateStoreItemRequest,
  BuyItemRequest,
  InventoryItem,
  StoreResponse,
} from "@/types/store";

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // USER APIs
    getStoreItems: builder.query<StoreItem[], void>({
      query: () => StoreEndpoint.ITEMS,
      transformResponse: (response: StoreResponse<StoreItem[]>) => response.data,
      providesTags: ["Store"],
    }),
    getStoreItemDetail: builder.query<StoreItem, string>({
      query: (itemId) => StoreEndpoint.ITEM_DETAIL.replace("{itemId}", itemId),
      transformResponse: (response: StoreResponse<StoreItem>) => response.data,
      providesTags: (result, error, itemId) => [{ type: "Store", id: itemId }],
    }),
    buyItem: builder.mutation<void, BuyItemRequest>({
      query: (body) => ({
        url: StoreEndpoint.BUY,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store", "Inventory", "Wallet"],
    }),

    // INVENTORY APIs
    getMyInventory: builder.query<InventoryItem[], void>({
      query: () => StoreEndpoint.MY_INVENTORY,
      transformResponse: (response: StoreResponse<InventoryItem[]>) => response.data,
      providesTags: ["Inventory"],
    }),
    getInventoryDetail: builder.query<InventoryItem, string>({
      query: (inventoryId) => StoreEndpoint.INVENTORY_DETAIL.replace("{inventoryId}", inventoryId),
      transformResponse: (response: StoreResponse<InventoryItem>) => response.data,
      providesTags: (result, error, inventoryId) => [{ type: "Inventory", id: inventoryId }],
    }),
    equipItem: builder.mutation<void, { inventoryId: string; isEquipped: boolean }>({
      query: ({ inventoryId, isEquipped }) => ({
        url: StoreEndpoint.EQUIP.replace("{inventoryId}", inventoryId),
        method: "PATCH",
        body: isEquipped, // Boolean directly in body
      }),
      invalidatesTags: ["Inventory", "Gamification"],
    }),
    removeFromInventory: builder.mutation<void, string>({
      query: (inventoryId) => ({
        url: StoreEndpoint.INVENTORY_DETAIL.replace("{inventoryId}", inventoryId),
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),

    // ADMIN APIs
    createStoreItem: builder.mutation<void, CreateStoreItemRequest>({
      query: (body) => ({
        url: StoreEndpoint.ITEMS,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),
    updateStoreItem: builder.mutation<void, UpdateStoreItemRequest>({
      query: ({ itemId, ...body }) => ({
        url: StoreEndpoint.ITEM_DETAIL.replace("{itemId}", itemId),
        method: "PUT",
        body: { itemId, ...body },
      }),
      invalidatesTags: ["Store"],
    }),
    deleteStoreItem: builder.mutation<void, string>({
      query: (itemId) => ({
        url: StoreEndpoint.ITEM_DETAIL.replace("{itemId}", itemId),
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

export const {
  useGetStoreItemsQuery,
  useGetStoreItemDetailQuery,
  useBuyItemMutation,
  useGetMyInventoryQuery,
  useGetInventoryDetailQuery,
  useEquipItemMutation,
  useRemoveFromInventoryMutation,
  useCreateStoreItemMutation,
  useUpdateStoreItemMutation,
  useDeleteStoreItemMutation,
} = storeApi;
