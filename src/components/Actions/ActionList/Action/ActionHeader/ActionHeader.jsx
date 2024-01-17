import React from "react";
import { Avatar, Box, Flex, Heading, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { getFadedColor, getThisTeam } from "../../../../../scripts/frontend";
import ActionButtons from "./ActionButtons";
import { AddCharacter } from "../../../../Common/AddCharacter";
import { useSelector } from "react-redux";
import socket from "../../../../../socket";
import usePermissions from "../../../../../hooks/usePermissions";
import HexLocation from "../../../../Locations/HexLocation";
import CharacterTag from "../../../../Common/CharacterTag";
import { getPublicCharacters } from "../../../../../redux/entities/characters";

function ActionHeader({ action, time, toggleEdit, creator, handleDelete, hidebuttons }) {
  const { isControl, characterId } = usePermissions();
  const myContacts = useSelector(getPublicCharacters);
  const teams = useSelector(s => s.teams.list);
  const game = useSelector(state => state.gamestate);
  const myCharacter = useSelector(s => s.auth.character)
  const isDisabled = false;
  const isAccessible = (myCharacter._id === creator?._id || isControl) && action.type !== 'Agenda';
  return (
    <Flex gap={5} align={'center'} justify={'center'} style={{ backgroundColor: getFadedColor(action.type) }} >
      <Box
        alignItems='center'
        justifyContent='center'
        margin={'5px'}
      >
        <Heading
          size={'md'}
          textAlign={'center'}
        >
          {action.name}
        </Heading>
        <Box
          fontSize={'.9rem'}
          fontWeight={'normal'}
        >
          <CharacterTag character={action.creator} />
          {action.collaborators.length > 0 && <p>Collaborators</p>}
          {action.collaborators.length > 0 && action.collaborators.map(char =>
            <CharacterTag key={char._id} character={char}
              isDisabled={isDisabled}
              isAccessible={isAccessible}
              onClick={() => {
                const data = {
                  id: action._id,
                  collaborator: char._id
                };
                socket.emit('request', {
                  route: 'action',
                  action: 'removeCollaborator',
                  data
                });
              }} />
          )}

          {!isDisabled && isAccessible && <AddCharacter
            characters={myContacts.filter(el => !action.collaborators.some(ass => ass?._id === el._id))}
            handleSelect={(character) => {
              const data = {
                id: action._id,
                collaborator: character._id
              };
              socket.emit('request', {
                route: 'action',
                action: 'addCollaborator',
                data
              });
            }}
          />}
        </Box>
        <Box
          fontSize={'.9rem'}
          fontWeight={'normal'}
        >
          {time}
        </Box>
      </Box>
    </Flex>
  );
}

export default ActionHeader;