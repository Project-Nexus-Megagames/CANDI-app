import React, { useEffect } from "react";
import { Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, } from "@chakra-ui/react";

export const CandiDrawer = ({ open, onClose, onOpen, children }) => {
  const { isOpen, onOpen: OpenDrawer, onClose: CloseDrawer } = useDisclosure();

  const handleClose = () => { 
    if (onClose && onClose instanceof Function) onClose();
    CloseDrawer();
  };

  const handleOpen = () => {
    if (onOpen && onOpen instanceof Function) onOpen();
    OpenDrawer();
  }

  useEffect(() => {
    if (open) handleOpen();
    else handleClose();
  }, [open]);

  return (
    <Drawer
			isOpen={isOpen}
			placement="top"
			size="full"
			closeOnEsc="true"
			onClose={handleClose}
		>
			<DrawerOverlay />
			<DrawerContent size="sm" top="0px" right="0px" bgColor="#0f131a">
				<DrawerCloseButton />
				<DrawerBody>
          {children}
				</DrawerBody>
			</DrawerContent>
    </Drawer>
  );
};