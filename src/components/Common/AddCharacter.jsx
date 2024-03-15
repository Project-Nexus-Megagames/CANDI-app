import React, { useEffect } from "react";
import {  Popover,  PopoverTrigger,  PopoverContent,  PopoverHeader,  PopoverBody,  PopoverFooter,  PopoverArrow,  PopoverCloseButton,  PopoverAnchor,  useDisclosure,  Button,  IconButton,  Input,  Grid,  Box,  VStack,  Divider,  Portal,  Center, Avatar} from '@chakra-ui/react'
import { BsPlus } from "react-icons/bs";
import AssetCard from "./AssetCard";
import CharacterListItem from "../OtherCharacters/CharacterListItem";

export const AddCharacter = ({ open, handleSelect, onClose, onOpen, characters, isDisabled }) => {
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
      <Popover style={{ zIndex: 99989 }} >
        <PopoverTrigger>
          <Center className="styleCenter"  >
            <Button isDisabled={isDisabled} variant="solid"  colorScheme='green' size="xs" leftIcon={<BsPlus/>}>Add Character</Button>
          </Center>
          
        </PopoverTrigger>
        
          <PopoverContent bg='#343a40' minWidth={'30vw'} style={{ zIndex: 99989 }}>
            <PopoverArrow />
            <PopoverHeader><Input style={{ width: '94%' }} value={fill} onChange={(e)=> setFilter(e.target.value)} placeholder={`${characters.length} characters`} /></PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>

            
              <div style={{ maxHeight: '40vh', overflow: 'auto',  }} >
                {characters
                .filter(a => a?.characterName.toLowerCase().includes(fill.toLowerCase()) || a?.playerName.toLowerCase().includes(fill.toLowerCase()))
                .map((character) => (
                  <div  key={character._id}>
                    <CharacterListItem character={character} handleSelect={() => { if (!isDisabled) handleSelect(character); setFilter('') }} />
                    <Divider />              
                  </div>             
                ))}
                </div>
            </PopoverBody>
          </PopoverContent>

      </Popover>
  );
};