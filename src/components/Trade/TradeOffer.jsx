import { Box, Divider, Flex, IconButton, Button, InputGroup, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputStepper, Select, Tag, NumberInputField, Card, Grid, VStack, SimpleGrid } from '@chakra-ui/react';
import { Check, CheckOutline, Close, CloseOutline, Plus } from '@rsuite/icons';
import React, { useEffect, useState } from 'react'; // React import
import { BsPencilFill, BsSave } from 'react-icons/bs';

import SelectPicker from '../Common/SelectPicker';
import ResourceNugget from '../Common/ResourceNugget';
import { AddAsset } from '../Common/AddAsset';
import AssetCard from '../Common/AssetCard';
import WordDivider from '../Common/WordDivider';
import TeamAvatar from '../Common/TeamAvatar';


import { useSelector } from 'react-redux';
import { getTeamAssets } from '../../redux/entities/assets';
import { getFadedColor } from '../../scripts/frontend';

const TradeOffer = (props) => { //trade object
	const [resources, setResources] = React.useState((props.offer && props.offer.resources) ? props.offer?.resources : []);
	const [assets, setAssets] = React.useState(props.offer?.assets ? props.offer.assets : []);
	const [comments, setComments] = useState(props.offer?.comments);
	const [mode, setMode] = useState('disabled');
	const teamAssets = useSelector(getTeamAssets);
	const disabled = mode === 'disabled';
	const readOnly = mode === 'readonly';

	useEffect(() => {
		setResources(props.offer?.resources)
	}, [props.offer]);

	useEffect(() => {
		setAssets(props.offer?.assets)
	}, [props.offer]);

	function onEdit() {
		// props.onOfferEdit();
		setMode("normal");
	}

	const submitEdit = async () => {
		props.onOfferEdit({ resources, assets, comments });
		setMode("disabled")
	}

	const removeElement = (index, type) => {
		let temp;
		switch (type) {
			case 'resource':
				temp = [...resources];
				temp.splice(index, 1)
				setResources(temp);
				break;
			case 'asset':
				temp = [...assets];
				temp.splice(index, 1)
				setAssets(temp);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

	const editState = (incoming, index, type) => {
		// console.log(incoming, index, type)
		let thing;
		let temp;
		switch (type) {
			case 'resource':
				thing = { ...resources[index] };
				temp = [...resources];

				if (typeof (incoming) === 'number') {
					thing.value = parseInt(incoming)
				}
				else {
					thing.type = (incoming);
					thing.value = 0;
				}
				temp[index] = thing;
				setResources(temp);
				break;
			case 'add-asset':
				// thing = teamAssets.find(el => el._id === incoming);
				setAssets([...assets, incoming]);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

	const getMax = (res) => {
		return props.myAccount.resources.find(el => el.type === res)?.balance;
	}


	return (
		<div className='trade' style={{ padding: '8px', height: '100%', overflow: 'auto', borderColor: getFadedColor(props.team?.name), border: '2px solid', textAlign: 'center' }}>
			{props.team && <TeamAvatar online={props.ratified} badge team={props.team} />}
			<h3>{props.team.name}</h3>
			{props.status.some(t => t === 'completed') && <h4 style={{ textAlign: 'center' }}>Traded away these items</h4>}
			<WordDivider word={'Resources'}></WordDivider>

			<VStack divider={<Divider style={{ width: '80%' }} />} >
				{!disabled && resources.map((resource, index) => (
					<InputGroup key={index} className='styleCenter'>

						<SelectPicker value={resource.type} label={'type'} valueKey={'type'} placeholder='Select Resource' data={props.myAccount.resources.filter(el => el.balance > 0)}
							onChange={(event) => { editState(event, index, 'resource'); }} />

						<NumberInput
							style={{ width: '50%' }}
							size='lg'
							prefix='value'
							defaultValue={resource.value}
							value={resource.value}
							max={getMax(resource.type)}
							min={0}
							onChange={(event) => editState(parseInt(event), index, 'resource')}>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>

						<IconButton onClick={() => removeElement(index, 'resource')} variant="outline" colorScheme='red' size="sm" icon={<Close />} />
					</InputGroup>
				))}
			</VStack>

			{!disabled && <IconButton onClick={() => setResources([...resources, { value: 1, type: 'credit' }])} variant="solid" colorScheme='green' size="sm" icon={<Plus />} />}
			{disabled && <Flex style={{ minHeight: '20vh' }} justify="space-around" align={'center'} >
				{resources.length === 0 && <h5>No Resources Offered</h5>}
				{disabled && resources.map((resource, index) => (
					<Box key={resource._id}>
						<ResourceNugget fontSize={'2em'} height="150px" index={index} value={`${resource.value}`} type={resource.type} />
					</Box>
				))}
				{/* {!disabled && 
						<ResourceNugget type='plus' amount={'Add'}/>} */}
			</Flex>}

			<WordDivider word={'Assets'}></WordDivider>

			{<SimpleGrid style={{ minHeight: '20vh' }} minChildWidth='200px' spacing='20px' align={'center'}>
				{assets && disabled && assets.length === 0 && <h5>No Assets Offered</h5>}
				{assets && assets.map((asset, index) => (
					<Box key={assets._id}>
						<AssetCard showRemove={!disabled} removeAsset={() => removeElement(index, 'asset')} height="150px" index={index} asset={asset} />
					</Box>
				))}

				{!disabled &&
					<AddAsset assets={teamAssets.filter(el => el.tags.some(s => s === 'tradable'))} handleSelect={(asset) => editState(asset, 0, 'add-asset')} />}
			</SimpleGrid >}

			<Divider />

			{props.status.some(el => el !== 'completed') && <Flex >
				<Box  >
					{props.myAccount._id === props.account._id && <div>
						{disabled && <IconButton size='sm'  variant="solid" colorScheme={"facebook"} icon={<BsPencilFill/>}   onClick={() => onEdit()}>Edit Trade</IconButton>}
						{!disabled && <IconButton size='sm' variant="solid" colorScheme={"facebook"}  icon={<BsSave/>} onClick={() => submitEdit()}>Save Offer</IconButton> }
					</div>}

				</Box>
				<Box  >
					{props.myAccount._id === props.account._id && <div className='styleCenter' >
						{props.ratified && <Button isLoading={props.loading} colorScheme={'green'} variant="solid" isDisabled={mode === 'normal' || props.loading} size='sm' leftIcon={<CheckOutline />} onClick={() => props.rejectProposal()}>Proposal Approved</Button>}
						{!props.ratified && <Button isLoading={props.loading} colorScheme={'orange'} variant="solid" isDisabled={(resources.length === 0 && assets.length === 0) || mode === 'normal' || props.loading} size='sm' leftIcon={<CloseOutline />} onClick={() => props.submitApproval()}>Proposal Un-Approved</Button>}
						{(resources.length === 0 && assets.length === 0) && <Tag variant={'solid'} colorScheme='red' >Must offer them SOMETHING</Tag>}
					</div>}
					{props.myAccount._id !== props.account._id && <div>
						{props.ratified && <Tag variant={'solid'} colorScheme='green'>Deal Approved by {props.account.name}</Tag>}
						{!props.ratified && <Tag variant={'solid'} colorScheme='red'>Awaiting approval by {props.account.name}</Tag>}
					</div>}

				</Box>
			</Flex>}

		</div>
	)
}

export default (TradeOffer);