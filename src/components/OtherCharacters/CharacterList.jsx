import React from "react";
import { Box, Center, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, IconButton, Input, InputGroup, InputLeftElement, Tooltip, useBreakpointValue, VStack, } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import CharacterListItem from "./CharacterListItem";
import { getFadedColor, getTextColor } from "../../scripts/frontend";
import { useSelector } from "react-redux";
import { getPrivateCharacters } from "../../redux/entities/characters";

function CharacterList({ filteredCharacters, value, onChange, onClick, handleSelect, filter, onClose }) {
  const drawerSize = useBreakpointValue({ base: 'full', sm: 'sm' });
  const gameConfig = useSelector(state => state.gameConfig)

  const control = useSelector((state) => state.auth.control);

  return (
    <div>
      <Box>
        <Flex align={'center'} >
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
            >
              <SearchIcon />
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
              variant={'solid'}
              icon={<AddIcon />}
              onClick={onClick}
              colorScheme={'green'}
              style={{
                marginLeft: '1rem'
              }}
              aria-label='Add New Character'
            />
          </Tooltip>}
        </Flex>
      </Box>
      <Box  >
        {gameConfig.characterTags.map((tag, index) => (
          <Box key={index}>

            {(filter.length === 0 || filteredCharacters.filter((el) => el.tags.some((el) => el.toLowerCase() === tag.name.toLowerCase())).length > 0) && 
                <Tooltip label={tag.description} placement='top'>
                <h5 style={{ backgroundColor: tag.color, textAlign: 'center', marginTop: '5px', marginBottom: '5px' }} >{tag.name}</h5>
              </Tooltip>
            }

            <VStack divider={<Divider />} >
              {filteredCharacters.filter((el) => el.tags.some((el) => el.toLowerCase() === tag.name.toLowerCase()))
                .map((character =>
                  <CharacterListItem tag={tag.name} showButton={true} key={character._id} character={character} handleSelect={(character) => handleSelect(character)} />
                ))}
            </VStack>

          </Box>
        ))}
      </Box>
    </div>


  );
}

export default CharacterList;