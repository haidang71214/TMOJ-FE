import { StoreEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";
import {
  StoreItem,
  CreateStoreItemRequest,
  UpdateStoreItemRequest,
  BuyItemRequest,
  InventoryItem,
  StoreResponse,
  CartItem,
  AddToCartRequest,
} from "@/types/store";

const normalizeStoreItem = (item: any): StoreItem => ({
  itemId: item.itemId || item.ItemId,
  name: item.name || item.Name,
  description: item.description || item.Description,
  itemType: item.itemType || item.ItemType,
  priceCoin: item.priceCoin !== undefined ? item.priceCoin : item.PriceCoin,
  imageUrl: item.imageUrl || item.ImageUrl,
  durationDays: item.durationDays !== undefined ? item.durationDays : item.DurationDays,
  stockQuantity: item.stockQuantity !== undefined ? item.stockQuantity : item.StockQuantity,
  metaJson: typeof item.metaJson === 'string' ? JSON.parse(item.metaJson) : (item.metaJson || item.MetaJson),
  isActive: item.isActive !== undefined ? item.isActive : item.IsActive,
});

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // USER APIs
    getStoreItems: builder.query<StoreItem[], void>({
      query: () => StoreEndpoint.ITEMS,
      transformResponse: (response: StoreResponse<any[]>) =>
        (response.data || []).map(normalizeStoreItem),
      providesTags: ["Store"],
    }),
    getStoreItemDetail: builder.query<StoreItem, string>({
      query: (itemId) => StoreEndpoint.ITEM_DETAIL.replace("{itemId}", itemId),
      transformResponse: (response: StoreResponse<any>) => normalizeStoreItem(response.data),
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
      transformResponse: (response: StoreResponse<any[]>) =>
        (response.data || []).map(item => ({
          inventoryId: item.inventoryId || item.InventoryId,
          itemId: item.itemId || item.ItemId,
          itemName: item.itemName || item.ItemName,
          itemImageUrl: item.itemImageUrl || item.ItemImageUrl,
          itemType: item.itemType || item.ItemType,
          acquiredAt: item.acquiredAt || item.AcquiredAt,
          expiresAt: item.expiresAt || item.ExpiresAt,
          quantity: item.quantity !== undefined ? item.quantity : item.Quantity,
          isEquipped: item.isEquipped !== undefined ? item.isEquipped : item.IsEquipped,
          isExpired: item.isExpired !== undefined ? item.isExpired : item.IsExpired,
        })),
      providesTags: ["Inventory"],
    }),
    getInventoryDetail: builder.query<InventoryItem, string>({
      query: (inventoryId) => StoreEndpoint.INVENTORY_DETAIL.replace("{inventoryId}", inventoryId),
      transformResponse: (response: StoreResponse<any>) => ({
        inventoryId: response.data.inventoryId || response.data.InventoryId,
        itemId: response.data.itemId || response.data.ItemId,
        itemName: response.data.itemName || response.data.ItemName,
        itemImageUrl: response.data.itemImageUrl || response.data.ItemImageUrl,
        itemType: response.data.itemType || response.data.ItemType,
        acquiredAt: response.data.acquiredAt || response.data.AcquiredAt,
        expiresAt: response.data.expiresAt || response.data.ExpiresAt,
        quantity: response.data.quantity !== undefined ? response.data.quantity : response.data.Quantity,
        isEquipped: response.data.isEquipped !== undefined ? response.data.isEquipped : response.data.IsEquipped,
        isExpired: response.data.isExpired !== undefined ? response.data.isExpired : response.data.IsExpired,
      }),
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

    // CART APIs
    getCart: builder.query<CartItem[], void>({
      query: () => StoreEndpoint.CART,
      transformResponse: (response: StoreResponse<CartItem[]>) => response.data || [],
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<void, AddToCartRequest>({
      query: (body) => ({
        url: StoreEndpoint.CART,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<void, string>({
      query: (cartItemId) => ({
        url: StoreEndpoint.CART_ITEM.replace("{cartItemId}", cartItemId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    checkout: builder.mutation<void, void>({
      query: () => ({
        url: StoreEndpoint.CHECKOUT,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Cart", "Inventory", "Wallet", "Store"],
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
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useCheckoutMutation,
} = storeApi;
