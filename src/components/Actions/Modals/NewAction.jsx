import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getTextColor,  } from '../../../scripts/frontend';
import { getMyAssets, getTeamAssets } from '../../../redux/entities/assets';
import { getMyCharacter } from '../../../redux/entities/characters';
import socket from '../../../socket';
import {	Modal,	ModalOverlay,	ModalContent,	ModalHeader,	ModalFooter,	ModalBody,	ModalCloseButton,	Tag, Spinner,	Box,	Flex,	Button,	ButtonGroup,	Tooltip,	Divider,	Spacer, Grid} from '@chakra-ui/react';
import CheckerPick from '../../Common/CheckerPick';
import { AddAsset } from '../../Common/AddAsset';
import { CheckIcon, PlusSquareIcon, ViewIcon } from '@chakra-ui/icons';
import WordDivider from '../../Common/WordDivider';
import AssetCard from '../../Common/AssetCard';
import SelectPicker from '../../Common/SelectPicker';
import { getTeamHQ } from '../../../redux/entities/locations';
import ResourceNugget from '../../Common/ResourceNugget';
import { getTeamAccount } from '../../../redux/entities/accounts';
import { DiceList } from '../../Common/DiceList';

/**
 * Form for a new ACTION
 * @param {*} props
 * @returns Component
 */
const NewAction = (props) => {
  const { actionType } = props;
	const gameConfig = useSelector((state) => state.gameConfig);
  const locations = useSelector((state) => state.locations.list)
  const facilities = useSelector((state) => state.facilities.list)
  

	const { character } = useSelector((s) => s.auth);
	// const character = useSelector(getMyCharacter);
	const myAssets = useSelector(getMyAssets);
  const hq = useSelector(getTeamHQ);
	const teamAssets = useSelector(getTeamAssets);
	const teamAccount = useSelector(getTeamAccount);

	const [assets, setAssets] = React.useState([]);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');
	const [destination, setDestination] = React.useState(false);
	const [facility, setFacility] = React.useState(undefined);
  
  

  useEffect(() => {
    newMap(actionType.maxAssets);
	}, [])



	const editState = (incoming, type, index) => {
    console.log(type)
		let thing;
		switch (type) {
      case 'Asset':
        let temp = [ ...assets ];
        temp[index] = incoming;
        setAssets(temp);
        break;
			default:
				console.log('UwU Scott made an oopsie doodle!');
		}
	};

	const handleSubmit = async () => {
		// 1) make a new action
		const data = {
			submission: {
				assets: assets.filter(el => el),
				description: description,
				intent: intent,
        facility: facility,
        location: destination,
			},
			name: name,
			type: actionType.type,
			creator: character._id,
      account: teamAccount._id,
      distance: getDistance(destination.coords)
		};
		setDescription('');
		setIntent('');
		setName('');
		setAssets([]);

		socket.emit('request', { route: 'action', action: 'create', data });
		props.closeNew();
	};

  const isDisabled = () => {
		const boolean = !assets.some(el => el && el.type === 'agent');
		if (description.intent < 10 || description.length < 10 || boolean || !destination ) return true;
		else return false;
	};
  

  const getDistance = (coords) => {
    if (coords) {
        var deltaX = coords.x - hq.coords.x;
        var deltaY = coords.y - hq.coords.y;
        return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);       
    }
    else return -1

	}

  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(undefined);
    }
    setAssets(arr);
  }

  const transportation = teamAccount.resources.find(el => el.type === "transport")?.balance	
  let inRange =  locations.filter(el => getDistance(el.coords) <= transportation);
  // console.log(transportation, inRange)

	return (
		<div>
      <h4>New {actionType.type} Action</h4>
      <br/>
			<form>
      <Flex width={"100%"} align={"end"} >
      <Spacer />
      <Box width={"49%"}>
				Name:
				{10 - name.length > 0 && (
					<Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
						{10 - name.length} more characters...
					</Tag>
				)}
				{10 - name.length <= 0 && (
					<Tag variant='solid' colorScheme={'green'}>
						<CheckIcon />
					</Tag>
				)}
				<textarea rows='1' value={name} className='textStyle' onChange={(event) => setName(event.target.value)}></textarea>
      </Box>
      <Spacer />
      <Box width={"49%"}>
        Destination {destination && <b>distance: {getDistance(locations.find(loc => loc._id == destination)?.coords )} </b>}
        {!destination && (
          <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
            Select Destination
          </Tag>
        )}

        {destination && teamAccount.resources.find(el => el.type === "transport")?.balance < getDistance(locations.find(loc => loc._id == destination)?.coords ) && 
          <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
          Missing {getDistance(locations.find(loc => loc._id == destination)?.coords ) - teamAccount.resources.find(el => el.type === "transport")?.balance} Transportation
        </Tag>}

        {destination && (
          <Tag variant='solid' colorScheme={'green'}>
            <CheckIcon />            
          </Tag>
        )}
        <Flex>
          <SelectPicker data={inRange} label="name" onChange={setDestination} placeholder={"Select a Destination (" + inRange.length + ") in range"} value={destination} /> 
          {destination && <SelectPicker onChange={setFacility} data={facilities.filter(el => el.location._id === destination )} label="name" placeholder={"Select a Facility (" + facilities.filter(el => el.location._id === destination ).length + ") present"} /> }
        </Flex>
        
      </Box>
      <Spacer />
      </Flex>
      <br/>
			<Divider />
      <Flex width={"100%"} >
        <Spacer />
          <Box width={"49%"} >
            Description:
            {10 - description.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {10 - description.length} more characters...
              </Tag>
            )}
            {10 - description.length <= 0 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='6' value={description} className='textStyle' onChange={(event) => setDescription(event.target.value)} />
          </Box>
          <Spacer />
          <Box width={"49%"}>
            Intent:
            {10 - intent.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {10 - intent.length} more characters...
              </Tag>
            )}
            {10 - intent.length <= 0 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='6' value={intent} className='textStyle' onChange={(event) => setIntent(event.target.value)} />
          </Box>
          <Spacer />
      </Flex>        
      <br/>
      
      <DiceList assets={assets} type={"all"} />


      <br/>


        Assets:
        <br/>
				  {actionType.assetTypes?.map((type) => (
				  	<Tag margin={'3px'} key={type} textTransform='capitalize'  backgroundColor={getFadedColor(type)} color={getTextColor(type)} variant={'solid'}>
				  		{type}
				  	</Tag>
				  ))}


          {/* {!assets.some(el => el && el.type === 'agent') && (
            <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
              Missing Covert Agent
            </Tag>
          )} */}
          {/* {assets.some(el => el && el.type === 'agent') && (
            <Tag variant='solid' colorScheme={'green'}>
              <CheckIcon />
            </Tag>
          )} */}
				<Flex>
          {assets.map((ass, index) => (
          <>
          <Spacer />
					<Box
            style={{
              paddingTop: '5px',
              paddingLeft: '10px',
              textAlign: 'left'
            }}
          >
            {!ass && 
              <AddAsset 
                key={index} 
                handleSelect={(ass) =>editState(ass, ass.model, index)} 
                assets={teamAssets.filter(el => actionType.assetTypes.some(a => a === el.type) && !assets.some(ass => ass?._id === el._id ) )}/>}
            {ass && <AssetCard showRemove removeAsset={()=> editState(false, ass.model, index)} compact type={'blueprint'} asset={ass} /> }   
          </Box>
          <Spacer />
          </>
          ))}
					<Spacer />
				</Flex>
			</form>
			<div
				style={{
					justifyContent: 'end',
					display: 'flex',
					marginTop: '15px',
          textAlign: 'center'
				}}
			>
        <Spacer />
        Total Cost:
        {getDistance(locations.find(loc => loc._id == destination)?.coords) > 0 && <ResourceNugget type="transport" value={getDistance(locations.find(loc => loc._id == destination)?.coords)} />}
        {assets.filter(el => el).length > 0 && <ResourceNugget type="credit" value={assets.filter(el => el).length * 5} />}
        <Spacer />
				<Button colorScheme="green" onClick={() => handleSubmit()} variant='solid' disabled={isDisabled()} >
					<b>Submit</b>
				</Button>
				<Button colorScheme="red" onClick={() => props.closeNew()} variant='outline'>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default NewAction;
