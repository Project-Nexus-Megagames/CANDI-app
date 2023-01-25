import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Redux store provider
import NewCharacter from "../Control/NewCharacter";
import { getPublicCharacters, getPrivateCharacters, getMyUnlockedCharacters } from "./../../redux/entities/characters";
import { Accordion, Box, Button, ButtonGroup, Container, Divider, Flex, Grid, GridItem, Hide, Input, InputGroup, InputLeftElement, Spinner, Tag, VStack } from "@chakra-ui/react";
import { getFadedColor, getTextColor } from "../../scripts/frontend";
import { ChevronLeftIcon, EditIcon, PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
import CharactersDrawer from "./CharactersDrawer";
import SelectedCharacter from "./SelectedCharacter";
import { useNavigate } from "react-router";
import ModifyCharacter from "./ModifyCharacter";

const OtherCharacters = (props) => {
  const myCharacter = useSelector((state) => state.auth.myCharacter);
	const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);
  const control = useSelector((state) => state.auth.control);

  const publicCharacters = useSelector(getPublicCharacters);
  const privateCharacters = useSelector(getPrivateCharacters);
  const knownContacts = useSelector(getMyUnlockedCharacters);
  const [selected, setSelected] = useState(myCharacter);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [mode, setMode] = useState(false);
  const [asset, setAsset] = useState(false);

  if (!props.login) {
    navigate("/");
    return <div />;
  }

  let characters = [...publicCharacters, ...knownContacts];
  characters = [...new Set(characters)];

  useEffect(() => {
    filterThis("");
  }, [publicCharacters, privateCharacters, knownContacts]);

  useEffect(() => {
    if (props.characters && selected) {
      const updated = props.characters.find((el) => el._id === selected._id);
      setSelected(updated);
    }
  }, [props.characters, selected]);

  const filterThis = (fil) => {
    const filtered = characters.filter(
      (char) =>
        char.characterName.toLowerCase().includes(fil.toLowerCase()) ||
        char.email.toLowerCase().includes(fil.toLowerCase()) ||
        char.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
        char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
    );
    setFilteredCharacters(filtered);
  };
  
  return (
    <React.Fragment>
      <Box overflowY={'scroll'}>
        <Grid
          templateAreas={`"header header"
            "main main"
          `}
          gridTemplateColumns={ '50% 50%'}
          gridTemplateRows={'80px 1fr'}
          gap='1'
          fontWeight='bold'>
        <GridItem pl='2' bg='#0f131a' area={'header'} >
          <Flex
                    marginTop='2rem'
                    width={'100%'}
                >
                    <Box
                        marginRight='1rem'
                    >
                        <Button
                            onClick={() => setMode('drawer')}
                            leftIcon={<ChevronLeftIcon/>}
                            colorScheme='orange'
                            variant='solid'
                        >
                          <Hide below='md'>Open Drawer</Hide>                            
                        </Button>
                    </Box>
                    {/* <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                        >
                            <SearchIcon/>
                        </InputLeftElement>
                        <Input
                            onChange={(e) => filterThis(e.target.value)}
                            value={props.filter}
                            placeholder="Search"
                            color='white'
                        />
                    </InputGroup> */}
                    {control && <Box
                        marginLeft='1rem'
                    >
                      <ButtonGroup isAttached>
                        <Button
                            onClick={() => setMode('new')}
                            leftIcon={<PlusSquareIcon/>}
                            colorScheme='green'
                            variant='solid'
                        >
                          <Hide below='md'>Create New Character</Hide>                           
                        </Button>
                        <Button
                            onClick={() => setMode('modify')}
                            leftIcon={<EditIcon/>}
                            colorScheme='orange'
                            variant='solid'
                        >
                          <Hide below='md'>Edit Character</Hide>                           
                        </Button>                        
                      </ButtonGroup>

                    </Box>}
          </Flex>
        </GridItem>

        <GridItem pl='2' bg='#0f131a' area={'main'} >
            {!selected && <b>Nothing Selected...</b>}
            {selected && <SelectedCharacter selected={selected} />}
        </GridItem>

      </Grid>
    </Box>

      <NewCharacter show={mode === 'new'} closeModal={() => setMode(false)} />
      {selected && <ModifyCharacter show={mode === 'modify'} selected={selected} closeModal={() => setMode(false)} />}
      <CharactersDrawer 
        filteredCharacters={filteredCharacters}
        onChange={(e) => filterThis(e.target.value)}
        value={props.filter}
        onClick={() => setMode('new')}
        handleSelect={(char) => { setSelected(char); setMode(false); }}
        isOpen={mode === 'drawer'}
        onClose={() => setMode(false)}
      />
    </React.Fragment>
  );
};

export default (OtherCharacters);
