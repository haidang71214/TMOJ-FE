"use client";

import React, { useState } from "react";
import { Button, Badge } from "@heroui/react";
import { ShoppingCart } from "lucide-react";
import { useGetCartQuery } from "@/store/queries/store";
import CartModal from "@/app/Modal/CartModal";

export default function CartInNavbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: cartItems = [] } = useGetCartQuery();

  const totalItems = cartItems.length;

  return (
    <>
      <div className="relative">
        <Badge
          content={totalItems}
          color="danger"
          size="sm"
          isInvisible={totalItems === 0}
          className="font-black text-[10px] border-2 border-white dark:border-[#282E3A]"
        >
          <Button
            isIconOnly
            variant="light"
            radius="full"
            className="text-[#4B6382] dark:text-[#A0AEC0] hover:text-[#ff8904] transition-colors"
            onPress={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
          </Button>
        </Badge>
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
