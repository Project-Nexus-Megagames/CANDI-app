import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import Registration from './Registration';
import Contracts from '../Team/Contracts';
import { getGamestateLogs } from '../../redux/entities/actionLogs';
import { getTeamAccount } from '../../redux/entities/accounts';
import LogRecords from '../Logs/LogRecords';
import ResourceNugget from '../Common/ResourceNugget';
import { PauseOutline, PlayOutline } from '@rsuite/icons';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import { Box, Button, ButtonGroup, HStack, Divider, Grid, IconButton, Input, Tab, TabList, TabPanel, TabPanels, Tabs, InputGroup } from '@chakra-ui/react';
import SelectPicker from '../Common/SelectPicker';
import WordDivider from '../Common/WordDivider';
import AssetCard from '../Common/AssetCard';
import InputNumber from '../Common/InputNumber';
import Teams from './Teams';
import Blueprints from './Blueprints';
import { BsSave } from 'react-icons/bs';
import { EditAccount } from '../Common/EditAccount';
import { editTab } from '../../redux/entities/gamestate';

const ControlDashboard = (props) => {
	const reduxAction = useDispatch();
	const { login, team, character, loading } = useSelector((s) => s.auth);
	const { controlTab } = useSelector(s => s.gamestate);
	const blueprints = useSelector((s) => s.blueprints.list);
	const accounts = useSelector((s) => s.accounts.list);
	const facilities = useSelector((s) => s.facilities.list);
	const locations = useSelector(s => s.locations.list);
	const subLocations = useSelector(s => s.locations.subLocations);
	const clock = useSelector((s) => s.clock);
	const gamestate = useSelector((s) => s.gamestate);
	const govAccount = useSelector(getTeamAccount);

	const logs = useSelector(getGamestateLogs);

	let [account, setAccount] = React.useState(govAccount);
	const navigate = useNavigate();
	const [target, setTarget] = React.useState(govAccount?._id);
	const [tab, setTab] = React.useState(0);
	const [auctionType, setAuctionType] = React.useState(false);
	const [amount, setAmount] = React.useState(0);
	const [fill, setFilter] = React.useState('');
	const [roundLength, setRoundLength] = React.useState(gamestate?.roundLength);

	const tags = ['asset', 'contract', 'ice', 'facility',];

	useEffect(() => {
		if (target) setAccount(accounts.find((el) => el._id === target));
	}, [target, accounts]);

	useEffect(() => {
		if (!login) navigate('/');
	}, [login, navigate]);

	const handleCreate = (code, amount = false) => {
		if (amount) {
			socket.emit('request', { route: 'transaction', action: 'deposit', data: { resource: code, amount, to: target } });
		} else
			socket.emit('request', {
				route: 'asset',
				action: 'create',
				data: {
					owner: target,
					account: target,
					amount: amount,
					code
				}
			});
	};

	const handleNewAcution = () => {
		socket.emit('request', { route: 'market', action: 'controlAuction', data: { blueprint: auctionType, amount } });
	};

	return (
		<Tabs isLazy variant='enclosed' index={controlTab} onChange={(t) => reduxAction(editTab({ tab: 'controlTab', value: t }))}>
			<TabList>
				<Tab>DashBoard</Tab>
				<Tab>Logs</Tab>
				<Tab>Teams</Tab>
				{/* <Tab>Actions</Tab> */}
				<Tab>Contracts</Tab>
				<Tab>Blueprints</Tab>
				<Tab>Register</Tab>
			</TabList>

			<TabPanels>
				<TabPanel>
					<div style={{ height: 'calc(100vh - 160px)', overflow: 'auto', marginTop: '5px' }} >
						<ButtonGroup isAttached>
							<IconButton disabled icon={<ArrowLeftLineIcon />} onClick={() => socket.emit('request', { route: 'clock', action: 'revert' })} />
							<IconButton
								disabled={clock.paused}
								icon={<PauseOutline />}
								onClick={() => {
									socket.emit('request', { route: 'clock', action: 'pause' });
								}}
							/>
							<IconButton
								disabled={!clock.paused}
								icon={<PlayOutline />}
								onClick={() => {
									socket.emit('request', { route: 'clock', action: 'play' });
								}}
							/>
							<IconButton icon={<ArrowRightLineIcon />} onClick={() => socket.emit('request', { route: 'clock', action: 'skip' })} />

							<Button onClick={() => socket.emit('request', { route: 'clock', action: 'reset' })}>
								Reset
							</Button>
							<Button onClick={() => socket.emit('request', { route: 'clock', action: 'redo' })}>
								Redo {gamestate.lastTick}
							</Button>
						</ButtonGroup>

						<HStack >
							<InputNumber defaultValue={roundLength?.hours} onChange={(e) => setRoundLength({ ...roundLength, hours: parseInt(e) })} />
							<InputNumber defaultValue={roundLength?.minutes} onChange={(e) => setRoundLength({ ...roundLength, minutes: parseInt(e) })} />
							<InputNumber defaultValue={roundLength?.seconds} onChange={(e) => setRoundLength({ ...roundLength, seconds: parseInt(e) })} />
							<IconButton variant={'solid'} colorScheme='green' icon={<BsSave />} onClick={() => socket.emit('request', { route: 'gamestate', action: 'editRoundLength', data: roundLength })} />
						</HStack>


						Tick Num: {clock.tickNum}
						{/* <div style={{ height: '40px', borderRadius: '0px', backgroundColor: "#000101", margin: '1px' }}>
							<InputPicker labelKey='name' valueKey='_id' data={accounts} value={target} style={{ height: '39px', width: '40%' }} onChange={(event)=> {setTarget(event); }} />
						</div> */}

						<Divider />

						{/* Auction stuff
             <Button onClick={() => setAuctionType('defense-contract')} >Defense Contract</Button>
             <Button onClick={() => setAuctionType('consumer-contract')} >Consumer Contract</Button>
             <Button onClick={() => setAuctionType('labor-contract')} >Labor Contract</Button>             

             {auctionType && <Box>
              <InputNumber
                defaultValue="0"
                onChange={(value) => setAmount(value)}
              />
              <Button onClick={handleNewAcution} >Create {auctionType}</Button>
             </Box> } */}

						<SelectPicker label='name' data={accounts} value={account?.name} onChange={(id) => setTarget(id)} />

						{account && <div>
							{account.name}
							<HStack>
								{account.resources.filter(el => el.balance > 0).map((resource, index) => (
									<ResourceNugget
										fontSize={'1.5em'}
										key={resource._id + index}
										type={resource.code ? resource.code : resource.type}
										value={resource.balance}
										width={"100px"} />
								))}
							</HStack>
						</div>}

						<Input value={fill} onChange={(e) => setFilter(e.target.value)} />
						{account && <EditAccount account={account} />}
						{account && tags.map((tag, index) => {
							const relevant = blueprints.filter(el => el.tags.some(t => t === tag) && el.name.toLowerCase().includes(fill.toLowerCase()))
							return (
								<div key={tag}>
									<WordDivider word={tag} />
									<Grid style={{ minHeight: relevant.length > 0 ? '20vh' : '0' }} justify="space-around" align={'center'} gridTemplateRows={'1fr'} gap={4} templateColumns={`repeat(3, 1fr)`}>
										{relevant.map((blue) => (
											<Box style={{ width: '90%' }}>
												<AssetCard handleSelect={() => handleCreate(blue.code)} asset={blue} disabled />
											</Box>
										))}
									</Grid>

								</div>
							)
						})}
					</div>
				</TabPanel>

				<TabPanel>
					<LogRecords reports={logs} />
				</TabPanel>

				<TabPanel>
					<Teams />
				</TabPanel>


				{/* <TabPanel>
					<Actions />
				</TabPanel> */}

				<TabPanel>
					<Contracts control={true} />
				</TabPanel>

				<TabPanel>
					<Blueprints />
				</TabPanel>

				<TabPanel>
					<Registration />
				</TabPanel>


			</TabPanels>
		</Tabs>
	);
};

export default ControlDashboard;
