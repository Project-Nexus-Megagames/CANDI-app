import React, { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  AlertDialogCloseButton,
  Button
} from '@chakra-ui/react'

export const CandiWarning = ({ open, title, onClose, onOpen, children, handleAccept }) => {
  const { isOpen, onOpen: OpenModal, onClose: CloseModal } = useDisclosure();
  const cancelRef = React.useRef()

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
    <AlertDialog
      motionPreset='slideInBottom'
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      
    >
      <AlertDialogOverlay />

      <AlertDialogContent style={{ backgroundColor: "#343840", color: 'white' }}>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody >
          {children}
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant={'solid'} colorScheme='red' ref={cancelRef} onClick={onClose}>
            Nooo
          </Button>
          <Button variant={'solid'} colorScheme='green' onClick={() => { onClose(); handleAccept(); }} ml={3}>
            Yes!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    );
};