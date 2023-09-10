import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getControl } from '../../redux/entities/characters';
import { Divider, Box, Text, Grid, GridItem, Heading, Checkbox, HStack, Button, Input } from '@chakra-ui/react';
import { CheckRound, WarningRound, InfoRound } from '@rsuite/icons';
import SelectPicker from '../Common/SelectPicker';
import ActionDrawer from './ActionDrawer';
import socket from '../../socket';
import _ from 'lodash';
import CharacterNugget from '../Common/CharacterNugget';
//import

const ActionTable = () => {
	const actions = useSelector((state) => state.actions.list);
	const gamestate = useSelector((state) => state.gamestate);
	const assets = useSelector((state) => state.assets.list);
	const controlChars = useSelector(getControl);
	const [round, setRound] = useState(gamestate.round);
	const [selected, setSelected] = useState(null);
	const [dataToDisplay, setDataToDisplay] = useState(actions);
	const [filter, setFilter] = useState('');
	const [sort, setSort] = useState('');
	const templateColumns = '0.1fr 2fr 0.4fr 1fr 1.5fr 1fr 1fr 1fr 0.5fr 0.5fr';

	useEffect(() => {
		let filtered = [];
		if (filter) {
			switch (filter) {
				case 'news':
					filtered = actions.filter((el) => el.news);
					setDataToDisplay(filtered);
					break;
				case 'resolved':
					filtered = actions.filter((el) => el.results.length > 0 && el.results[0].ready);
					setDataToDisplay(filtered);
					break;
				case 'unresolved':
					filtered = actions.filter((el) => el.results.length === 0 || (el.results.length > 0 && !el.results[0].ready));
					setDataToDisplay(filtered);
					break;
				case 'unassigned':
					filtered = actions.filter((el) => el.controller?._id === '' || !el.controller);
					setDataToDisplay(filtered);
					break;
				default:
					filtered = actions.filter((el) => el.controller?._id === filter);
					setDataToDisplay(filtered);
			}
		} else setDataToDisplay(actions);
	}, [filter, actions]);

	useEffect(() => {
		let sorted = [];
		if (sort) {
			if (sort === 'controller') sorted = _.sortBy(dataToDisplay, 'controller.characterName');
			else sorted = _.sortBy(dataToDisplay, sort);
		} else sorted = _.sortBy(dataToDisplay, 'creator.characterName');
		setDataToDisplay(sorted);
	}, [sort, actions]);

	useEffect(() => {
		if (selected) {
			const newSelected = actions.find((el) => el._id === selected._id);
			setSelected(newSelected);
		}
	}, [actions, selected]);

	const renderDicePool = (submission) => {
		const diceToRender = [];
		const effortDice = submission.effort.amount + 'd10';
		diceToRender.push(effortDice);
		submission.assets.slice(0, 3).forEach((ass) => {
			const asset = assets.find((el) => el._id === ass);
      if (asset) diceToRender.push(asset.dice);
			else diceToRender.push(`ERROR cannot find asset ${ass}`)
		});
		return diceToRender.join(', ');
	};

	const renderAssets = (submission) => {
		const assetsToRender = [];
		submission.assets.slice(0, 3).forEach((ass) => {
			const asset = assets.find((el) => el._id === ass);
			if (asset) assetsToRender.push(asset?.name);
			else assetsToRender.push(`ERROR cannot find asset ${ass}`)
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

	const handleDiceResult = (actionId, event) => {
		const data = {
			id: actionId,
			diceresult: event
		};
		socket.emit('request', { route: 'action', action: 'diceResult', data });
	};

	const handleNews = (actionId, event) => {
		const data = {
			id: actionId,
			news: event
		};
		socket.emit('request', { route: 'action', action: 'setNewsWorthy', data });
	};

	const handleFilter = (filter, controllerId) => {
		if (filter !== 'controller') setFilter(filter);
		else setFilter(controllerId);
	};

	const handleSort = (sortCriteria) => {
		setSort(sortCriteria);
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
						if (action.controller?._id === controller) count++;
					});
				return count;
		}
	};

	return (
		<Box>
			<Box align='center' paddingBottom={4}>
				{[...Array(gamestate.round)].map((x, i) => (
					<Button style={{ margin: '4px' }} onClick={() => setRound(i + 1)} colorScheme='teal' variant={i + 1 === round ? 'solid' : 'outline'} key={i}>
						{i + 1}
					</Button>
				))}
			</Box>
			<Box borderWidth='3px' borderRadius='md' borderColor='teal' padding={8}>
				<Heading size='md'>Round: {round}</Heading>
				<Divider />
				<HStack spacing='24px'>
					{controlChars.map((controller) => (
						<div key={controller._id}>
							<Text as='b' onClick={() => handleFilter('controller', controller._id)} cursor='pointer'>
								{controller.characterName}:
							</Text>
							<Text onClick={() => handleFilter('controller', controller._id)} cursor='pointer'>
								{getActionCount(controller._id)}
							</Text>
						</div>
					))}
					<div>
						<Text as='b' onClick={() => handleFilter('unassigned')} cursor='pointer'>
							Unassigned:
						</Text>
						<Text onClick={() => handleFilter('unassigned')} cursor='pointer'>
							{getActionCount('unassigned')}
						</Text>
					</div>
					<div>
						<Text as='b' onClick={() => handleFilter('news')} cursor='pointer'>
							News:
						</Text>
						<Text onClick={() => handleFilter('news')} cursor='pointer'>
							{getActionCount('news')}
						</Text>
					</div>
					<div>
						<Text as='b' onClick={() => handleFilter('resolved')} cursor='pointer'>
							Resolved:
						</Text>
						<Text onClick={() => handleFilter('resolved')} cursor='pointer'>
							{getActionCount('resolved')}
						</Text>
					</div>
					<div>
						<Text as='b' onClick={() => handleFilter('unresolved')} cursor='pointer'>
							Unresolved:
						</Text>
						<Text onClick={() => handleFilter('unresolved')} cursor='pointer'>
							{getActionCount('unresolved')}
						</Text>
					</div>
					<Button colorScheme='teal' onClick={() => setFilter('')} size='sm'>
						Show All
					</Button>
					{filter !== '' && (
						<div>
							<Text as='b' color='red'>
								Applied Filter:
							</Text>
							<Text>{renderCurrentFilter()}</Text>
						</div>
					)}
				</HStack>
			</Box>
			<Divider />
			<Grid templateColumns={templateColumns} gap={4} paddingLeft={8} paddingRight={8} align='left'>
				<GridItem overflow='hidden'>
					<Text fontSize='lg' as='b' onClick={() => handleSort('name')} cursor='pointer'></Text>
				</GridItem>
				<GridItem overflow='hidden'>
					<Text fontSize='lg' as='b' onClick={() => handleSort('name')} cursor='pointer'>
						Action Title
					</Text>
				</GridItem>
				<GridItem overflow='hidden'>
					<Text fontSize='lg' as='b' onClick={() => handleSort('type')} cursor='pointer'>
						Type
					</Text>
				</GridItem>
				<GridItem overflow='hidden'>
					<Text fontSize='lg' as='b' onClick={() => handleSort('creator.characterName')} cursor='pointer'>
						Character
					</Text>
				</GridItem>
				<GridItem overflow='hidden'>
					<Text fontSize='lg' as='b'>
						Assets
					</Text>
				</GridItem>
				<GridItem overflow='hidden'>
					<Text fontSize='lg' as='b'>
						Dice Pool
					</Text>
				</GridItem>
				<GridItem overflow='hidden'>
					<Text fontSize='lg' as='b'>
						Dice Result
					</Text>
				</GridItem>
				<GridItem>
					<Text fontSize='lg' as='b' onClick={() => handleSort('controller')} cursor='pointer'>
						Assigned Control
					</Text>
				</GridItem>
				<GridItem>
					<Text fontSize='lg' as='b'>
						News
					</Text>
				</GridItem>
				<GridItem>
					<Text fontSize='lg' as='b'>
						Ready
					</Text>
				</GridItem>
			</Grid>
			<Divider />
			{dataToDisplay.filter((el) => el.round === round).length === 0 && <b>Nothing here yet...</b>}
			{dataToDisplay
				.filter((el) => el.round === round)
				.map((item, index) => (
					<Grid style={{ backgroundColor: index % 2 === 1 ? '#0f131a' : '#222936', padding: '8px 0 8px 0' }} justify={'center'} key={item._id} templateColumns={templateColumns} gap={2} paddingLeft={8} paddingRight={8} align='left' >
							<GridItem overflow='hidden' onClick={() => setSelected(item)} cursor='pointer'>
								<InfoRound style={{ color: 'cyan', fontSize: '1.5em' }} />
							</GridItem>
							<GridItem overflow='hidden'>
								<Text>{item.name}</Text>
							</GridItem>
							<GridItem overflow='hidden'>
								<Text>{item.type}</Text>
							</GridItem>
							<GridItem overflow='hidden'>
                <div>
                  <CharacterNugget size='sm' character={item.creator} />
                  <Text>{item.creator.characterName}</Text>                  
                </div>

							</GridItem>
							<GridItem overflow='hidden'>
								<Text>{renderAssets(item.submission)}</Text>
							</GridItem>
							<GridItem overflow='hidden'>
								<Text>{renderDicePool(item.submission)}</Text>
							</GridItem>
							<GridItem overflow='hidden'>
								<Input defaultValue={item.diceresult} onBlur={(event) => handleDiceResult(item._id, event.target.value)}></Input>
							</GridItem>
							<GridItem>
								<SelectPicker
									value={item.controller?.characterName}
									data={controlChars}
									valueKey='_id'
									label='characterName'
									onChange={(event) => handleController(item._id, event)}
								></SelectPicker>
							</GridItem>
							<GridItem>
								<Checkbox defaultChecked={item.news} onChange={(event) => handleNews(item._id, event.target.checked)}></Checkbox>
							</GridItem>
							<GridItem overflow='hidden'>
								<Text>{renderResReady(item.results)}</Text>
							</GridItem>
					</Grid>
				))}
			<ActionDrawer isOpen={selected} show={selected} selected={selected} closeDrawer={() => setSelected(false)} />
		</Box>
	);
};
export default ActionTable;
