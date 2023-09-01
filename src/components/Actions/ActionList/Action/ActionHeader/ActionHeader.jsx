import React from "react";
import { AccordionButton, AccordionIcon, Avatar, background, Box, Flex, Heading, Spacer, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import ActionTags from "./ActionTags";
import { getFadedColor } from "../../../../../scripts/frontend";
import ActionButtons from "./ActionButtons";
import { AddCharacter } from "../../../../Common/AddCharacter";
import { useSelector } from "react-redux";
import socket from "../../../../../socket";
import usePermissions from "../../../../../hooks/usePermissions";

function ActionHeader({action, time, toggleEdit, creator, handleDelete, hidebuttons}) {
  const {isControl, characterId} = usePermissions();
	const myContacts = useSelector(s => s.characters.list);
  const game = useSelector(state => state.gamestate);
  const myCharacter = useSelector(s => s.auth.myCharacter)
  const isDisabled = (game.status !== 'Active' || game.round > action.round);
  const isAccessible = myCharacter._id === creator?._id || isControl;
    return (
        <Flex align={'center'} justify={'space-between'} style={{ backgroundColor: getFadedColor(action.type) }} >

          <Box
            marginLeft={'3'}
          >
            <Avatar
              size={'lg'}
              name={creator.characterName}
              src={creator.profilePicture}
              marginRight='auto'
            />
          </Box>

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
                <Tag margin={'2px'} variant={'solid'} colorScheme='purple' >{creator.playerName} - {creator.characterName}</Tag>
                  {action.collaborators.length > 0 && <p>Collaborators</p> }
                  {action.collaborators.length > 0 && action.collaborators.map(char =>
                    // <Tag margin={'2px'} key={char._id} variant={'solid'} colorScheme='telegram' >{char.characterName}</Tag>
                    <Tag margin={'2px'} key={char._id} variant={'solid'} colorScheme='telegram' >
                    <TagLabel>{char.characterName}</TagLabel>
                    {!isDisabled && isAccessible && <TagCloseButton onClick={() => {
                      const data = {
                        id: action._id,
                        collaborator: char._id
                      };
                      socket.emit('request', {
                        route: 'action',
                        action: 'removeCollaborator',
                        data
                      });
                    }}
                    />}
                  </Tag>
                    )}
                    {!isDisabled && isAccessible && <AddCharacter 
                      characters={myContacts.filter(el => !action.collaborators.some(ass => ass?._id === el._id ) )} 
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

          {!hidebuttons && <ActionButtons
              action={action}
              toggleEdit={toggleEdit}
              creator={action.creator}
              handleDelete={handleDelete}
          />}

        </Flex>
    );
}

export default ActionHeader;