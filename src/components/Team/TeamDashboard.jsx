import React, { useEffect, useState } from 'react'; // React import
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useNavigate } from 'react-router-dom';
import Production from './Production';
import ServerManagement from './ServerManagement';
import { getCharAccount, getTeamAccount } from '../../redux/entities/accounts';
import { Tab, TabList, TabPanel, TabPanels, Tabs, VStack, Grid, GridItem, Box, Button, Center, ButtonGroup, IconButton } from '@chakra-ui/react';
import { getTeamFacilities } from '../../redux/entities/facilities';
import { getTeamAssets, getTeamWorkers, getTeamContracts } from '../../redux/entities/assets';
import { getTeamIce } from '../../redux/entities/ice';
import { AiOutlineSwap } from 'react-icons/ai';
import { FaHandshake } from 'react-icons/fa';
import { editTab } from '../../redux/entities/gamestate';
import AssetCard from '../Common/AssetCard';
import { getFadedColor } from '../../scripts/frontend';
import LogRecords from '../Logs/LogRecords';
import { getMyTeamLogs } from '../../redux/entities/actionLogs';
import AccountLineGraph from '../Team/AccountLineGraph';
import usePermissions from '../../hooks/usePermissions';
import ResourceNugget from '../Common/ResourceNugget';
import { EditAccount } from '../Common/EditAccount';
import Contract from '../Common/Contract';
import { AccountTransfer } from '../Common/AccountTransfer';
import { CloseIcon, PlusSquareIcon } from '@chakra-ui/icons';
import AssetForm from '../Common/AssetForm';


const TeamDashboard = (props) => {
  const navigate = useNavigate();
  const reduxAction = useDispatch();
  const { login, team } = useSelector(s => s.auth);
  const clock = useSelector(s => s.clock);
  const { teamTab } = useSelector(s => s.gamestate);

  const teamAccount = useSelector(getTeamAccount);
  const myAccount = useSelector(getCharAccount);

  const facilities = useSelector(getTeamFacilities);
  const workers = useSelector(getTeamWorkers);
  const assets = useSelector(getTeamAssets);
  const contracts = useSelector(getTeamContracts);
  const teamIce = useSelector(getTeamIce);
  const myLogs = useSelector(getMyTeamLogs);


  const [mode, setMode] = useState(false);

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

  const generateLineData = () => {
    let datasets = [];
    let labels = [];

    for (let i = 0; i < clock.tickNum; i++) {
      labels.push(i + 1)
    }

    for (let resource of teamAccount.resources.filter(el => (el.balance > 0))) {
      console.log(resource.type)
      let newThing = {
        label: resource.type,
        data: [0],
        borderColor: getFadedColor(resource.type)
      };

      for (let tick of labels) {
        let log = myLogs.find(el => el.resource === resource.type && el.tickNum === tick)
        newThing.data.push(log ? log.amount : newThing.data[tick - 1])
        // for (let log of myLogs.find(el => el.resource === resource.type && el.tickNum === tick)) {
        //   console.log(log.amount)
        //   newThing.data.push(log.amount)
        // }        
      }


      newThing.data.reverse()
      datasets.push(newThing)
    }
    console.log(datasets);
    return { labels, datasets };
  }

  return (
    <Tabs isLazy index={teamTab} onChange={(t) => reduxAction(editTab({ tab: 'teamTab', value: t }))}
      style={{ border: getFadedColor(team?.name), color: 'white' }}
    >
      <TabList>
        <Tab>DashBoard</Tab>
        <Tab> <AiOutlineSwap style={{ margin: '4px', }} /> {"  "} Trade</Tab>
      </TabList>

      <TabPanels>

        <TabPanel>
          <Grid
            templateAreas={`"nav main right-nav"`}
            gridTemplateColumns={'20% 60% 20%'}
            gap='1'
            bg='#fff'
            fontWeight='bold'>

            <GridItem pl='2' bg='#0f131a' area={'nav'} >
              <Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}>
                <VStack>
                  {contracts.map(contract => (
                    <Contract show key={contract._id} contract={contract} />
                  ))}
                </VStack>
              </Box>
            </GridItem>

            <GridItem pl='2' bg='#0f131a' area={'main'} >
              <Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}>

                {teamAccount && <div>
                  {teamAccount.name}
                  <ButtonGroup>
                    <AccountTransfer transactionType={"Deposit"} fromAccount={myAccount} toAccount={teamAccount} />
                    <AccountTransfer transactionType={"Withdraw"} fromAccount={teamAccount} toAccount={myAccount} />
                    {isControl && <EditAccount account={teamAccount} />}
                  </ButtonGroup>
                  <Center>
                    {teamAccount.resources.map((item) =>
                      <ResourceNugget key={item.type} type={item.type} value={item.balance} width={'80px'} height={'30'} />
                    )}
                  </Center>

                  {<GridItem bg={mode === "new" ? '#232c3b' : '#555555'} area={'body'} >
                    <h5 style={{ backgroundColor: getFadedColor("Asset"), color: 'black' }} >
                      Assets
                      {isControl && mode !== "new" && <IconButton onClick={() => setMode("new")} variant={'solid'} colorScheme="green" size={'sm'} icon={<PlusSquareIcon />} />}
                      {isControl && mode === "new" && <IconButton onClick={() => setMode(false)} variant={'solid'} colorScheme="red" size={'sm'} icon={<CloseIcon />} />}
                    </h5>
                    {mode !== "new" && <Grid templateColumns='repeat(3, 1fr)' gap={1}>
                      {assets
                        .filter((el) => (el.account && el.account === teamAccount._id && !el.tags.some(t => t === 'contract')))
                        .map((asset) => (
                          <AssetCard key={asset._id} asset={asset} showButtons />
                        ))}
                    </Grid>}
                    {mode === "new" &&
                      <Center  >
                        <AssetForm closeModal={() => setMode(false)} mode={mode} team={team} teamAccount={teamAccount} />
                      </Center>
                    }
                  </GridItem>}
                </div>}


              </Box>
            </GridItem>

            <GridItem pl='2' bg='#0f131a' area={'right-nav'} >
              <Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}>
                <LogRecords reports={myLogs.sort((a, b) => {
                  let da = new Date(a.createdAt),
                    db = new Date(b.createdAt);
                  return db - da;
                })} />
              </Box>
            </GridItem>

          </Grid>
        </TabPanel>

        <TabPanel>
          {/* <Trade teamAccount={teamAccount} /> */}
        </TabPanel>

        {/* <TabPanel>
						Account rework coming
					</TabPanel> */}

        <TabPanel>
          {/* <Contracts /> */}
        </TabPanel>

        <TabPanel>
          <Production facilities={facilities} workers={workers} />
        </TabPanel>

        <TabPanel>
          <ServerManagement ice={teamIce} facilities={facilities} handleTransfer={handleTransfer} />
        </TabPanel>

      </TabPanels>
    </Tabs>
  );

}


export default (TeamDashboard);