import React, { useEffect } from 'react';
import { getTeamAccount } from '../../redux/entities/accounts';
import { getMyAssets, getTeamAssets } from '../../redux/entities/assets';
import socket from '../../socket';
import AssetInfo from '../Common/AssetInfo';
import { getWorkingAuctions } from '../../redux/entities/markets';
import { useSelector } from 'react-redux';
import { Funnel, Plus } from '@rsuite/icons';
import { Box, Button, ButtonGroup, Grid, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Tooltip, useDisclosure } from '@chakra-ui/react';
import CheckerPick from '../Common/CheckerPick';
import { useNavigate } from 'react-router-dom';
import Auction from './Auction';

const Auctions = (props) => {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { login, team, } = useSelector(s => s.auth);
	const myCharacter = useSelector(s => s.auth.character);
	const assets = useSelector(s => s.assets.list);
	const teams = useSelector(s => s.teams.list);
	const account = useSelector(getTeamAccount);
	const myAssets = useSelector(getMyAssets);
	const teamAssets = useSelector(getTeamAssets);
	const markets = useSelector(getWorkingAuctions);

	const [showInfo, setShowInfo] = React.useState(false);
	const [mode, setMode] = React.useState(false);
	const [hours, setHours] = React.useState(0);
	const [starting, setStarting] = React.useState(0);
	const [autobuy, setAutobuy] = React.useState(0);
	const [asset, setAsset] = React.useState([]);
	const [auctions, setAuctions] = React.useState([]);
	const [tags, setTags] = React.useState([]);
	const [checkerData, setCheckerData] = React.useState([]);
	const [description, setDescription] = React.useState('');

	if (!props.login) {
		navigate("/");
		return <div />;
	}

	useEffect(() => {
		// display.some(el => el !== site.subType)
		if (markets && tags && tags.length > 0) {
			let auctions = [...markets];
			let test = [];
			for (const tag of tags) {
				test = [...auctions.filter((el) => el.tags.some((t) => t === tag))];
			}

			// console.log(test);
			setAuctions(test);
		} else if (tags && tags.length === 0) {
			setAuctions(markets);
		}
	}, [markets, tags]);

	// dynamically creat tags based on the aseets that exis
	useEffect(() => {
		if (markets) {
			let uniqueChars = [];
			let formatted = [];
			for (const asset of markets) {
				uniqueChars = [...new Set(asset.tags)];
			}
			for (const tag of uniqueChars) {
				formatted.push({ value: tag, label: tag });
			}
			setCheckerData(formatted);
		}
	}, [markets]);

	const handleCreate = () => {
		const formattedAssets = [];
		for (const ass of asset) {
			const formatted = assets.find((el) => el._id === ass);
			formattedAssets.push({
				type: formatted.model,
				_id: formatted._id
			});
		}
		const data = {
			name: description,
			tags: ['auction'],
			creator: myCharacter._id,
			highestBidder: myCharacter._id,
			bidAccount: account._id,
			account: account._id,
			stuff: formattedAssets,
			hours,
			highestBid: starting,
			autobuy
		};
		socket.emit('request', { route: 'market', action: 'create', data });
		console.log('WHAT', data);
		setMode(false);
		setDescription('');
		setHours(0);
		setStarting(0);
		setAutobuy(0);
		setAsset([]);
	};

	return (
		<div style={{ height: 'calc(100vh - 110px)', textAlign: 'center' }}>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<h3>Auctions{'- '}</h3>
				<ButtonGroup isAttached>
					<Tooltip openDelay={200} hasArrow label='New Auction' placement='top'>
						<IconButton onClick={() => setMode('new')} colorScheme='green' icon={<Plus />}></IconButton>
					</Tooltip>

					<Tooltip openDelay={200} hasArrow label='Filter' placement='top'>
						<IconButton colorScheme='purple' onClick={() => setMode(mode === 'filter' ? false : 'filter')} icon={<Funnel />}>{mode}</IconButton>
					</Tooltip>
				</ButtonGroup>
			</div>
			{auctions.length}
			<Box style={{ height: '80vh', overflow: 'auto', justifyContent: 'center' }}>
				<Grid templateColumns='repeat(2, 1fr)' gap={4}>
					{auctions
						.sort((a, b) => {
							// sort the catagories alphabetically
							if (a.timeout > b.timeout) {
								return 1;
							}
							if (a.timeout < b.timeout) {
								return -1;
							}
							return 0;
						})
						.map((market) => (
							<Auction key={market._id} market={market} />
						))}
				</Grid>

			</Box>

			{<AssetInfo asset={showInfo} showInfo={showInfo} closeInfo={() => setShowInfo(false)} />}

			<Modal isOpen={mode === 'new'} onClose={onClose}>
				<ModalOverlay />
				<ModalContent style={{ backgroundColor: "#343840", color: 'white' }} >
					<ModalHeader>New Auction</ModalHeader>
					<ModalCloseButton onClick={() => setMode(false)} />

					<ModalBody>
						<div>
							<Input placeholder='Name' value={description} onChange={(e) => setDescription(e.target.value)}></Input>
							<CheckerPick
								label='name'
								placeholder={`${[...assets].length} Eligible Assets`}
								onChange={(event) => setAsset(event)}
								data={[...assets]}
								value={asset}
							/>
						</div>

						<br />

						Game hours until auction expires
						<NumberInput value={hours} min={0} onChange={(valueAsNumber) => setHours(valueAsNumber)} keepWithinRange>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>

						<br />

						Starting Bid
						<NumberInput value={starting} min={0} onChange={(valueAsNumber) => setStarting(valueAsNumber)} keepWithinRange>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>

						<br />

						AutoBuy (disabled when 0)
						<NumberInput value={autobuy} min={0} onChange={(valueAsNumber) => setAutobuy(valueAsNumber)} keepWithinRange>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</ModalBody>

					<ModalFooter>
						<ButtonGroup>
							<Button disabled={asset.length <= 0 || hours <= 0 || description === ''} onClick={() => handleCreate()} color='green'>
								New
							</Button>
							<Button
								onClick={() => {
									setMode(false);
								}}
								color='red'
								appearance='ghost'
							>
								Close
							</Button>
						</ButtonGroup>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({});

export default Auctions;
