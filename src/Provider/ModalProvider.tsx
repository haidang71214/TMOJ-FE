"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/react";

interface ModalConfig {
  title?: string;
  content?: ReactNode;
  actions?: ReactNode;
}

interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});

  const openModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setModalConfig({}), 200);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        backdrop="blur"
        placement="center"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-md",
          base: "bg-transparent shadow-none border-none overflow-visible",
          wrapper: "z-[100] items-center justify-center",
        }}
      >
        <ModalContent className="m-4">
          <ModalBody className="p-0">{modalConfig.content}</ModalBody>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModal phải được sử dụng trong ModalProvider");
  return context;
};
