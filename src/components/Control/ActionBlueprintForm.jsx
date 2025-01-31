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
const ActionBlueprintForm = (props) => {
  const { handleSubmit, defaultValue, closeNew, header, location, subLocation } = props;

  const { gameConfig } = useSelector((state) => state);
  const { myCharacter } = useSelector((s) => s.auth);
  const myContacts = useSelector(s => s.characters.list);
  const locations = useSelector((state) => state.locations.list)
  const subLocations = useSelector((state) => state.locations.subLocations)
  const blueprints = useSelector((state) => state.blueprints.list)


  const [name, setName] = React.useState(defaultValue?.name ? defaultValue.name : '');
  const [description, setDescription] = React.useState(defaultValue?.description ? defaultValue.description : '');
  const [destination, setDestination] = React.useState(defaultValue?.location ? defaultValue.location : location ? location : false);
  const [hex, setHex] = React.useState(defaultValue?.subLocation ? defaultValue.subLocation : subLocation ? subLocation : "");
  const [startingAct, setStartingAct] = React.useState(defaultValue?.startingAct ? defaultValue.startingAct : '');
  const [code, setCode] = React.useState(defaultValue?.code ? defaultValue.code : '');
  const [coords, setCoords] = React.useState({x: 0, y: 0, z: 0})

  const [characters, setCharacters] = React.useState([]);
  const [leader, setLeader] = React.useState(false);

  useEffect(() => {
    if (hex) {
      const sub = subLocations.find(el => el._id === hex);
      if (sub) {
        setCoords({...sub.coords});
        setDestination(sub.location);
      }
    }
  }, [hex]);

  useEffect(() => {
    if (subLocation) {
      console.log(subLocation)
      const sub = subLocations.find(el => el._id === subLocation);
      if (sub) {
        setCoords({...sub.coords})
        setDestination(sub.location)
      }
    }
  }, [subLocation]);


  const editState = (incoming, type, index) => {
    // console.log(incoming, type, index)
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
      startingAct,
      code,
      location: destination,
      subLocation: hex,
      __t: "ActionBlueprint",
      coords
    };
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
            Code:
            {4 - code.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {4 - code.length} more characters...
              </Tag>
            )}
            {4 - code.length <= 0 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='1' value={code} className='textStyle' onChange={(event) => setCode(event.target.value)}></textarea>
          </Box>}
          <Spacer />

          {<Box width={"49%"}>
            <h4>X: {coords.x}, Y: {coords.y}, Z: {coords.z}</h4>
            Sector
            {!destination && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                Select Location
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
                placeholder={destination ? locations.find(el => el._id === destination)?.name : "Select a SubLocation"}
                value={destination}
              />
            </Flex>

            {destination && <Box>
              <h5>{subLocations.find(el => el._id === destination)?.name}</h5>
              <Flex>
                <SelectPicker
                  data={subLocations.filter(el => el.location === destination)}
                  label="name"
                  onChange={setHex}
                  placeholder={subLocation ? subLocations.find(el => el._id === subLocation)?.name : "Select a SubLocation"}
                  value={hex}
                />
              </Flex>
            </Box>}

          </Box>}

          <Spacer />

        </Flex>
        <br />
        <Divider />
        <Flex width={"100%"} >
          <Spacer />

          <Box width={"99%"} >
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


          </Box>


        </Flex>
        <br />
        <h5>{startingAct}</h5>
            <SelectPicker
                data={blueprints}
                label="name"
                valueKey="code"
                onChange={setStartingAct}
                placeholder={"Select a Starting Blueprint"}
                value={startingAct}
              />

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
}

export default ActionBlueprintForm;
