import React, { useEffect, useContext } from "react";
import { Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, } from "@chakra-ui/react";

export const CandiDrawer = ({ open, onClose, onOpen, children }) => {
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
    <Drawer onClose={handleClose} isOpen={isOpen} placement="right" size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton size="sm" top="0px" right="0px" />
        <DrawerBody p={0}>
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};