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

export const AddAsset = ({ open, handleSelect, onClose, onOpen, assets }) => {
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

  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(fill.toLowerCase()));

  return (
      <Popover placement='left-start' isLazy>
        <PopoverTrigger>
          <Box className="styleCenter" style={{ minWidth: '100px', minHeight: '100px', border: '3px dotted', margin: '5px' }} >
            <IconButton variant="solid"  colorScheme='green' size="md" icon={<BsPlus/>} /> 
          </Box>
          
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg='#343a40' minWidth={'30vw'}>
            <PopoverArrow />
            <PopoverHeader>
              <Input style={{ width: '94%' }} value={fill} onChange={(e)=> setFilter(e.target.value)} placeholder={`${assets.length} Assets`} />
              </PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              <VStack divider={<Divider />} style={{ maxHeight: '40vh', overflow: 'auto', paddingTop: filteredAssets.length < 3 ? '0vh' : '45vh' }} justify="space-around" align={'center'}  >
                {filteredAssets.map((ass) => (
                  <Box key={ass._id} style={{ width: '100%' }}>
                    <AssetCard  handleSelect={() => { handleSelect(ass); CloseModal(); }} asset={ass}  />
                  </Box>                
                ))}
                </VStack>

            </PopoverBody>
          </PopoverContent>
        </Portal>

      </Popover>
  );
};