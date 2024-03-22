import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../../socket';
import Registration from './Registration';
import { Box, Button, Center, HStack, Input, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import ActionTable from './ActionTable';
import GameConfig from '../GameConfig/GameConfig';
import CharacterTab from './CharacterTab';
import AssetTab from './AssetTab';
import { CandiWarning } from '../Common/CandiWarning';
import EditGamestate from './EditGamestate';
import TeamTab from './TeamTab';
import Loading from '../Navigation/Loading';


const ControlTerminal = (props) => {
  const { login, team, character, user } = useSelector(s => s.auth);
  const assets = useSelector(s => s.assets.list);

  let [account, setAccount] = React.useState();
  const [mode, setMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const [target, setTarget] = React.useState();
  const [tab, setTab] = React.useState(0);

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [gifLink, setGifLink] = React.useState('');

  const tags = ['dice', 'contract', 'ice']

  useEffect(() => {
    if (!login || !user)
      navigate('/');
  }, [login, navigate])

  const createLoadingTip = () => {

    setLoading(true)
    socket.emit('request', { route: 'gameConfig', action: 'createLoadingTip', data: {
      title,
      description,
      gifLink
    }}, (response) => {
      console.log(response);
      setLoading(false)
    });
  }

  const handleRound = () => {
    const data = user.username;
    socket.emit('request', { route: 'gamestate', action: 'nextRound', data });
  }

  const handleUnUseAll = () => {
    const data = user.username;
    socket.emit('request', { route: 'asset', action: 'unuseAll', data });
  }

  const handleResetEfferot = () => {
    const data = user.username;
    socket.emit('request', { route: 'character', action: 'resetEffort', data });
  }

  const handleClose = () => {
    const data = user.username;
    socket.emit('request', { route: 'gamestate', action: 'closeRound', data });
  }

  const handleEffect = () => {
    const data = user.username;
    socket.emit('request', { route: 'gamestate', action: 'unhideEffects', data });
  }

  const handleUnhideAll = () => {
    const data = user.username;
    socket.emit('request', { route: 'asset', action: 'unhide', data });
  }

  return (
    <Tabs isLazy variant='enclosed' index={tab} onChange={setTab}>
      <TabList>
        <Tab>DashBoard</Tab>
        <Tab>Actions</Tab>
        <Tab>Configuration</Tab>
        <Tab>Register</Tab>
        {<Tab>Characters</Tab>}
        {<Tab>Assets</Tab>}
        {user?.username.toLowerCase() === 'bobtheninjaman' && <Tab> * Teams</Tab>}
      </TabList>

      <TabPanels>

        <TabPanel>
          <div>

            <Button variant={'solid'} colorScheme='teal' onClick={handleClose}>Close</Button>
            <Button variant={'solid'} colorScheme='teal' onClick={() => setMode("edit")}>Edit Round</Button>
            <Button variant={'solid'} colorScheme='teal' onClick={() => setMode("next")}>Next Round</Button>
          </div>

          {(user?.username.toLowerCase() === 'bobtheninjaman' || user?.username.toLowerCase() === 'franzi') && <div>
            <Box>
              Used Assets: {assets.filter(el => el.status.some(s => s === 'used')).length}
              Working Assets: {assets.filter(el => el.status.some(s => s === 'working')).length}
              Hidden Assets: {assets.filter(el => el.status.some(s => s === 'hidden')).length}
            </Box>

            <Button onClick={() => handleUnUseAll()} >Reset Assets</Button>
            <Button onClick={() => handleUnhideAll()} >Unhide Assets</Button>
            <Button onClick={() => handleResetEfferot()} >Reset Effort</Button>
            <Button onClick={() => handleEffect()} >Unhide Effects</Button>
          </div>}

          <CandiWarning open={mode === "next"} title={"You sure about that?"} onClose={() => setMode(false)} handleAccept={() => { handleRound(); setMode(false); }}>
            Are ya sure?
          </CandiWarning>

          <EditGamestate show={mode === 'edit'} onClose={() => setMode(false)} />

          Loading screen tips
          <Center>

            <Box width={'50%'} >
              <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input placeholder='gifLink' value={gifLink} onChange={(e) => setGifLink(e.target.value)} />
              <Button onClick={createLoadingTip} >Submit</Button>
            </Box>

            <Box>
              Preview:
              <Center>
                <Text fontSize={"x-large"} >{title}</Text>
              </Center>

              <Center>
                <img width={"350px"} src={gifLink} alt='Loading...' />
              </Center>

              <Center>
                <Text fontSize={"lg"} >"{description}"</Text>
              </Center>
            </Box>        

          </Center>


          <Loading controlMode />

        </TabPanel>

        <TabPanel>
          <ActionTable />
        </TabPanel>

        <TabPanel>
          <div style={{ width: '90%', height: '95vh' }}>
            <GameConfig />
          </div>
        </TabPanel>

        <TabPanel>
          <Registration />
        </TabPanel>

        <TabPanel>
          <CharacterTab />
        </TabPanel>

        <TabPanel>
          <AssetTab />
        </TabPanel>

        <TabPanel>
          <TeamTab />
        </TabPanel>


      </TabPanels>
    </Tabs>
  );
}

export default (ControlTerminal);