import React, { useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, ModalHeader } from "@chakra-ui/react";

export const CandiModal = ({ open, title, onClose, onOpen, children, overlayClose, size="3xl", border }) => {
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
    <Modal  closeOnOverlayClick={overlayClose} scrollBehavior="inside" size={size} isOpen={isOpen} onClose={handleClose} isCentered colorScheme="cyan">
      <ModalOverlay />
      <ModalContent border={border} bgColor="#343840">
        <ModalCloseButton size="sm" top="0px" right="0px" />
        { title && <ModalHeader>{title}</ModalHeader> }
        <ModalBody overflow={'auto'}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};