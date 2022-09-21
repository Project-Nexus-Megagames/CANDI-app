import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getControl } from '../../redux/entities/characters';
import { Divider, Box, Text, Grid, GridItem, Heading } from '@chakra-ui/react';
import { SelectPicker } from 'rsuite';
import socket from '../../socket';

const ActionTable = () => {
	const actions = useSelector((state) => state.actions.list);
	const gamestate = useSelector((state) => state.gamestate);
	const assets = useSelector((state) => state.assets.list);
	const controlChars = useSelector(getControl);
	const [round, setRound] = useState(gamestate.round);

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

	const handleChange = (actionId, event) => {
		console.log(actionId, event);

		const data = {
			id: actionId,
			controller: event
		};
		socket.emit('request', { route: 'action', action: 'assignController', data });
	};

	return (
		<Box>
			<Divider />
			<Heading size="md">Round: {round}</Heading>
			<Divider />
			{actions.filter((el) => el.round === round).length === 0 && <b>Nothing here yet...</b>}
			{actions
				.filter((el) => el.round === round)
				.map((item) => (
					<div key={item._id}>
						<Grid templateColumns="repeat(5, 1fr)" gap={4} paddingLeft={8} paddingRight={8} align="left">
							<GridItem overflow="hidden">
								<Text>{item.name}</Text>
							</GridItem>
							<GridItem overflow="hidden">
								<Text>{item.creator.characterName}</Text>
							</GridItem>
							<GridItem overflow="hidden">
								<Text>{renderAssets(item.submission)}</Text>
							</GridItem>
							<GridItem overflow="hidden">
								<Text>{renderDicePool(item.submission)}</Text>
							</GridItem>
							<GridItem>
								<SelectPicker defaultValue={item.controller} data={controlChars} valueKey="_id" labelKey="characterName" onChange={(event) => handleChange(item._id, event)}></SelectPicker>
							</GridItem>
						</Grid>
						<Divider />
					</div>
				))}
		</Box>
	);
};
export default ActionTable;
