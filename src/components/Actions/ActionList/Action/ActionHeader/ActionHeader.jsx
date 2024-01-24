import React, { useEffect, useState } from "react";
import { Avatar, Box, Flex, Heading, Icon, IconButton, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { getFadedColor, getThisTeam } from "../../../../../scripts/frontend";
import ActionButtons from "./ActionButtons";
import { AddCharacter } from "../../../../Common/AddCharacter";
import { useSelector } from "react-redux";
import socket from "../../../../../socket";
import usePermissions from "../../../../../hooks/usePermissions";
import HexLocation from "../../../../Locations/HexLocation";
import CharacterTag from "../../../../Common/CharacterTag";
import { getPublicCharacters } from "../../../../../redux/entities/characters";
import { HiPencilAlt } from "react-icons/hi";
import { Close } from "@rsuite/icons";
import { CheckIcon } from "@chakra-ui/icons";

function ActionHeader({ action, time, edit, creator, actionType, hidebuttons }) {
  const { isControl, characterId } = usePermissions();
  const myContacts = useSelector(getPublicCharacters);
  const teams = useSelector(s => s.teams.list);
  const game = useSelector(state => state.gamestate);
  const [isDisabled, setIsDisabled] = useState(true)
  const myCharacter = useSelector(s => s.auth.character)
  const isAccessible = (myCharacter._id === creator?._id || isControl) && action.type !== 'Agenda';
  const roundActive = game.status === 'Active';
  const passed = action.results.length > 0;

  useEffect(() => {
    if (edit) setIsDisabled(true);
  }, [edit])

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
          {actionType.collab && <IconButton
            onClick={() => setIsDisabled(!isDisabled)}
            variant='outline'
            isDisabled={edit || (!roundActive || passed && !isControl)}
            colorScheme={!isDisabled ? 'green' : "yellow"}
            color={!isDisabled ? 'green' : "yellow"}
            size={'xs'}
            icon={<Icon as={!isDisabled ? CheckIcon : HiPencilAlt} />}
          />}
          {action.collaborators.length > 0 && <p>Collaborators</p>}
          {action.collaborators.length > 0 && action.collaborators.map(char =>
            <CharacterTag key={char._id} character={char}
              isDisabled={isDisabled || edit}
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