import React, { useEffect } from "react";
import {
  useDisclosure,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Wrap
} from '@chakra-ui/react'
import ResourceNugget from "./ResourceNugget";
import InputNumber from "./InputNumber";
import SelectPicker from "./SelectPicker";
import { useSelector } from "react-redux";
import socket from "../../socket";
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";

export const AccountTransfer = ({ open, toAccount, fromAccount, onClose, onOpen, transactionType }) => {
  const { isOpen, onOpen: OpenModal, onClose: CloseModal } = useDisclosure();
  const { myCharacter, } = useSelector(s => s.auth);
  const gameConfig = useSelector((state) => state.gameConfig);
  const [resources, setResources] = React.useState([]);
  const [add, setAdd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // { type: r.type, balance: r.balance }

  // useEffect(() => {
  //   setResources
  // }, [])

  const handleClose = () => {
    if (onClose && onClose instanceof Function) onClose();
    CloseModal();
    setLoading(false)
  };

  const handleOpen = () => {
    if (onOpen && onOpen instanceof Function) onOpen();
    OpenModal();
  }

  const editState = (incoming, type, index) => {
    console.log(incoming, type, index)
    let thing;
    let temp;
    switch (type) {
      case 'add':
        setResources([...resources, { type: incoming, balance: 0 }])
        setAdd(false)
        break;
      case 'remove':
        setResources(resources.splice(index, 1));
        break;
      case 'increase':
        thing = resources[index];
        temp = [...resources];

        thing.balance = parseInt(incoming);
        temp[index] = thing;
        setResources(temp);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')
    }
  }

  useEffect(() => {
    if (open) handleOpen();
    //else handleClose();
  }, [open]);

  const handleSubmit = () => {
    setLoading(true)
    const data = {
      to: toAccount._id,
      from: fromAccount._id,
      resources,
      character: myCharacter._id
    }
    socket.emit('request', { route: 'transaction', action: 'transfer', data }, (response) => {
      handleClose();
      setLoading(false);
    });
  }

  return (
    <>
      <Button colorScheme={transactionType === 'Withdraw' ? 'yellow' : 'green'} variant={'solid'} onClick={handleOpen} >{transactionType}</Button>

      <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false} isCentered >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{transactionType}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {resources.map((resource, index) =>
              <Box key={index} >
                {resource.type}
                <IconButton icon={<CloseIcon />} onClick={() => setResources(resources.filter(el => el.type !== resource.type))} />
                <ResourceNugget key={resource.type} type={resource.type} width={'80px'} height={'30'} />
                <InputNumber
                  onChange={(ddd) => editState(ddd, 'increase', index)}
                  defaultValue={resource.balance}
                  max={fromAccount.resources.find(el => el.type === resource.type).balance}
                ></InputNumber>
              </Box>
            )}
            {!add && <Button variant='solid' leftIcon={<PlusSquareIcon />} colorScheme="green" onClick={() => setAdd(true)} >Add Resource</Button>}
            {add && <Wrap>
              <IconButton icon={<CloseIcon />} onClick={() => setAdd(false)} />
              {gameConfig.resourceTypes.filter(el => fromAccount.resources.some(r => r.type === el.type) && !resources.some(r => r.type === el.type)).map((resource) => (
                <Button variant={'link'} onClick={() => editState(resource.type, 'add')} key={resource._id}>
                  <ResourceNugget size="sm" type={resource.type} />

                </Button>
              ))}
            </Wrap>}


          </ModalBody>

          <ModalFooter>
            <Button isLoading={loading} variant='solid' colorScheme='red' mr={3} onClick={() => handleClose()}>
              Close
            </Button>
            <Button isLoading={loading} onClick={handleSubmit} variant='ghost'>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

  );
};