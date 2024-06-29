import React, { useEffect, useState } from 'react'; // React import
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useNavigate } from 'react-router-dom';
import { getCharAccount, getTeamAccount } from '../../redux/entities/accounts';
import { Tab, TabList, TabPanel, TabPanels, Tabs, VStack, Grid, GridItem, Box, Button, Center, ButtonGroup, IconButton, Wrap, Stack } from '@chakra-ui/react';
import { getTeamFacilities } from '../../redux/entities/facilities';
import { getTeamAssets, getTeamWorkers, getTeamContracts } from '../../redux/entities/assets';
import { getTeamIce } from '../../redux/entities/ice';
import { FaSnowboarding } from 'react-icons/fa';
import { editTab } from '../../redux/entities/gamestate';
import AssetCard from '../Common/AssetCard';
import { getFadedColor } from '../../scripts/frontend';
import LogRecords from '../Logs/LogRecords';
import { getMyTeamLogs } from '../../redux/entities/actionLogs';
import usePermissions from '../../hooks/usePermissions';
import ResourceNugget from '../Common/ResourceNugget';
import { EditAccount } from '../Common/EditAccount';
import Contract from '../Common/Contract';
import { AccountTransfer } from '../Common/AccountTransfer';
import { CloseIcon, PlusSquareIcon } from '@chakra-ui/icons';
import AssetForm from '../Common/AssetForm';
import socket from '../../socket';
import SelectPicker from '../Common/SelectPicker';
import { setTeam } from '../../redux/entities/auth';
import { CandiModal } from '../Common/CandiModal';
import IceForm from '../Common/IceForm';
import IceCard from '../Common/IceCard';


const TeamDashboard = (props) => {
  const navigate = useNavigate();
  const reduxAction = useDispatch();
  const { login, team } = useSelector(s => s.auth);
  const clock = useSelector(s => s.clock);
  const { teamTab } = useSelector(s => s.gamestate);
  const teams = useSelector(s => s.teams.list);


  const teamAccount = useSelector(getTeamAccount);
  const myAccount = useSelector(getCharAccount);

  const facilities = useSelector(getTeamFacilities);
  const workers = useSelector(getTeamWorkers);
  const assets = useSelector(getTeamAssets);
  const contracts = useSelector(getTeamContracts);
  const teamIce = useSelector(getTeamIce);
  const myLogs = useSelector(getMyTeamLogs);


  const [mode, setMode] = useState(false);
  const closeIt = () => { setMode(false); };
  const { isControl } = usePermissions();

  // const [tabIndex, setTab] = React.useState(0);

  useEffect(() => {
    if (!login)
      navigate('/');
  }, [login, navigate])

  const handleTransfer = (thing) => {
    // setSelected(thing);  // save thing to redux state
    // setTab(6); // todo add in get tab index from thing
  }

  return (
    <Tabs isLazy index={teamTab} onChange={(t) => reduxAction(editTab({ tab: 'teamTab', value: t }))}
      style={{ border: getFadedColor(team?.name), color: 'white' }}
    >
      <TabList>
        <Tab>DashBoard</Tab>
        <Tab> <FaSnowboarding style={{ margin: '4px', }} /> {"  "} Challenges</Tab>
        {/* <Tab> <AiOutlineSwap style={{ margin: '4px', }} /> {"  "} Trade</Tab> */}
      </TabList>

      <TabPanels>

        <TabPanel>
          <Grid
            h='200px'
            templateAreas={`"nav main right-nav"`}
            gridTemplateColumns={'20% 60% 20%'}
            gap='1'
            fontWeight='bold'>

            <GridItem pl='2' bg='#0f131a' area={'nav'} >
              <Box style={{ height: 'calc(100vh - 135px)', overflow: 'auto', }} >
                <VStack>
                  {contracts.map(contract => (
                    <Contract show key={contract._id} contract={contract} />
                  ))}
                </VStack>
              </Box>
            </GridItem>

            <GridItem pl='2' bg='#0f131a' area={'main'} >
              <Box style={{ height: 'calc(100vh - 135px)', overflow: 'auto', }} >
                {isControl && <SelectPicker fullData data={teams} label='name' onChange={(team) => reduxAction(setTeam(team))} />}

                {teamAccount && <div>
                  {<Box bg={mode === "new" ? '#232c3b' : '#555555'} area={'body'} >
                    <h5 style={{ backgroundColor: getFadedColor("Asset"), color: 'black' }} >
                      {teamAccount.name} Assets
                      {isControl && mode !== "new" && <IconButton onClick={() => setMode("new")} variant={'solid'} colorScheme="green" size={'sm'} icon={<PlusSquareIcon />} />}
                      {isControl && mode === "new" && <IconButton onClick={() => setMode(false)} variant={'solid'} colorScheme="red" size={'sm'} icon={<CloseIcon />} />}
                    </h5>
                    {mode !== "new" && <Grid templateColumns='repeat(3, 1fr)' gap={1}>
                      {assets
                        .filter((el) => (el.account && (el.account === teamAccount?._id) && !el.tags.some(t => t === 'contract')))
                        .map((asset) => (
                          <AssetCard key={asset._id} asset={asset} showButtons />
                        ))}
                    </Grid>}
                    {mode === "new" &&
                      <Center  >
                        <AssetForm closeModal={() => setMode(false)} mode={mode} team={team} teamAccount={teamAccount} />
                      </Center>
                    }
                  </Box>}
                </div>}

              </Box>
            </GridItem>

            <GridItem pl='2' bg='#0f131a' area={'right-nav'} >
              <Box style={{ height: 'calc(100vh - 135px)', overflow: 'auto', }} >
                {teamAccount && <div>
                  {teamAccount.name}
                  <ButtonGroup isAttached>
                    <AccountTransfer transactionType={"Deposit"} fromAccount={myAccount} toAccount={teamAccount} />
                    <AccountTransfer transactionType={"Withdraw"} fromAccount={teamAccount} toAccount={myAccount} />
                    {isControl && <EditAccount account={teamAccount} />}
                  </ButtonGroup>
                  <Wrap>
                    {[...teamAccount.resources].filter(el => el.balance > 0).sort((a, b) => b.balance - a.balance).map((item) =>
                      <ResourceNugget key={item.type} type={item.type} value={item.balance} width={'80px'} height={'30'} />
                    )}
                  </Wrap>
                </div>}

                <LogRecords reports={myLogs.sort((a, b) => {
                  let da = new Date(a.createdAt),
                    db = new Date(b.createdAt);
                  return db - da;
                })} />

              </Box>
            </GridItem>

          </Grid>
        </TabPanel>

        {/* Challenges */}
        <TabPanel>
          <Grid
            h='200px'
            templateAreas={`"nav main"`}
            gridTemplateColumns={'30% 70%'}
            gap='1'
            fontWeight='bold'>

            <GridItem area={'nav'} bg='#0f131a' style={{ height: 'calc(100vh - 135px)', overflow: 'auto', }}>
              {assets
                .filter((el) => (el.account && el.account === teamAccount?._id && !el.tags.some(t => t === 'contract')))
                .map((asset) => (
                  <div key={asset._id} >
                    <AssetCard height={'30vh'} asset={asset} showButtons />
                  </div>

                ))}
            </GridItem>

            <GridItem area={'main'} bg='#0f131a' style={{ height: 'calc(100vh - 135px)', overflow: 'auto', }}>
              {isControl && <Button
                variant={'solid'}
                onClick={() => setMode('getIce')}
                colorScheme="yellow"
              >
                New Complication
              </Button>}
              <Stack align='center' >
                {teamIce.map(ice => (
                  <div key={ice._id} style={{ width: "90%" }} >
                    <IceCard ice={ice} showButtons={isControl} handleSelect />
                  </div>
                ))}
              </Stack>

            </GridItem>

            <CandiModal open={mode === 'getIce'} onClose={() => closeIt()}  >
              <IceForm
                closeModal={closeIt}
                mode={mode}
                handleSubmit={(data) => {
                  socket.emit('request', {
                    route: 'ice',
                    action: 'create',
                    data: { ...data, account: teamAccount._id }
                  }, (response) => { console.log(response) });
                }}
              />
            </CandiModal>

          </Grid>

        </TabPanel>

      </TabPanels>
    </Tabs>
  );

}


export default (TeamDashboard);