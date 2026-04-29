export enum ItemType {
  BADGE = "badge",
  TITLE_COLOR = "title_color",
  AVATAR_FRAME = "avatar_frame",
  PHYSICAL_ITEM = "physical_item",
}

export interface StoreItemMeta {
  category?: string;
  sales?: number;
  specs?: string[];
  color?: string;
  glow?: boolean;
  icon?: string;
  rarity?: string;
  sizes?: string[];
  material?: string;
  [key: string]: any;
}

export interface StoreItem {
  itemId: string;
  name: string;
  description: string;
  itemType: ItemType;
  priceCoin: number;
  imageUrl: string;
  durationDays: number | null;
  stockQuantity: number;
  metaJson: StoreItemMeta;
  isActive?: boolean;
}

export interface CartItem {
  cartItemId: string;
  itemId: string;
  name: string;
  imageUrl: string;
  priceCoin: number;
  quantity: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  itemId: string;
  quantity: number;
}

export interface CreateStoreItemRequest {
  name: string;
  description: string;
  itemType: string;
  priceCoin: number;
  file?: File;
  durationDays: number | null;
  stockQuantity: number;
  metaJson: StoreItemMeta;
}

export interface UpdateStoreItemRequest extends Partial<CreateStoreItemRequest> {
  itemId: string;
  isActive?: boolean;
}

export interface BuyItemRequest {
  itemId: string;
}

export interface InventoryItem {
  inventoryId: string;
  itemId: string;
  itemName: string;
  itemImageUrl: string;
  itemType: ItemType;
  acquiredAt: string;
  expiresAt: string | null;
  quantity: number;
  isEquipped: boolean;
  isExpired: boolean;
  metaJson?: StoreItemMeta;
}

export interface StoreResponse<T> {
  data: T;
  message: string | null;
  traceId: string;
}
