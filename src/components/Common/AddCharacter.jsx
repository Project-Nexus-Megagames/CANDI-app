import React, { useEffect } from "react";
import {  Popover,  PopoverTrigger,  PopoverContent,  PopoverHeader,  PopoverBody,  PopoverFooter,  PopoverArrow,  PopoverCloseButton,  PopoverAnchor,  useDisclosure,  Button,  IconButton,  Input,  Grid,  Box,  VStack,  Divider,  Portal,  Center, Avatar} from '@chakra-ui/react'
import { BsPlus } from "react-icons/bs";
import AssetCard from "./AssetCard";

export const AddCharacter = ({ open, handleSelect, onClose, onOpen, characters }) => {
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
      <Popover placement='right-start' isLazy>
        <PopoverTrigger>
          <Center className="styleCenter"  >
            <Button variant="solid"  colorScheme='green' size="xs" leftIcon={<BsPlus/>}>Add Character</Button>
          </Center>
          
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg='#343a40' minWidth={'30vw'}>
            <PopoverArrow />
            <PopoverHeader><Input style={{ width: '94%' }} value={fill} onChange={(e)=> setFilter(e.target.value)} placeholder={`${characters.length} characters`} /></PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
            
              <VStack divider={<Divider />} style={{ maxHeight: '40vh', overflow: 'auto', }} justify="space-around" align={'center'}  >
                {characters.filter(a => a.characterName.toLowerCase().includes(fill.toLowerCase())).map((character) => (
                  <Box onClick={() => handleSelect(character)} key={character._id} className="styleCenter" >
                    <Avatar size="lg" src={character.profilePicture} alt="?" />
                    {character.characterName}
                  </Box>                
                ))}
                </VStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>

      </Popover>
  );
};