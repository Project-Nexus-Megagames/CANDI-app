import React from "react";
import {  Box, Center,Divider,Drawer,DrawerBody,DrawerCloseButton,DrawerContent,DrawerFooter,DrawerHeader,DrawerOverlay,Flex,IconButton,Input,InputGroup,InputLeftElement,Tooltip,useBreakpointValue, VStack,} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import CharacterListItem from "./CharacterListItem";
import { getFadedColor, getTextColor } from "../../scripts/frontend";
import { useSelector } from "react-redux";
import { getPrivateCharacters } from "../../redux/entities/characters";

function CharactersDrawer({filteredCharacters, value, onChange, onClick, handleSelect, isOpen, onClose}) {
  const drawerSize = useBreakpointValue({base: 'full', sm: 'sm'});
  const [renderTags] = React.useState(["Control", "PC", "NPC"]); // TODO: update with Faction tags
  const myCharacter = useSelector((state) => state.auth.myCharacter);
  const privateCharacters = useSelector(getPrivateCharacters);
  const control = useSelector((state) => state.auth.control);

  return (
  <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onClose}
      isFullHeight
      size={drawerSize}
  >
            <DrawerOverlay/>
            <DrawerContent
                style={{
                    backgroundColor: "#0f131a"
                }}
            >
                <DrawerCloseButton/>
                <DrawerHeader>
                    <Center
                        marginBottom='1rem'
                    >
                        Character List
                    </Center>
                    <Flex>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'
                            >
                                <SearchIcon/>
                            </InputLeftElement>
                            <Input
                                onChange={onChange}
                                value={value}
                                placeholder="Search"
                                color='white'
                            />
                        </InputGroup>
                        {control && <Tooltip
                            label='Add New Character'
                            aria-label='a tooltip'
                        >
                            <IconButton
                                icon={<AddIcon/>}
                                onClick={onClick}
                                colorScheme={'green'}
                                style={{
                                    marginLeft: '1rem'
                                }}
                                aria-label='Add New Character'
                            />
                        </Tooltip>}
                    </Flex>
                </DrawerHeader>
                <DrawerBody>
                {renderTags.map((tag, index) => (
                  <Box key={index}>
                      <Box
                          marginTop='2rem'
                      />
                      <h5 style={{ backgroundColor: getFadedColor(tag), color: getTextColor(`${tag}-text`), textAlign: 'center',  }} >{tag}</h5>
                      <Box
                          marginBottom='1rem'
                      />
                      <VStack divider={<Divider/>} > 
                        {filteredCharacters
                        .filter((el) => el.tags.some((el) => el.toLowerCase() === tag.toLowerCase()))
                          .map((character =>
                            <CharacterListItem key={character._id} character={character} handleSelect={(character) => handleSelect(character)}  />
                          ))}        
                      </VStack>

                  </Box>
                ))}

                {myCharacter.tags.some((el) => el.toLowerCase() === "control") && (
                  <VStack divider={<Divider/>} >
                    <p style={{ backgroundColor: getFadedColor("Unknown"), color: getTextColor(`${"Unknown"}-text`) }}>{"( Hidden )"}</p>
                    {privateCharacters
                      // .filter()
                      .map((character) => (
                        <CharacterListItem key={character._id} character={character} handleSelect={(character) => handleSelect(character)}  />
                      ))}
                  </VStack>
                )}

                </DrawerBody>
                <DrawerFooter/>
            </DrawerContent>
  </Drawer>
  );
}

export default CharactersDrawer;