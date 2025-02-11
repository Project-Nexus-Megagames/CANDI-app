import React, { useEffect } from "react";
import {  Popover,  PopoverTrigger,  PopoverContent,  PopoverHeader,  PopoverBody,  PopoverFooter,  PopoverArrow,  PopoverCloseButton,  PopoverAnchor,  useDisclosure,  Button,  IconButton,  Input,  Grid,  Box,  VStack,  Divider,  Portal,  Center, Avatar} from '@chakra-ui/react'
import { BsPlus } from "react-icons/bs";

export const AddTag = ({ open, handleSelect, onClose, onOpen, tags, isDisabled }) => {
  const { isOpen, onOpen: OpenModal, onClose: CloseModal, onToggle } = useDisclosure();
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
            <Button isDisabled={isDisabled} variant="solid"  colorScheme='green' size="xs" leftIcon={<BsPlus/>}>Add Tag</Button>
          </Center>
          
        </PopoverTrigger>
        
          <PopoverContent bg='#343a40' minWidth={'30vw'} style={{ zIndex: 99989 }}>
            <PopoverArrow />
            <PopoverHeader><Input style={{ width: '94%' }} value={fill} onChange={(e)=> setFilter(e.target.value)} placeholder={`${tags.length} tags`} /></PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>

            
              <div style={{ maxHeight: '40vh', overflow: 'auto',  }} >
                {tags.map((tag) => (
                  <div onClick={()=> {handleSelect(tag); onToggle();}} key={tag._id}>
                    {tag.name}
                    <Divider />              
                  </div>             
                ))}
                </div>
            </PopoverBody>
          </PopoverContent>

      </Popover>
  );
};