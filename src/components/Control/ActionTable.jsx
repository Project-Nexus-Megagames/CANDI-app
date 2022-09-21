import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getControl } from '../../redux/entities/characters';
import { Divider, Box, Text, Grid, GridItem, Heading, Checkbox, Stack, HStack, Button } from '@chakra-ui/react';
import { SelectPicker } from 'rsuite';
import AgendaDrawer from '../Agendas/AgendaDrawer';
import socket from '../../socket';

const ActionTable = () => {
	const actions = useSelector((state) => state.actions.list);
	const gamestate = useSelector((state) => state.gamestate);
	const assets = useSelector((state) => state.assets.list);
	const controlChars = useSelector(getControl);
	const [round, setRound] = useState(gamestate.round);
	const [selected, setSelected] = useState(null);

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

	const getActionCount = (controller) => {
		let count = 0;
		if (controller === 'unassigned') {
			actions
				.filter((el) => el.round === round)
				.forEach((action) => {
					if (!action.controller) count++;
				});
		} else {
			actions
				.filter((el) => el.round === round)
				.forEach((action) => {
					if (action.controller === controller) count++;
				});
		}
		return count;
	};

	return (
		<Box>
			<Divider />
			<Heading size="md">Round: {round}</Heading>
			<Divider />
			<Box borderWidth="3px" borderRadius="md" borderColor="teal" padding={8}>
				<HStack spacing="24px">
					{controlChars.map((controller) => (
						<div key={controller._id}>
							<Text as="b">{controller.characterName}:</Text>
							<Text>{getActionCount(controller._id)}</Text>
						</div>
					))}
					<div>
						<Text as="b">Unassigned: </Text>
						<Text>{getActionCount('unassigned')}</Text>
					</div>
					<Button colorScheme="teal">Show My Actions</Button>
					<Button colorScheme="teal">Show Newsworthy Actions</Button>
					<Button colorScheme="teal">Show Unassigned Actions</Button>
				</HStack>
			</Box>
			<Divider />
			<Grid templateColumns="2fr 0.5fr 1fr 2fr 1fr 1fr 0.5fr" gap={4} paddingLeft={8} paddingRight={8} align="left">
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
			</Grid>
			<Divider />
			{actions.filter((el) => el.round === round).length === 0 && <b>Nothing here yet...</b>}
			{actions
				.filter((el) => el.round === round)
				.map((item) => (
					<div key={item._id}>
						<Grid templateColumns="2fr 0.5fr 1fr 2fr 1fr 1fr 0.5fr" gap={4} paddingLeft={8} paddingRight={8} align="left">
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
						</Grid>
						<Divider />
					</div>
				))}
			<AgendaDrawer isOpen={selected} show={selected} selected={selected} closeDrawer={() => setSelected(false)} />
		</Box>
	);
};
export default ActionTable;
