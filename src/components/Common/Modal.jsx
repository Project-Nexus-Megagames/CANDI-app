import React, { useEffect, useContext } from "react";
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure } from "@chakra-ui/react";

export const CandiModal = ({ open, onClose, onOpen, children }) => {
  const { isOpen, onOpen: Open, onClose: Close } = useDisclosure();

  useEffect(() => {
    if (open) handleOpen();
    else handleClose();
  }, [open]);

  const handleClose = () => { 
    if (onClose && onClose instanceof Function) onClose();
    Close();
  };

  const handleOpen = () => {
    if (onClose && onClose instanceof Function) onOpen();
    Open();
  }

  return (
    <Modal size="2xl" onClose={handleClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton size="sm" top="0px" right="0px" />
        <ModalBody p={0}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};