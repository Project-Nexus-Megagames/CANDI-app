import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tag, Box, Flex, Button, Divider, Spacer, useBreakpointValue, Icon, TagLabel, TagCloseButton, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { HiSave } from 'react-icons/hi';
import SelectPicker from '../Common/SelectPicker';
import { getPlayerCharacters, getPublicCharacters } from '../../redux/entities/characters';
import { AddCharacter } from '../Common/AddCharacter';
import CharacterTag from '../Common/CharacterTag';

/**
 * Form for a new ACTION
 * @param { handleSubmit, defaultValue, teamID, closeNew } props
 * @returns Component
 */
const TeamForm = (props) => {
  const { handleSubmit, defaultValue, teamID, closeNew, header } = props;

  const { gameConfig } = useSelector((state) => state);
  const { myCharacter } = useSelector((s) => s.auth);
  const myContacts = useSelector(s => s.characters.list);
  const locations = useSelector((state) => state.locations.list)
  const facilities = useSelector((state) => state.facilities.list)


  const [name, setName] = React.useState(defaultValue?.name ? defaultValue.name : '');
  const [description, setDescription] = React.useState(defaultValue?.description ? defaultValue.description : '');
  const [destination, setDestination] = React.useState(defaultValue?.location ? defaultValue.location : false);
  const [color, setColor] = React.useState(defaultValue?.color ? defaultValue.color : '');

  const [characters, setCharacters] = React.useState([]);
  const [leader, setLeader] = React.useState(false);
  const playerCharacters = useSelector(getPublicCharacters);

  const breakpoints = useBreakpointValue({
    base: { columns: 0, rows: 3, width: '15rem', bottom: '1.75rem', left: '7.5rem' },
    md: { columns: 3, rows: 0, width: '10rem', bottom: '1.75rem', left: '5rem' },
    lg: { columns: 3, rows: 0, width: '15rem', bottom: '1.75rem', left: '7.5rem' }
  })


  useEffect(() => {
    console.log(destination);
  }, [destination])

  const editState = (incoming, type, index) => {
    console.log(incoming, type, index)
    let thing;
    switch (type) {
      case 'selectLeader':
        setLeader(incoming);
        if (!characters.some(el => el._id === incoming._id)) setCharacters([...characters, incoming]);
        break;
      case 'removeCharacter':
        setCharacters(characters.filter(c => c._id !== incoming._id));
        if (leader._id === incoming._id) setLeader(false)
        break;
      case 'addCharacter':
        setCharacters([...characters, incoming]);
        break;
      default:
        console.log(`uWu Scott made an oopsie doodle! ${type} `);
    }
  };

  const passSubmit = async () => {
    // 1) make a new action
    const data = {
      name: name,
      description,
      color,
      hq: destination,
      leader: leader._id,
      characters: characters.map(c => c._id),
      id: teamID
    };
    console.log(data)
    // closeNew();
    handleSubmit(data)

    //setName('');

  };

  function isDisabled(effort) {
    if ((name.length < 10)) return true;
    else return false;
  }

  return (
    <div>
      {header && <h4>{header}</h4>}
      <br />
      <form>
        <Flex width={"100%"} align={"end"} >
          <Spacer />
          {<Box width={"49%"}>
            Name:
            {10 - name.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {10 - name.length} more characters...
              </Tag>
            )}
            {10 - name.length <= 0 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='1' value={name} className='textStyle' onChange={(event) => setName(event.target.value)}></textarea>
          </Box>}
          <Spacer />

          {<Box width={"49%"}>
            HQ
            {!destination && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                Select Head Quarters
              </Tag>
            )}

            {destination && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <h5>{locations.find(el => el._id === destination)?.name}</h5>
            <Flex>
              <SelectPicker
                data={locations}
                label="name"
                onChange={setDestination}
                placeholder={destination ? locations.find(el => el._id === destination)?.name : "Select a Location"}
                value={destination}
              />
            </Flex>

          </Box>}

          <Spacer />

        </Flex>
        <br />
        <Divider />
        <Flex width={"100%"} >
          <Spacer />

          <Box width={"49%"} >
            Description:
            {10 - description.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {10 - description.length} more characters...
              </Tag>
            )}
            {10 - description.length <= 0 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='6' value={description} className='textStyle' onChange={(event) => setDescription(event.target.value)} />
          
            <b style={{ backgroundColor: color, padding: '3px' }}>Color</b>
            {color && <Text color={color} >{color}</Text>}
          <textarea rows='1' value={color} className='textStyle' onChange={(event) => setColor(event.target.value)}></textarea>
          </Box>

          <Spacer />

          <Box width={"49%"}>
            Team Leader:
            {!leader && <AddCharacter characters={playerCharacters} handleSelect={(char) => editState(char, 'selectLeader')} />}
            {leader && <Box>
              <CharacterTag isAccessible character={leader} onClick={() => setLeader(false)} />
            </Box>}
            Team Members:
            <AddCharacter
              characters={playerCharacters.filter(el => !characters.some(ass => ass?._id === el._id))}
              handleSelect={(char) => editState(char, 'addCharacter')} />
            {characters.length > 0 && characters.map(char =>
              <CharacterTag isAccessible key={char._id} character={char} onClick={() => editState(char, 'removeCharacter')} />
            )}
          </Box>


        </Flex>
        <br />


        <br />

      </form>
      <div
        style={{
          justifyContent: 'end',
          display: 'flex',
          marginTop: '15px',
          textAlign: 'center'
        }}
      >
        <Spacer />
        <Button leftIcon={<Icon as={HiSave} />} colorScheme="green" onClick={() => passSubmit()} variant='solid' disabled={isDisabled()} >
          <b>Submit</b>
        </Button>
        <Button colorScheme="red" onClick={() => closeNew()} variant='outline'>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TeamForm;
