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
  Portal,
  Center
} from '@chakra-ui/react'
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

  return (
      <Popover placement='auto' isLazy>
        <PopoverTrigger>
          <Center className="styleCenter" style={{ minWidth: '100px', minHeight: '100px', border: '3px dotted', margin: '5px' }} >
            <IconButton variant="solid"  colorScheme='green' size="md" icon={<BsPlus/>} /> 
          </Center>
          
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg='#343a40' minWidth={'30vw'}>
            <PopoverArrow />
            <PopoverHeader><Input style={{ width: '94%' }} value={fill} onChange={(e)=> setFilter(e.target.value)} placeholder={`${assets.length} Assets`} /></PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
            
              <VStack divider={<Divider />} style={{ maxHeight: '40vh', overflow: 'auto', paddingTop: assets.length < 3 ? '0vh' : '45vh' }} justify="space-around" align={'center'}  >
                {assets.filter(a => a.name.toLowerCase().includes(fill.toLowerCase())).map((ass) => (
                  <Box key={ass._id} style={{ width: '100%' }}>
                    <AssetCard disabled  handleSelect={() => { handleSelect(ass); CloseModal(); }} asset={ass}  />
                  </Box>                
                ))}
                </VStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>

      </Popover>
  );
};