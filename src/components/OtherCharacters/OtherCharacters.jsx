import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux store provider
import NewCharacter from "../Control/NewCharacter";
import { getPublicCharacters, getPrivateCharacters, getMyUnlockedCharacters, characterSelected } from "./../../redux/entities/characters";
import { Box, Button, ButtonGroup, Center, Grid, GridItem, Hide, Show } from "@chakra-ui/react";
import { ChevronLeftIcon, DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import CharactersDrawer from "./CharactersDrawer";
import SelectedCharacter from "./SelectedCharacter";
import { useNavigate } from "react-router";
import ModifyCharacter from "./ModifyCharacter";
import { CandiWarning } from "../Common/CandiWarning";
import socket from "../../socket";
import CharacterList from "./CharacterList";

const OtherCharacters = (props) => {
  const navigate = useNavigate();
  const reduxAction = useDispatch();

  const loggedInUser = useSelector((state) => state.auth.user);
  const control = useSelector((state) => state.auth.control);
  const reduxSelected = useSelector((state) => state.characters.selected);
  // const characters = useSelector((state) => state.characters.list);


  const publicCharacters = useSelector(getPublicCharacters);
  const privateCharacters = useSelector(getPrivateCharacters);
  const knownContacts = useSelector(getMyUnlockedCharacters);
  const [selected, setSelected] = useState(props.selected ? props.selected : reduxSelected ? reduxSelected : false);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [filter, setFilter] = useState('');
  const [mode, setMode] = useState(false);
  const [asset, setAsset] = useState(false);

  if (!props.login) {
    navigate("/");
    return <div />;
  }

  let characters = [...publicCharacters, ...knownContacts];
  characters = [...new Set(characters)];

  useEffect(() => {
    if (selected !== reduxSelected)
      setSelected(reduxSelected);
  }, [reduxSelected]);


  useEffect(() => {
    filterThis("");
  }, [publicCharacters, privateCharacters, knownContacts]);

  useEffect(() => {
    if (props.characters && selected) {
      const updated = props.characters.find((el) => el._id === selected._id);
      setSelected(updated);
    }
  }, [props.characters, selected]);

  const deleteCharacter = async () => {
    socket.emit('request', {
      route: 'character',
      action: 'delete',
      data: { id: selected._id }
    });
  };


  const filterThis = (fil) => {
    const filtered = characters.filter(
      (char) =>
        char.characterName.toLowerCase().includes(fil.toLowerCase()) ||
        char.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
        char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
    ).sort((a, b) => { // sort the catagories alphabetically 
      if (a.characterName < b.characterName) { return -1; }
      if (a.characterName > b.characterName) { return 1; }
      return 0;
    });
    setFilteredCharacters(filtered);
    setFilter(fil)
  };

  return (
    <React.Fragment>
      <Box >
        <Grid
          templateAreas={`"list header header"
            "list main main"
          `}
          gridTemplateColumns={window.innerWidth < 1000 ? '0% 100%' : '25% 75%'}
          gridTemplateRows={'80px 1fr'}
          fontWeight='bold'>


          <GridItem pl='1' bg='#0f131a' area={'list'} style={{ height: 'calc(100vh - 78px)', overflow: 'auto', }}>
            <Hide below="md" >
              <CharacterList
                filteredCharacters={filteredCharacters}
                onChange={(e) => filterThis(e.target.value)}
                value={props.filter}
                onClick={() => setMode('new')}
                handleSelect={(char) => { setSelected(char); reduxAction(characterSelected(char)); setMode(false);  }}
                isOpen={mode === 'drawer'}
                onClose={() => setMode(false)}
                filter={filter}
              />
            </Hide>
          </GridItem>



          <GridItem bg='#232c3b' area={'header'} >
            <Center
              marginTop='0.75rem'
              width={'100%'}
            >
              <Box
                marginRight='1rem'
              >
                <Show below='md'>
                  <Button
                    onClick={() => setMode('drawer')}
                    leftIcon={<ChevronLeftIcon />}
                    colorScheme='orange'
                    variant='solid'
                  >
                    <Hide below='md'>Open Drawer</Hide>
                  </Button>
                </Show>

              </Box>
              {control && <Box
                marginLeft='1rem'
              >
                <ButtonGroup isAttached>
                  <Button
                    onClick={() => setMode('new')}
                    leftIcon={<PlusSquareIcon />}
                    colorScheme='green'
                    variant='solid'
                  >
                    <Hide below='md'>New Character</Hide>
                  </Button>

                  <Button
                    onClick={() => setMode('delete')}
                    leftIcon={<DeleteIcon />}
                    colorScheme='red'
                    variant='solid'
                  >
                    <Hide below='md'>Delete</Hide>
                  </Button>

                  <Button
                    onClick={() => setMode('modify')}
                    leftIcon={<EditIcon />}
                    colorScheme='orange'
                    variant='solid'
                  >
                    <Hide below='md'>Edit</Hide>
                  </Button>
                </ButtonGroup>

              </Box>}
            </Center>
          </GridItem>

          <GridItem pl='2' bg='#0f131a' area={'main'} style={{ height: 'calc(100vh - 157px)', overflow: 'auto', }} >
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
        handleSelect={(char) => { reduxAction(characterSelected(char)); setMode(false); }}
        isOpen={mode === 'drawer'}
        onClose={() => setMode(false)}
      />
      {selected && <CandiWarning open={mode === 'delete'} title={`Delete "${selected.characterName}"?`} onClose={() => setMode(false)} handleAccept={() => deleteCharacter()}>
        This can never be undone.
      </CandiWarning>}
    </React.Fragment>
  );
};

export default (OtherCharacters);
