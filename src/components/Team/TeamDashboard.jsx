import React, { useEffect } from 'react'; // React import
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useNavigate } from 'react-router-dom';
import Production from './Production';
import ServerManagement from './ServerManagement';
import Raid from '../Hacking/Raid';
import { getTeamAccount } from '../../redux/entities/accounts';
import Contracts from './Contracts';
import Trade from '../Common/Trade';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Icon, VStack, Grid, GridItem, Box, Button  } from '@chakra-ui/react';
import { getTeamFacilities } from '../../redux/entities/facilities';
import { getTeamAssets, getTeamWorkers } from '../../redux/entities/assets';
import { getTeamIce } from '../../redux/entities/ice';
import { getMyRaid } from '../../redux/entities/raids';
import { AiOutlineSwap } from 'react-icons/ai';
import { FaHandshake } from 'react-icons/fa';
import { editTab } from '../../redux/entities/gamestate';
import AssetCard from '../Common/AssetCard';
import { getFadedColor } from '../../scripts/frontend';
import LogRecords from '../Logs/LogRecords';
import { getMyTeamLogs } from '../../redux/entities/actionLogs';
import LineGraph from '../Market/LineGraph';
import AccountLineGraph from './AccountLineGraph';


const TeamDashboard  = (props) => {	
	const navigate = useNavigate();
  const reduxAction = useDispatch();
	const { login, team, myCharacter } = useSelector(s => s.auth);
  const clock = useSelector(s => s.clock);
	const { teamTab } = useSelector(s => s.gamestate);
	const account = useSelector(getTeamAccount);
	const facilities = useSelector(getTeamFacilities);
	const workers = useSelector(getTeamWorkers);
	const assets = useSelector(getTeamAssets);
	const teamIce = useSelector(getTeamIce);
	const myRaid = useSelector(getMyRaid);
	const myLogs = useSelector(getMyTeamLogs);

	// const [tabIndex, setTab] = React.useState(0);

	useEffect(() => {
		if(!login)
			navigate('/');
	}, [login, navigate])

	const handleTransfer = (thing) => {
		// setSelected(thing);  // save thing to redux state
		// setTab(6); // todo add in get tab index from thing
	}

  const generateLineData = () => {
    let datasets = [];
    let labels = [];

    for (let i=0; i < clock.tickNum; i++) {
      labels.push(i+1)
    }

    for (let resource of account?.resources?.filter(el => (el.balance > 0))) {
      console.log(resource.type)
      let newThing = {
        label: resource.type,
        data: [0],
        borderColor: getFadedColor(resource.type)
      };

      for (let tick of labels) {
        let log = myLogs.find(el => el.resource === resource.type && el.tickNum === tick)
        newThing.data.push(log ? log.amount : newThing.data[tick -1])
        // for (let log of myLogs.find(el => el.resource === resource.type && el.tickNum === tick)) {
        //   console.log(log.amount)
        //   newThing.data.push(log.amount)
        // }        
      }


      newThing.data.reverse()
      datasets.push(newThing)
    }
    console.log(datasets);
    return {labels, datasets};
  }

  return (
			<Tabs isLazy variant='enclosed' index={teamTab} onChange={(t) => reduxAction(editTab({ tab: 'teamTab', value: t}))}
      style={{ border: getFadedColor(team?.name), color: 'white' }}
      >
				<TabList>
					<Tab>DashBoard</Tab>
					<Tab> <AiOutlineSwap style={{ margin: '4px', }}/> {"  "} Trade</Tab>
					{/* <Tab>Account</Tab> */}
					<Tab> <FaHandshake style={{ margin: '4px', }}/>  Contracts</Tab>
					<Tab> <img style={{ margin: '4px', }} src={`/images/Icons/production.png`} width={'20px'} alt={`production???`} /> Production</Tab>
					<Tab>Facility Defense</Tab>
					{myRaid && <Tab>Raid</Tab>}
				</TabList>

				<TabPanels>

					<TabPanel>
          <Grid
              templateAreas={`"nav main right-nav"`}
              gridTemplateColumns={ '20% 60% 20%'}
              gap='1'
              fontWeight='bold'>

            <GridItem pl='2' bg='#0f131a' area={'nav'} >
              <Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}> 
                <VStack>
                  {assets.map(asset => (
                    <AssetCard key={asset._id} asset={asset} />
                  ))}
                </VStack>
              </Box>
            </GridItem>

            <GridItem pl='2' bg='#0f131a' area={'main'} >              
              <Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}> 
                Stuff Here
                {/* <Button onClick={() => generateLineData()} >Click Me</Button>

                <AccountLineGraph data={generateLineData()}/> */}

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
						<Trade account={account}  />
					</TabPanel>		

					{/* <TabPanel>
						Account rework coming
					</TabPanel> */}

					<TabPanel>
						<Contracts />						
					</TabPanel>

					<TabPanel>
						<Production facilities={facilities} workers={workers} />
					</TabPanel>

					<TabPanel>
						<ServerManagement ice={teamIce} facilities={facilities} handleTransfer={handleTransfer} />
					</TabPanel>			



					{myRaid && <TabPanel>
						<Raid />
					</TabPanel>	}

				</TabPanels>
			</Tabs>
  );
  
}


export default (TeamDashboard);