import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text, StatHelpText } from "@chakra-ui/react";
import { getDateString } from "../../scripts/dateTime";
import { getMyCharacter } from "../../redux/entities/characters";
import Action from "../Actions/ActionList/Action/Action";

const AgendaDrawer = (props) => {
  const [newComment, setNewComment] = useState("");
  const [commentId, setCommentId] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const myChar = useSelector(getMyCharacter);
  const actionTypes = useSelector((state) => state.gameConfig.actionTypes);
  const duck = useSelector((state) => state.gamestate.duck);

  let selected = props.selected;

  const getDuck = () => {
    if (duck)
      return {
        backgroundImage: `url("https://c.tenor.com/xXMKqzQrpJ0AAAAM/skeleton-trumpet.gif")`,
        color: "red",
        fontFamily: "Spook",
      };
  };

  return (
    <Drawer
      style={{ zIndex: 2 }}
      isOpen={props.isOpen}
      placement='top'
      size='full'
      show={props.show}
      closeOnEsc='true'
      onClose={() => {
        props.closeDrawer();
      }}
    >
      <DrawerOverlay />
      <DrawerContent bgColor='#0f131a' style={getDuck()}>
        <DrawerCloseButton />
        <DrawerHeader align='center'>
          <Text>{selected?.name}</Text>
        </DrawerHeader>
        <DrawerBody align='center'>
          {selected &&
            <Action
              action={selected}
              key={selected._id}
              actionType={actionTypes.find(el => el.type === 'Agenda')}
              toggleEdit={(action) => {
                console.log({ show: true, action })
              }}
            />}
          {/* {selected && <SelectedAction special={true} handleSelect={props.closeDrawer} selected={selected} />} */}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AgendaDrawer;
