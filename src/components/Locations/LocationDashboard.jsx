import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Grid, GridItem, VStack, Wrap } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import { getFadedColor } from '../../scripts/frontend';
import HexMap from './HexMap';
import ResourceNugget from '../Common/ResourceNugget';
import { getLocationContracts } from '../../redux/entities/assets';
import Contract from '../Common/Contract';
import StatBar from './StatBar';
import { CandiModal } from '../Common/CandiModal';
import FacilityForm from '../Common/FacilityForm';
import FacilityCard from '../Common/FacilityCard';
import LocationForm from './LocationForm';
import { getPlayersPresent } from '../../redux/entities/characters';
import { getMyLocation } from '../../redux/entities/locations';

const LocationDashboard = (props) => {
  const navigate = useNavigate();
  const locations = useSelector(s => s.locations.list);
  const facilities = useSelector(s => s.facilities.list);
  const characters = useSelector(s => s.characters.list);
  const { login, control, myCharacter } = useSelector(s => s.auth);
  const loading = useSelector(s => s.gamestate.loading);

  const locationContracts = useSelector(getLocationContracts);
  const playersPresent = useSelector(getPlayersPresent);
  let myLocation = useSelector(getMyLocation);


  const [levels, setLevels] = React.useState([]);
  const [mode, setMode] = React.useState('Stats');
  const [selectedLocation, setSelectedLocation] = React.useState(false);
  const [selectedStat, setSelectedStat] = React.useState(false);

  useEffect(() => {
    if (selectedLocation && typeof selectedLocation === "string") {
      selectedLocation(locations.find(el => el._id === selectedLocation._id))
    }
  }, [locations]);


  useEffect(() => {
    if (!props.login)
      navigate('/');
  }, [props.login, navigate])

  const handleScavenge = () => {
    socket.emit('request', { route: 'location', action: 'scavenge', data: { character: myCharacter._id, location: selectedLocation._id } })
  };

  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={'30% 70%'}
      gap='1'
      fontWeight='bold'>

      <GridItem pl='2' area={'nav'} >
        {selectedLocation && selectedLocation._id && <Box>
          <h4>{selectedLocation.name}</h4>
          <p>X: {selectedLocation.coords.x}, Y: {selectedLocation.coords.y}</p>

          {selectedLocation.description}

          {/* <Button onClick={() => setMode('newFacility')} >New Building</Button> */}
          <br />

          {mode === 'Stats' && <Box>
            {selectedLocation.name}' Stats
            <br />
            <StatBar selectedStat={selectedStat} setSelectedStat={setSelectedStat} globalStats={selectedLocation.locationStats} />
          </Box>}

          {mode === 'Actions' &&
            <Box>
              <h5>Actions </h5>
              <VStack overflow={'auto'} >
                {locationContracts.filter(el => el.location === selectedLocation._id).map(contract => (
                  <Contract key={contract._id} contract={contract} show />
                ))}
              </VStack>
            </Box>}


          {/* <h5>Buildings</h5>
          <VStack overflow={'auto'} >
            {facilities.filter(el => el.location._id == selectedLocation._id).map(facility => (
              <FacilityCard key={facility._id} facility={facility} />
            ))}
          </VStack> */}

          {mode === 'Characters' && <Box>
            {myLocation && myLocation.subLocations && myLocation.subLocations.map(sub =>
              <div key={sub._id}>
                {sub.name}
                {playersPresent.filter(el => el.subLocation === sub.name).map(player =>
                  <div key={player._id}>{player.characterName}</div>
                )}
              </div>)}
          </Box>}



        </Box>}

        {selectedLocation && selectedLocation.x && <Box>
          Here be dragons...
          <br />
          X: {selectedLocation.x} Y: {selectedLocation.y}
          {control && <Button onClick={() => setMode('newLocation')} >
            New Location
          </Button>}
        </Box>}

      </GridItem>

      <GridItem pl='2' style={{ height: 'calc(100vh - 78px)', overflow: 'clip', width: '99%' }} area={'main'} >
        {<HexMap
          locations={locations}
          selectedLocation={selectedLocation}
          selectedStat={selectedStat}
          setSelectedStat={setSelectedStat}
          onClick={(location) => setSelectedLocation(location)}
          mode={mode}
          setMode={setMode}
          handleHover={(location) => (!selectedLocation) ? setSelectedLocation(location) : undefined}
        />}
        {mode === 'newFacility' && <FacilityForm mode='new' location={selectedLocation} closeModal={() => { setMode(false); }} />}
        {mode === 'newLocation' && <LocationForm mode='new' coords={selectedLocation} closeModal={() => { setMode(false); }} />}
      </GridItem>
    </Grid>
  );
}

export default (LocationDashboard);