import React, { useEffect } from "react";
import { Tooltip, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, ModalHeader, IconButton } from "@chakra-ui/react";
import { QuestionIcon } from "@chakra-ui/icons";

export const InfoTip = ({ children }) => {
  const { isOpen, onOpen: OpenModal, onClose: CloseModal } = useDisclosure();

  return (
    <Tooltip
    label={children}
    aria-label='a tooltip'
>
    <IconButton cursor={'help'} colorScheme={'blue'} variant="link" icon={<QuestionIcon />} />
</Tooltip>
  );
};