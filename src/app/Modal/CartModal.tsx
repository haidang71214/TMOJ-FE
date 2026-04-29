"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Divider,
  ScrollShadow,
  Badge,
} from "@heroui/react";
import { ShoppingCart, Trash2, CreditCard, ShoppingBag, Plus, Minus } from "lucide-react";
import { useGetCartQuery, useRemoveFromCartMutation, useCheckoutMutation, useAddToCartMutation } from "@/store/queries/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { data: cartItems = [], isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [addToCart] = useAddToCartMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const { t, language } = useTranslation();

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId).unwrap();
      toast.success(language === 'vi' ? "Đã xóa khỏi giỏ hàng" : "Removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (itemId: string, delta: number) => {
    try {
      await addToCart({ itemId, quantity: delta }).unwrap();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout().unwrap();
      toast.success(language === 'vi' ? "Thanh toán thành công! Đồ đã được chuyển vào kho của bạn." : "Checkout successful! Items moved to your inventory.");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Checkout failed. Please check your balance.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white dark:bg-[#1C2737] rounded-[2rem]",
        header: "border-b border-gray-100 dark:border-white/5",
        footer: "border-t border-gray-100 dark:border-white/5",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
            <ShoppingCart size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              {language === 'vi' ? "Giỏ hàng của tôi" : "My Shopping Cart"}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {cartItems.length} {language === 'vi' ? "vật phẩm" : "items"}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
              <p className="text-sm font-bold text-gray-400 uppercase">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600">
                <ShoppingBag size={48} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-black uppercase italic text-gray-400">
                  {language === 'vi' ? "Giỏ hàng trống" : "Your cart is empty"}
                </p>
                <p className="text-xs text-gray-400 max-w-[280px]">
                  {language === 'vi' ? "Hãy ghé qua cửa hàng để chọn cho mình những món đồ ưng ý nhé!" : "Visit the store to pick some awesome items for your profile!"}
                </p>
              </div>
              <Button
                color="primary"
                variant="flat"
                className="font-black uppercase italic px-10 rounded-xl"
                onPress={() => {
                  router.push("/Coin?tab=shop");
                  onClose();
                }}
              >
                {language === 'vi' ? "Đi tới cửa hàng" : "Go to Store"}
              </Button>
            </div>
          ) : (
            <ScrollShadow className="max-h-[400px] pr-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-orange-500/30 transition-all"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        removeWrapper
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm uppercase truncate leading-tight">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <ShoppingBag size={12} className="text-orange-500" />
                        <p className="text-[13px] font-black italic">
                          {item.priceCoin.toLocaleString()} <span className="text-[10px] text-gray-400 uppercase">Coins</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.itemType === "physical_item" && (
                        <div className="flex items-center bg-white dark:bg-[#101828] rounded-xl border dark:border-white/10 p-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="h-7 w-7 min-w-0 rounded-lg"
                            onPress={() => {
                              if (item.quantity > 1) {
                                handleAddToCart(item.itemId, -1);
                              } else {
                                handleRemove(item.cartItemId);
                              }
                            }}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center text-xs font-black">
                            {item.quantity}
                          </span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="h-7 w-7 min-w-0 rounded-lg"
                            onPress={() => handleAddToCart(item.itemId, 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      )}

                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="rounded-xl h-9 w-9"
                        onPress={() => handleRemove(item.cartItemId)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollShadow>
          )}
        </ModalBody>

        {cartItems.length > 0 && (
          <ModalFooter className="flex-col gap-4 p-6">
            <div className="w-full flex justify-between items-center px-2">
              <span className="text-gray-400 font-black uppercase text-xs italic tracking-widest">
                {language === 'vi' ? "Tổng cộng" : "Total Amount"}
              </span>
              <div className="text-right">
                <p className="text-2xl font-black italic text-orange-500 leading-none">
                  {totalAmount.toLocaleString()}
                </p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                  TMOJ Gold Coins
                </p>
              </div>
            </div>

            <Button
              fullWidth
              color="primary"
              size="lg"
              className="h-14 font-black italic uppercase text-lg rounded-2xl shadow-xl shadow-orange-500/20 active-bump"
              startContent={<CreditCard size={20} />}
              onPress={handleCheckout}
              isLoading={isCheckingOut}
            >
              {language === 'vi' ? "Thanh toán ngay" : "Checkout Now"}
            </Button>

            <p className="text-[10px] text-center text-gray-400 font-medium uppercase italic tracking-widest">
              {language === 'vi' ? "Giá đã bao gồm tất cả thuế ảo" : "Prices include all virtual taxes"}
            </p>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
