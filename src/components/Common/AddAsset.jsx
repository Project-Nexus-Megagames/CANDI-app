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
  Text
} from '@chakra-ui/react'
import { BsPlus } from "react-icons/bs";
import AssetCard from "./AssetCard";

export const AddAsset = ({ open, handleSelect, onClose, onOpen, assets, disabled }) => {
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
        <Box className="styleCenter"  >
          <IconButton isDisabled={disabled || assets.length <= 0} variant="solid" colorScheme='green' size="sm" icon={<BsPlus size={'25'} />} />
          {assets.length <= 0 && <Text color='red' >No Assets</Text>}
        </Box>

      </PopoverTrigger>
      <Portal>
        <PopoverContent bg='#343a40' minWidth={'30vw'}>
          <PopoverArrow />
          <PopoverHeader>
            <Input style={{ width: '94%' }} value={fill} onChange={(e) => setFilter(e.target.value)} placeholder={`${assets.length} Assets`} />
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <VStack divider={<Divider />} style={{ maxHeight: '40vh', overflow: 'auto', paddingTop: filteredAssets.length < 3 ? '0vh' : '45vh' }} justify="space-around" align={'center'}  >
              {filteredAssets.map((ass) => (
                <Box key={ass._id} style={{ width: '100%' }}>
                  <AssetCard handleSelect={() => { handleSelect(ass); CloseModal(); }} asset={ass} />
                </Box>
              ))}
            </VStack>

          </PopoverBody>
        </PopoverContent>
      </Portal>

    </Popover>
  );
};