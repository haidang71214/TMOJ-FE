'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Modal, ModalBody, ModalContent } from '@heroui/react';

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

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});

  const openModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalConfig({});
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalConfig.title}
        >
          <ModalContent>
          <ModalBody>
            {modalConfig.content}
          </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

// Custom hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal phải được sử dụng trong ModalProvider');
  }
  return context;
};
