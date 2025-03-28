import { Box, Button, ButtonGroup, Flex, Grid, GridItem, Tooltip, Input, InputGroup, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, StackDivider, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, VStack, ScaleFade, IconButton } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getTeamAccount } from '../../redux/entities/accounts';
import { getGamestateLogs } from '../../redux/entities/actionLogs';
import { getTeamAgents, getTeamBrokers } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import socket from '../../socket';
import { AddAsset } from '../Common/AddAsset';
import AssetCard from '../Common/AssetCard';
import MarketNugget from '../Common/MarketNugget';
import MarketHistory from '../Control/MarketHistory';
import TeamAvatar from '../Common/TeamAvatar';
import LineGraph from './LineGraph';
import { editTab } from '../../redux/entities/gamestate';
import CheckerPick from '../Common/CheckerPick';
import { Funnel } from '@rsuite/icons';

const MarketTrackers = (props) => {
  const reduxAction = useDispatch();
	const trackers = props.trackers
	.sort((a, b) => { // sort the catagories alphabetically 
		if(a.currentPrice < b.currentPrice) { return 1; }
		if(a.currentPrice > b.currentPrice) { return -1; }
		return 0;
	});
	
	const { loading, character, control } = useSelector(s => s.auth);
	const logs = useSelector(s => s.actionLogs.list);
  const accounts = useSelector(s => s.accounts.list);
	const gamestateLogs = useSelector(getGamestateLogs);
	const account = useSelector(getTeamAccount);
	const agents = useSelector(getTeamBrokers);
	const gamestate = useSelector(s => s.gamestate);

  const tabType = props.tabType;
  const index = gamestate[tabType];
  console.log("tabType: ", tabType)
  console.log("index: ", index)

  const [filter1, setFilter] = React.useState('');
	const [tags, setTags] = React.useState(['Lab', 'Factory', 'Refinery','Assembly']);
  const [renderRounds, setRenderRounds] = React.useState(['Lab', 'Factory', 'Refinery','Assembly']);
	const [stock, setStock] = React.useState(index ? index : trackers[0]);
	const [total, setTotal] = React.useState(0);
	const [tax, setTax] = React.useState(0);
	const [quantity, setQuantity] = React.useState(0);
	const [modal, setModal] = React.useState(false);
	const [agent, setAgent] = React.useState(false);
	const [mode, setMode] = React.useState(false);


	const rawr = (account !== undefined && stock) ? account.resources.find(el => el.type === stock.resource) : undefined
	const rawr0 = account !== undefined ? account.resources.find(el => el.type === 'credit' ) : undefined
	const matching = rawr ? rawr.balance : `0`;
	const credits = rawr0 ? rawr0.balance : 'Error w/ credits';

	useEffect(() => {
		if(stock)	{
			setQuantity(stock.quantity);
			setTax(stock.tax);
			setTotal(0);
      setAgent(false);
		}
	}, [stock,]);

	useEffect(() => {
		if(stock)	{
			const tracker = trackers.find(el => el._id === stock._id)
			setStock(tracker ? tracker : index ? index : trackers[0])
		}
	}, [trackers]);

	const	submit = () => {
		const data = {
			character: character._id,
			tracker: stock._id,
			account: account._id,
      asset: agent._id,
			amount: total
		}
		socket.emit('request', { route: 'market', action: modal, data});
    setAgent(false);
	}

	
	const	submitControl = () => {
		const data = {
			character: character._id,
			tracker: stock._id,
			currentPrice: parseInt(total),
			quantity,
			tax
		}
		socket.emit('request', { route: 'market', action: modal, data});
		setTotal(0);
		setQuantity(0);
	}

  const handleRoundToggle = (round) => {
    if (renderRounds.some(r => r === round)) setRenderRounds(renderRounds.filter((r => r !== round)))
    else setRenderRounds([ ...renderRounds, round ])
  }

	return (
		<Grid
		templateAreas={`
										"main side"
										"main side"`}
		gridTemplateRows={'1fr'}
		gridTemplateColumns={'6fr 1fr'}
		h='100vh'
		gap='2'
	>
		<GridItem pl='2' bg='#0f131a' area={'main'} >
			{stock && <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
				<div style={{ 
					  position: 'absolute',
						top: '15%',
						right: '35%',
						width: '500px',}}>
					<MarketNugget button control tracker={stock} type={stock.resource} credits={credits} matching={matching} backgroundColor='#0f131a' modal={modal} setModal={setModal} />

					{modal && 
          <ScaleFade initialScale={0.9} in={modal}>
          <div className='styleCenter' 
						style={{	
							opacity: loading ? .5 : 1, 
							display: 'flex', 
							border: `3px solid ${getFadedColor(stock.resource)}`, 
							minHeight: "45px", 
							borderRadius: '10px',  
							backgroundColor: '#0f131a' 
						}}>

						{modal === 'sell' && 
              <Flex align="center" justify={'space-between'}>
                <div style={{ width: '50%' }} >
                  {!agent && <AddAsset handleSelect={setAgent} assets={agents}/>}
                  {agent && <AssetCard showRemove removeAsset={()=> setAgent(false)} compact type={'blueprint'} asset={agent} /> }                
                </div>
                <div style={{ width: '50%' }}>
						    	<h5>Amount Recieved = ( {total} x ({stock.currentPrice} - {Math.floor(stock.currentPrice * stock.tax)}) ) = ${total * (stock.currentPrice - Math.floor(stock.currentPrice * stock.tax))}</h5>

						    	<NumberInput keepWithinRange disabled={false} id="amount" min={0} max={matching} value={total} onChange={(value) => setTotal(value)} >
						    		<NumberInputField />
						    		<NumberInputStepper>
						    			<NumberIncrementStepper />
						    			<NumberDecrementStepper />
						    		</NumberInputStepper>
						    	</NumberInput> 

						    	<ButtonGroup isAttached>
                  <Tooltip hasArrow delay={50} placement="top" label={<div>
                      {total <= 0 && <b>Select more than 1 {stock.name}</b>}
                      <p></p>
                      {!agent && <b>Assign an Agent</b>}
                    </div>} >
                    <Button colorScheme='orange' disabled={total <= 0|| !agent} onClick={() =>{ submit(); setModal(false); setTotal(0);}} variant="solid" style={{ textTransform: 'capitalize' }}>
						    			{modal}
						    		</Button>		
                  </Tooltip>   

						    		<Button colorScheme={'red'} onClick={() => { setTotal(0); setModal(false); }} variant="outline">
						    			Cancel
						    		</Button>
						    	</ButtonGroup>					
						    </div>
              </Flex>}

						{modal === 'buy' && 
            <Flex justify='left' align="center">
              <div  >
                {!agent && <AddAsset handleSelect={setAgent} assets={agents}/>}
                {agent && <AssetCard showRemove removeAsset={()=> setAgent(false)} compact type={'blueprint'} asset={agent} /> }                
              </div>
              <div >
              <h5>Buy Total = ({total} x ({stock.currentPrice} + {Math.floor(stock.currentPrice * stock.tax)})) = ${total * (stock.currentPrice + Math.floor(stock.currentPrice * stock.tax))} </h5>

              <NumberInput keepWithinRange disabled={false} id="amount" min={0} max={stock.quantity} value={total} onChange={(value) => setTotal(value)} >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <ButtonGroup isAttached>
                <Button 
                  colorScheme={'green'} disabled={total <= 0 || credits < (total * (stock.currentPrice + Math.floor(stock.currentPrice * Math.floor(stock.currentPrice * stock.tax)))) || !agent} 
                  onClick={() =>{ submit(); setModal(false); setTotal(0);}} 
                  variant="solid" 
                  style={{ textTransform: 'capitalize' }}>
                  {modal}
                </Button>
                <Button colorScheme={'red'} onClick={() => { setTotal(0); setModal(false); setAgent(false) }} variant="outline">
                  Cancel
                </Button>
              </ButtonGroup>

              </div>
            </Flex>}

            {modal === 'info' && 
            <Box>
              Coroprations with this resource:
              <VStack justify='center' align="center">
              Coroprations with this resource:
              {accounts.filter(el => el.resources.some(r => r.type === stock.resource && r.balance > 0)).map(account => 
                <div className='styleCenter' >
                  {account.name}
                  <TeamAvatar account={account._id} />
                </div>
                )}
              </VStack>
            </Box>}

						{modal === 'control' && <Button disabled={total <= 0 || Math.floor(credits / (stock.currentPrice + Math.floor(stock.currentPrice * stock.tax)))} onClick={() =>{ submitControl(); setModal(false); }} appearance="primary" style={{ textTransform: 'capitalize' }}>
							{modal} TODO: This
						</Button>}							
					</div>
          </ScaleFade>}


				</div>	 
			</div>}

			{stock && <div style={{ width: '99%', height: '0%'}} >				
				<LineGraph selected={stock} data={[...stock.history, stock.currentPrice]}/>
			</div>}
		</GridItem>

		<GridItem pl='2' bg='#0f131a' area={'side'}  style={{ height: 'calc(100vh - 130px)', overflow: 'scroll', }}>
		<Box > 			
			<InputGroup >
				<Input size="md" onChange={(value)=> setFilter(value.target.value)} value={filter1} placeholder="Search"></Input> 
			</InputGroup>
			</Box>
			<VStack  >			
				{tags.map((tag, index) => (
					<div style={{ width: '100%' }} key={tag}>
						<h5 className='toggle-tag' onClick={() => handleRoundToggle(tag)} style={{ backgroundColor: getFadedColor(tag.toLocaleLowerCase()), color: getTextColor(tag), textAlign: 'center' }} >{tag}</h5>
						<VStack  >
							<StackDivider borderColor='gray.200' />
							{renderRounds.some(r => r === tag) && trackers.filter(el => el.name.toLowerCase().includes(filter1.toLowerCase()) && el.tags.some(t => t === tag.toLowerCase()))
							.map((tracker, index0) => (
								<div className='nav-item' key={tracker._id} onClick={() => { setStock(tracker); setModal(false); reduxAction(editTab({ tab: tabType, value: tracker})); }} >
									<MarketNugget tracker={tracker} buttons  type={tracker.resource} selected={(stock && stock._id === tracker._id)} />
								</div>
							))}									
						</VStack>		
					</div>
				))}
			</VStack>
		</GridItem>

		</Grid>
	);
};

export default (MarketTrackers);