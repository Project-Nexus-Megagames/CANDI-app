import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Center,
  Box,
  Avatar,
  HStack,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react';
import { getDateString } from '../../scripts/dateTime';
import { getMyCharacter } from '../../redux/entities/characters';
import socket from '../../socket';
import ResourceNugget from './ResourceNugget';
import ModifyCharacter from '../OtherCharacters/ModifyCharacter';
import DynamicForm from '../OtherCharacters/DynamicForm';

const ViewCharacter = (props) => {
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [asset, setAsset] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const myChar = useSelector(getMyCharacter);
  const loggedInUser = useSelector((state) => state.auth.user);

  let selected = props.selected;

  const copyToClipboard = (character) => {
    if (character.characterName === 'The Box') {
      const audio = new Audio('/candi1.mp3');
      audio.loop = true;
      audio.play();
    } else {
      let board = `${character.email}`;
      let array = [...character.control];

      for (const control of props.myCharacter.control) {
        if (!array.some((el) => el === control)) {
          array.push(control);
        }
      }

      for (const control of array) {
        const character = props.characters.find((el) => el.characterName === control);
        if (character) {
          board = board.concat(`; ${character.email}`);
        } else console.log(`${control} could not be added to clipboard`);
        // Alert.error(`${control} could not be added to clipboard`, 6000);
      }

      navigator.clipboard.writeText(board);
      // Alert.success('Email Copied!', 6000);
    }
  };

  const openAnvil = (character) => {
    if (character.characterName === 'The Box') {
      const audio = new Audio('/candi1.mp3');
      audio.loop = true;
      audio.play();
    } else {
      if (character.wiki && character.wiki !== '') {
        let url = character.wiki;
        const win = window.open(url, '_blank');
        win.focus();
      }
    }
  };

  return (
    <Drawer
      isOpen={props.isOpen}
      placement="right"
      size="xl"
      show={props.show}
      closeOnEsc="true"
      onClose={() => {
        props.closeDrawer();
      }}
    >
      <DrawerOverlay />
      <DrawerContent bgColor="#0f131a">
        <DrawerCloseButton />
        <DrawerHeader align="center">
          <Text>{selected?.characterName}</Text>
        </DrawerHeader>
        <DrawerBody>
          Coming Soon
          <ModifyCharacter
            show={edit}
            selected={selected}
            closeModal={() => {
              setEdit(false);
            }}
          />
          <DynamicForm show={asset !== false} selected={asset} closeDrawer={() => setAsset(false)} />
        </DrawerBody>

      </DrawerContent>
    </Drawer>
  );
};

export default ViewCharacter;
