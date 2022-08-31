import React, { useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, ModalHeader } from "@chakra-ui/react";

export const CandiModal = ({ open, title, onClose, onOpen, children }) => {
  const { isOpen, onOpen: OpenModal, onClose: CloseModal } = useDisclosure();

  const handleClose = () => { 
    if (onClose && onClose instanceof Function) onClose();
    CloseModal();
  };

  const handleOpen = () => {
    if (onOpen && onOpen instanceof Function) onOpen();
    OpenModal();
  }

  useEffect(() => {
    if (open) handleOpen();
    else handleClose();
  }, [open]);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor="#0f131a">
        <ModalCloseButton size="sm" top="0px" right="0px" />
        { title && <ModalHeader>{title}</ModalHeader> }
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};