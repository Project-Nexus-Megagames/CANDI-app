import React from 'react'; // React import
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import MarketTrackers from './MarketTrackers';
import Auctions from './Auctions';
import { getResourceTrackers, getStockTrackers, getTrackers } from '../../redux/entities/markets';
import { editTab } from '../../redux/entities/gamestate';
import { getFadedColor } from '../../scripts/frontend';

/*
TODO CHECKLIST
*/

const MarketDashboard  = (props) => {
  const reduxAction = useDispatch();
	const { marketTab } = useSelector(s => s.gamestate);
	const resourceTrackers = useSelector(getResourceTrackers);
	const stockTrackers = useSelector(getStockTrackers);

	
  return (
		<Tabs style={{ border: getFadedColor('market'), color: 'white' }} isLazy variant='enclosed' index={marketTab} onChange={(t) => reduxAction(editTab({ tab: 'marketTab', value: t}))}>
			<TabList>
				{/* <Tab>DashBoard</Tab> */}
				<Tab><img style={{ margin: '4px', }} src={`/images/Icons/stock.png`} width={'20px'} alt={`stock???`} /> Stock Market</Tab>
				{<Tab><img style={{ margin: '4px', }} src={`/images/Icons/price-tag.png`} width={'20px'} alt={`plastic???`} /> Resource Market</Tab>}
				<Tab><img style={{ margin: '4px', }} src={`/images/Icons/gavel.png`} width={'20px'} alt={`gavel???`} />Auctions</Tab>
			</TabList>

			<TabPanels>

				{/* <TabPanel>
					Dashboard here
				</TabPanel> */}

				<TabPanel>
					<MarketTrackers trackers={stockTrackers} tabType={"selectedStock"} />
				</TabPanel>		

				<TabPanel>
					<MarketTrackers trackers={resourceTrackers} tabType={"selectedMarket"}/>
				</TabPanel>

				<TabPanel>
					<Auctions/>
				</TabPanel>

			</TabPanels>
		</Tabs>
	);    
}

export default (MarketDashboard);