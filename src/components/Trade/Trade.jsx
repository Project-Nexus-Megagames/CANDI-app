import { Box, Button, ButtonGroup, Divider, Flex, Grid, GridItem, IconButton, VStack } from '@chakra-ui/react';
import { Funnel, Trash } from '@rsuite/icons';
import React, { useEffect } from 'react'; // React import
import { BsPlus, BsX, BsXCircle } from 'react-icons/bs';
import { useSelector } from 'react-redux'; // Redux store provider
import { useNavigate } from "react-router";

import socket from '../../socket';
import SelectPicker from '../Common/SelectPicker';
import { CandiWarning } from '../Common/CandiWarning';
import NexusTag from '../Common/NexusTag';
import TeamAvatar from '../Common/TeamAvatar';
import CheckerPick from '../Common/CheckerPick';

import TradeCard from './TradeCard';
import TradeOffer from './TradeOffer';

import { getFadedColor, getThisTeamFromAccount } from '../../scripts/frontend';
import { getTeamTrades } from '../../redux/entities/trades';


import { FaHandshake } from 'react-icons/fa';
import { getCharAccount } from '../../redux/entities/accounts';

const Trade = (props) => {
	const tradeLoading = useSelector(s => s.trades.loading);
	const gameLoading = useSelector(s => s.gamestate.loading);
	const trades = useSelector(s => s.trades.list);
	const accounts = useSelector(s => s.accounts.list);
	const assets = useSelector(s => s.assets.list);
	const teams = useSelector(s => s.teams.list);

	const { login } = useSelector(s => s.auth);
	const myTrades = useSelector(getTeamTrades);
	const account = useSelector(getCharAccount);

	const [selectedTrade, setSelectedTrade] = React.useState(null);
	const [mode, setMode] = React.useState(false);
	const [past, setPast] = React.useState(false);
	const [partner, setPartner] = React.useState(false);
	const [tags, setTags] = React.useState(['draft', 'completed']);
	const [tradeState, setTradeState] = React.useState([]);


	const navigate = useNavigate();
	useEffect(() => {
		if (!props.login) {
			navigate("/");
		}
	}, []);


	useEffect(() => {
		if (selectedTrade) {
			let trade = trades.find(el => el._id === selectedTrade._id);
			setSelectedTrade(trade);
		}
	}, [trades, selectedTrade]);

	useEffect(() => {
		if (trades && tags && tags.length > 0) {
			let trades0 = past ? [...myTrades] : [...trades];
			let test = [];
			for (const tag of tags) {
				test = [...trades0.filter(el => el.status.some(t => t === tag)), ...test];
			}
			setTradeState(test)
		}
		else if (tags && tags.length === 0) {
			setTradeState(trades)
		}
	}, [trades, tags, past]);

	const createTrade = async () => {
		console.log('Creating a new Trade...');
		let data = {
			initiator: account._id,
			name: account.name,
			tradePartner: partner
		};
		try {
			socket.emit('request', { route: 'trade', action: 'newTrade', data });
			setMode(false);
			setPartner(false);
		} catch (err) {
			// Alert.error(`${err.data} - ${err.message}`)
		}
	}

	const selectTrade = async (selected) => {
		const selectedTrade = tradeState.find(el => el._id === selected._id);
		setSelectedTrade(selectedTrade);
	}

	const onOfferEdit = async (form) => {
		let data = {
			offer: form,
			trade: selectedTrade._id,
			editor: account._id
		};
		try {
			socket.emit('request', { route: 'trade', action: 'modifyTrade', data });
		} catch (err) {
			// Alert.error(`${err.data} - ${err.message}`)
		}
	}

	const submitApproval = async () => {
		let data = {
			trade: selectedTrade._id,
			ratifier: account._id,
			boolean: true
		};
		try {
			socket.emit('request', { route: 'trade', action: 'ratifyTrade', data });
		} catch (err) {
			// Alert.error(`${err.data} - ${err.message}`)
		}
	}

	const rejectProposal = async () => {
		let data = {
			trade: selectedTrade._id,
			ratifier: account._id,
			boolean: false
		};
		try {
			socket.emit('request', { route: 'trade', action: 'ratifyTrade', data });
		} catch (err) {
			// Alert.error(`${err.data} - ${err.message}`)
		}
	}

	const trashProposal = async () => {
		let data = {
			trade: selectedTrade._id,
		};
		socket.emit('request', { route: 'trade', action: 'deleteTrade', data });
		setSelectedTrade(false);
	}

	if (!login) return (<div />);
	const initiatorAccount = selectedTrade ? accounts.find(el => el._id === selectedTrade.initiator.account) : {};
	const partnerAccount = selectedTrade ? accounts.find(el => el._id === selectedTrade.tradePartner.account) : {};

	const initiatorTeam = getThisTeamFromAccount(accounts, teams, selectedTrade?.initiator.account);
	const partnerTeam = getThisTeamFromAccount(accounts, teams, selectedTrade?.tradePartner.account);

	return (
		<div>
			<Grid
				templateAreas={`"to1 to2 nav"`}
				gridTemplateColumns={'40% 40% 20%'}
				gap='1'
				fontWeight='bold'
			>
				<GridItem pl='2' bg='#0f131a' area={'to1'} >
					{!selectedTrade && <h4>Please select a Trade...</h4>}
					{selectedTrade &&
						<TradeOffer
							submitApproval={submitApproval}
							rejectProposal={rejectProposal}
							myAccount={account}
							account={selectedTrade.initiator.account === account._id ? partnerAccount : initiatorAccount}
							team={selectedTrade.initiator.account === account._id ? partnerTeam : initiatorTeam}
							offer={selectedTrade.initiator.account === account._id ? selectedTrade.tradePartner.offer : selectedTrade.initiator.offer}
							ratified={selectedTrade.initiator.account === account._id ? selectedTrade.tradePartner.ratified : selectedTrade.initiator.ratified}
							status={selectedTrade.status}
							loading={tradeLoading || gameLoading}
							onOfferEdit={onOfferEdit} />}
				</GridItem>

				<GridItem overflow='auto' pl='2' bg='#0f131a' area={'to2'} >
					{selectedTrade && <TradeOffer
						submitApproval={submitApproval}
						rejectProposal={rejectProposal}
						offer={selectedTrade.initiator.account === account._id ? selectedTrade.initiator.offer : selectedTrade.tradePartner.offer}
						ratified={selectedTrade.initiator.account === account._id ? selectedTrade.initiator.ratified : selectedTrade.tradePartner.ratified}
						myAccount={account}
						account={selectedTrade.initiator.account === account._id ? initiatorAccount : partnerAccount}
						status={selectedTrade.status}
						loading={tradeLoading || gameLoading}
						onOfferEdit={onOfferEdit} />}
				</GridItem>

				<GridItem pl='2' bg='#343a40' area={'nav'}  >
					{!selectedTrade && <Box>
						{<div >
							{mode !== 'new' && <Flex justify='space-around' >
								<Button size={'sm'} onClick={() => setMode('new')} leftIcon={<BsPlus />} variant={"solid"} colorScheme='green'>New Trade</Button>
								<ButtonGroup>

									<Button
										size={'sm'}
										onClick={() => setPast(!past)}
										leftIcon={past ? <TeamAvatar size={'xs'} account={account._id} /> : <FaHandshake style={{ margin: '4px', }} />}
										variant={past ? "solid" : "outline"}
										style={{ backgroundColor: getFadedColor(account.name) }}
									>
										{past ? "My Trades" : "All Trades"}
									</Button>

									<CheckerPick
										button={<IconButton size={'sm'} variant={'solid'} colorScheme='purple' onClick={() => setMode(mode === 'filter' ? false : 'filter')} icon={<Funnel />} />}
										data={[{ _id: 'draft', }, { _id: 'completed' }]}
										value={tags}
										onChange={setTags}
									/>
								</ButtonGroup>


							</Flex>}
						</div>}

						{mode === 'new' && <div className='styleCenter'>
							<SelectPicker label={'name'} placeholder='Select Trade Partner' data={accounts.filter(el => el._id !== account._id && el.type === 'individual')} onChange={setPartner} />
							<Button size={'sm'} variant={"solid"} colorScheme='green' disabled={!partner} loading={tradeLoading} onClick={() => createTrade()}>Create</Button>
							<IconButton size={'sm'} variant={'solid'} colorScheme='red' onClick={() => setMode(false)} icon={<BsX />} />

						</div>}

						<hr />
						<div >
							<VStack divider={<Divider />} style={{ height: 'calc(100vh - 195px)', overflow: 'auto', textAlign: 'center', }}>
								{tradeState.map((trade) => (
									<TradeCard initiatorTeam={initiatorTeam} partnerTeam={partnerTeam} key={trade._id} trade={trade} selectTrade={selectTrade} isMine={trade.initiator.account === account._id} ></TradeCard>
								))}
							</VStack>

						</div>
					</Box>}


					{selectedTrade && <div>
						<Box >
							<ButtonGroup isAttached>
								{selectedTrade && !selectedTrade.status.some(el => el === 'completed') && <Button variant={'solid'} colorScheme={'red'} size='sm' leftIcon={<Trash />} onClick={() => setMode('trash')}>Trash Trade</Button>}
								{selectedTrade && <Button colorScheme={'blue'} size='sm' rightIcon={<BsXCircle />} variant={'solid'} onClick={() => setSelectedTrade(null)}>Close Trade</Button>}
							</ButtonGroup>

							<p style={{ size: '11px' }} ><b>Last Updated:</b> {`${new Date(selectedTrade.updatedAt).toLocaleTimeString()} - ${new Date(selectedTrade.updatedAt).toDateString()}`}</p>
							{selectedTrade.status.map((tag, index) => (<NexusTag key={tag} variant='solid' colorScheme="blue">{tag}</NexusTag>))}
							<TradeCard initiatorTeam={initiatorTeam} partnerTeam={partnerTeam} trade={selectedTrade} isMine={selectedTrade.tradePartner.account === account._id || selectedTrade.initiator.account === account._id} ></TradeCard>
						</Box>

					</div>}
				</GridItem>
			</Grid>

			<CandiWarning open={mode === 'trash'} title={"Delete this trade?"} onClose={() => setMode(false)} handleAccept={() => trashProposal()}>
				This cannot be undone
			</CandiWarning>

		</div>
	);
}


export default (Trade);