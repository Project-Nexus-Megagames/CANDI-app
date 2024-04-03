import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../../socket';
import Registration from './Registration';
import { Box, Button, ButtonGroup, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ActionTable from './ActionTable';
import GameConfig from '../GameConfig/GameConfig';
import CharacterTab from './CharacterTab';
import AssetTab from './AssetTab';
import { CandiWarning } from '../Common/CandiWarning';
import EditGamestate from './EditGamestate';
import TeamTab from './TeamTab';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { IoPauseCircleOutline, IoPlayCircleOutline } from 'react-icons/io5';
import { BsArrowRightCircle } from 'react-icons/bs';


const ControlTerminal = (props) => {
  const { login, team, character, user } = useSelector(s => s.auth);
  const assets = useSelector(s => s.assets.list);
  const clock = useSelector((s) => s.clock);

  let [account, setAccount] = React.useState();
  const [mode, setMode] = React.useState(false);

  const navigate = useNavigate();
  const [target, setTarget] = React.useState();
  const [tab, setTab] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const tags = ['dice', 'contract', 'ice']

  useEffect(() => {
    if (!login || !user)
      navigate('/');
  }, [login, navigate])

  const handleCreate = (code, amount = false) => {
    if (amount) {
      socket.emit('request', { route: 'transaction', action: 'deposit', data: { resource: code, amount, to: target } });
    }
    else
      socket.emit('request', {
        route: 'asset', action: 'create',
        data: {
          owner: target,
          account: target,
          amount: amount,
          code,
        }
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

  const handleContracts = () => {
    setLoading(true)
    const data = user.username;
    socket.emit('request', { route: 'asset', action: 'resetContracts', data }, (response) => {
      setLoading(false)
    });
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

          <ButtonGroup>
            <IconButton disabled icon={<ArrowLeftIcon />} onClick={() => socket.emit('request', { route: 'clock', action: 'revert' })} />
            <IconButton
              disabled={clock.paused}
              icon={<IoPauseCircleOutline />}
              onClick={() => {
                socket.emit('request', { route: 'clock', action: 'pause' });
              }}
            />
            <IconButton
              disabled={!clock.paused}
              icon={<IoPlayCircleOutline />}
              onClick={() => {
                socket.emit('request', { route: 'clock', action: 'play' });
              }}
            />
            <IconButton icon={<BsArrowRightCircle />} onClick={() => socket.emit('request', { route: 'clock', action: 'skip' })} />

            <Button onClick={() => socket.emit('request', { route: 'clock', action: 'reset' })}>
              Reset
            </Button>
            <Button onClick={() => socket.emit('request', { route: 'clock', action: 'redo' })}>
              Redo
            </Button>
          </ButtonGroup>


          {user?.username.toLowerCase() === 'bobtheninjaman' && <div>
            <Box>
              Used Assets: {assets.filter(el => el.status.some(s => s === 'used')).length}
              Working Assets: {assets.filter(el => el.status.some(s => s === 'working')).length}
              Hidden Assets: {assets.filter(el => el.status.some(s => s === 'hidden')).length}
            </Box>

            <Button isLoading={loading} onClick={() => handleUnUseAll()} >Reset Assets</Button>
            <Button isLoading={loading} onClick={() => handleUnhideAll()} >Unhide Assets</Button>
            <Button isLoading={loading} onClick={() => handleResetEfferot()} >Reset Effort</Button>
            <Button isLoading={loading} onClick={() => handleEffect()} >Unhide Effects</Button>
            <Button isLoading={loading} onClick={() => handleContracts()} >Reset Contracts</Button>
          </div>}

          <CandiWarning open={mode === "next"} title={"You sure about that?"} onClose={() => setMode(false)} handleAccept={() => { handleRound(); setMode(false); }}>
            Are ya sure?
          </CandiWarning>

          <EditGamestate show={mode === 'edit'} onClose={() => setMode(false)} />

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