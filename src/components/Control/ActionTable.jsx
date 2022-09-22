import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getControl } from '../../redux/entities/characters';
import { Divider, Box, Text, Grid, GridItem, Heading, Checkbox, Stack, HStack, Button } from '@chakra-ui/react';
import { SelectPicker } from 'rsuite';
import { CheckRound, WarningRound } from '@rsuite/icons';
import AgendaDrawer from '../Agendas/AgendaDrawer';
import socket from '../../socket';

const ActionTable = () => {
	const actions = useSelector((state) => state.actions.list);
	const gamestate = useSelector((state) => state.gamestate);
	const assets = useSelector((state) => state.assets.list);
	const controlChars = useSelector(getControl);
	const [round, setRound] = useState(gamestate.round);
	const [selected, setSelected] = useState(null);
	const [filteredData, setFilteredData] = useState([]);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		let filtered = [];
		if (filter) {
			switch (filter) {
				case 'news':
					filtered = actions.filter((el) => el.news);
					setFilteredData(filtered);
					break;
				case 'resolved':
					filtered = actions.filter((el) => el.results.length > 0 && el.results[0].ready);
					setFilteredData(filtered);
					break;
				case 'unresolved':
					filtered = actions.filter((el) => el.results.length === 0 || (el.results.length > 0 && !el.results[0].ready));
					setFilteredData(filtered);
					break;
				default:
					filtered = actions.filter((el) => el.controller === filter);
					setFilteredData(filtered);
			}
		} else setFilteredData(actions);
	}, [filter]);

	const renderDicePool = (submission) => {
		const diceToRender = [];
		const effortDice = submission.effort.amount + 'd10';
		diceToRender.push(effortDice);
		submission.assets.forEach((ass) => {
			const asset = assets.find((el) => el._id === ass);
			diceToRender.push(asset.dice);
		});
		return diceToRender.join(', ');
	};

	const renderAssets = (submission) => {
		const assetsToRender = [];
		submission.assets.forEach((ass) => {
			const asset = assets.find((el) => el._id === ass);
			assetsToRender.push(asset.name);
		});
		return assetsToRender.join(', ');
	};

	const renderResReady = (results) => {
		if (results.length > 0 && results[0].ready) return <CheckRound style={{ color: 'green', fontSize: '2em' }} />;
		else return <WarningRound style={{ color: 'red', fontSize: '2em' }} />;
	};

	const renderCurrentFilter = () => {
		switch (filter) {
			case 'news':
				return 'Showing newsworthy actions';
			case 'resolved':
				return 'Showing resolved actions';
			case 'unresolved':
				return 'Showing unresolved actions';
			case 'unassigned':
				return 'Showing unassigned actions';
			default:
				const controllerName = controlChars.find((el) => el._id === filter).characterName;
				return `Showing ${controllerName}'s actions`;
		}
	};

	const handleController = (actionId, event) => {
		const data = {
			id: actionId,
			controller: event
		};
		socket.emit('request', { route: 'action', action: 'assignController', data });
	};

	const handleNews = (actionId, event) => {
		const data = {
			id: actionId,
			news: event
		};
		socket.emit('request', { route: 'action', action: 'setNewsWorthy', data });
	};

	const handleFilter = (filter, controllerId) => {
		switch (filter) {
			case 'news':
				setFilter('news');
				break;
			case 'resolved':
				setFilter('resolved');
				break;
			case 'unresolved':
				setFilter('unresolved');
				break;
			default:
				setFilter(controllerId);
		}
	};

	const getActionCount = (controller) => {
		let count = 0;
		switch (controller) {
			case 'unassigned':
				actions
					.filter((el) => el.round === round)
					.forEach((action) => {
						if (!action.controller) count++;
					});
				return count;
			case 'news':
				actions
					.filter((el) => el.round === round)
					.forEach((action) => {
						if (action.news) count++;
					});
				return count;
			case 'resolved':
				actions
					.filter((el) => el.round === round)
					.forEach((action) => {
						if (action.results.length > 0 && action.results[0].ready) count++;
					});
				return count;
			case 'unresolved':
				actions
					.filter((el) => el.round === round)
					.forEach((action) => {
						if (action.results.length === 0 || (action.results.length > 0 && !action.results[0].ready)) count++;
					});
				return count;
			default:
				actions
					.filter((el) => el.round === round)
					.forEach((action) => {
						if (action.controller === controller) count++;
					});
				return count;
		}
	};

	return (
		<Box>
			<Box align="center" paddingBottom={4}>
				{[...Array(gamestate.round)].map((x, i) => (
					<Button style={{ margin: '4px' }} onClick={() => setRound(i + 1)} colorScheme="teal" variant={i + 1 === round ? 'solid' : 'outline'} key={i}>
						{i + 1}
					</Button>
				))}
			</Box>
			<Box borderWidth="3px" borderRadius="md" borderColor="teal" padding={8}>
				<Heading size="md">Round: {round}</Heading>
				<Divider />
				<HStack spacing="24px">
					{controlChars.map((controller) => (
						<div key={controller._id}>
							<Text as="b" onClick={() => handleFilter('controller', controller._id)} cursor="pointer">
								{controller.characterName}:
							</Text>
							<Text onClick={() => handleFilter('controller', controller._id)} cursor="pointer">
								{getActionCount(controller._id)}
							</Text>
						</div>
					))}
					<div>
						<Text as="b" onClick={() => handleFilter('controller', 'unassigned')} cursor="pointer">
							Unassigned:
						</Text>
						<Text onClick={() => handleFilter('controller', 'unassigned')} cursor="pointer">
							{getActionCount('unassigned')}
						</Text>
					</div>
					<div>
						<Text as="b" onClick={() => handleFilter('news')} cursor="pointer">
							News:
						</Text>
						<Text onClick={() => handleFilter('news')} cursor="pointer">
							{getActionCount('news')}
						</Text>
					</div>
					<div>
						<Text as="b" onClick={() => handleFilter('resolved')} cursor="pointer">
							Resolved:
						</Text>
						<Text onClick={() => handleFilter('resolved')} cursor="pointer">
							{getActionCount('resolved')}
						</Text>
					</div>
					<div>
						<Text as="b" onClick={() => handleFilter('unresolved')} cursor="pointer">
							Unresolved:
						</Text>
						<Text onClick={() => handleFilter('unresolved')} cursor="pointer">
							{getActionCount('unresolved')}
						</Text>
					</div>
					<Button colorScheme="teal" onClick={() => setFilter('')} size="sm">
						Show All
					</Button>
					{filter !== '' && (
						<div>
							<Text as="b" color="red">
								Applied Filter:
							</Text>
							<Text>{renderCurrentFilter()}</Text>
						</div>
					)}
				</HStack>
			</Box>
			<Divider />
			<Grid templateColumns="2fr 0.5fr 1fr 2fr 1fr 1fr 0.5fr 0.5fr" gap={4} paddingLeft={8} paddingRight={8} align="left">
				<GridItem overflow="hidden">
					<Text fontSize="lg" as="b">
						Action Title
					</Text>
				</GridItem>
				<GridItem overflow="hidden">
					<Text fontSize="lg" as="b">
						Type
					</Text>
				</GridItem>
				<GridItem overflow="hidden">
					<Text fontSize="lg" as="b">
						Character
					</Text>
				</GridItem>
				<GridItem overflow="hidden">
					<Text fontSize="lg" as="b">
						Assets
					</Text>
				</GridItem>
				<GridItem overflow="hidden">
					<Text fontSize="lg" as="b">
						Dice Pool
					</Text>
				</GridItem>
				<GridItem>
					<Text fontSize="lg" as="b">
						Assigned Control
					</Text>
				</GridItem>
				<GridItem>
					<Text fontSize="lg" as="b">
						News
					</Text>
				</GridItem>
				<GridItem>
					<Text fontSize="lg" as="b">
						Ready
					</Text>
				</GridItem>
			</Grid>
			<Divider />
			{filteredData.filter((el) => el.round === round).length === 0 && <b>Nothing here yet...</b>}
			{filteredData
				.filter((el) => el.round === round)
				.map((item) => (
					<div key={item._id}>
						<Grid templateColumns="2fr 0.5fr 1fr 2fr 1fr 1fr 0.5fr 0.5fr" gap={4} paddingLeft={8} paddingRight={8} align="left">
							<GridItem overflow="hidden" onClick={() => setSelected(item)}>
								<Text>{item.name}</Text>
							</GridItem>
							<GridItem overflow="hidden" onClick={() => setSelected(item)}>
								<Text>{item.type}</Text>
							</GridItem>
							<GridItem overflow="hidden" onClick={() => setSelected(item)}>
								<Text>{item.creator.characterName}</Text>
							</GridItem>
							<GridItem overflow="hidden" onClick={() => setSelected(item)}>
								<Text>{renderAssets(item.submission)}</Text>
							</GridItem>
							<GridItem overflow="hidden" onClick={() => setSelected(item)}>
								<Text>{renderDicePool(item.submission)}</Text>
							</GridItem>
							<GridItem>
								<SelectPicker defaultValue={item.controller} data={controlChars} valueKey="_id" labelKey="characterName" onChange={(event) => handleController(item._id, event)}></SelectPicker>
							</GridItem>
							<GridItem>
								<Checkbox defaultChecked={item.news} onChange={(event) => handleNews(item._id, event.target.checked)}></Checkbox>
							</GridItem>
							<GridItem overflow="hidden" onClick={() => setSelected(item)}>
								<Text>{renderResReady(item.results)}</Text>
							</GridItem>
						</Grid>
						<Divider />
					</div>
				))}
			<AgendaDrawer isOpen={selected} show={selected} selected={selected} closeDrawer={() => setSelected(false)} />
		</Box>
	);
};
export default ActionTable;
