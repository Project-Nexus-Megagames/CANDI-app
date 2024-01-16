import React, { useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure,
  Button,
  IconButton,
  Input,
  Grid,
  Box,
  VStack,
  Divider,
  Portal
} from '@chakra-ui/react'
import Worker from "../Team/Worker";
import { BsPlus } from "react-icons/bs";
import AssetCard from "./AssetCard";

export const AddResource = ({ open, handleSelect, onClose, onOpen, assets }) => {
  const { isOpen, onOpen: OpenModal, onClose: CloseModal } = useDisclosure();
	const [fill, setFilter] = React.useState('');

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
      <Popover placement='left-start' isLazy>
        <PopoverTrigger>
          <Box className="styleCenter"  >
            <IconButton variant="solid"  colorScheme='green' size="sm" icon={<BsPlus/>} /> 
          </Box>
          
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg='#343a40' minWidth={'30vw'}>
            <PopoverArrow />
            <PopoverHeader>
            </PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>

            </PopoverBody>
          </PopoverContent>
        </Portal>

      </Popover>
  );
};