import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getMyAssets, getTeamAssets } from '../../../redux/entities/assets';
import socket from '../../../socket';
import {	Tag, Box,	Flex,	Button,	Divider,	Spacer, ButtonGroup} from '@chakra-ui/react';
import { AddAsset } from '../../Common/AddAsset';
import { CheckIcon } from '@chakra-ui/icons';
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
const NewAgenda = (props) => {
  const { actionType } = props;
	const gameConfig = useSelector((state) => state.gameConfig);
  const locations = useSelector((state) => state.locations.list)
  const teams = useSelector((state) => state.teams.list)
  

	const { character } = useSelector((s) => s.auth);
	// const character = useSelector(getMyCharacter);
	const myAssets = useSelector(getMyAssets);
  const hq = useSelector(getTeamHQ);
	const teamAssets = useSelector(getTeamAssets);
	const teamAccount = useSelector(getTeamAccount);

	const [assets, setAssets] = React.useState([]);
	const [eligible, setEligible] = React.useState([]);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');
	const [choiceType, setChoiceType] = React.useState('binary');
	const [destination, setDestination] = React.useState(false);
	const [team, setTeam] = React.useState(undefined);
  
  

  useEffect(() => {
    newMap(actionType.maxAssets);
	}, [])

  useEffect(() => {
		if (teamAssets) {
      let theseAssets = [...teamAssets];
      let test = [];
      for (const tag of actionType.assetTypes) {
        test = [...theseAssets.filter((el) => el.tags.some((t) => t === tag))];
      }
      setEligible(test)
		}
	}, [teamAssets]);

  const getAssets = (tags) => {

  } 


	const editState = (incoming, type, index) => {
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
        team: team,
			},
			name: name,
			type: actionType.type,
			creator: character._id,
      account: teamAccount._id,
      options: [
        {
        name: "For",
        description: "Allocating Resources and Assets here means you wish for this legislation to pass", // Description of the result
        acceptedAssets: ["politician"],
        acceptedResources: [
         {
          type: "credit",
          amount: 100
          }
        ],
        },
        {
          name: "Against",
          description: "Allocating Resources and Assets here means you wish for this legislation to fail", // Description of the result
          acceptedAssets: ["politician"],
          acceptedResources: [
           {
            type: "credit",
            amount: 100
            }
          ],
          }
      ]
		};
		// setDescription('');
		// setIntent('');
		// setName('');
		// setAssets([]);

		socket.emit('request', { route: 'action', action: 'create', data });
		// props.closeNew();
	};

  const isDisabled = () => {
		const boolean = !assets.some(el => el && el.type === 'agent');
		if (description.intent < 10 || description.length < 10 || boolean || !destination ) return true;
		else return false;
	};
  

  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(undefined);
    }
    setAssets(arr);
  }
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
        Target
        <Flex>
          {true && <SelectPicker onChange={setTeam} data={teams} label="name" placeholder={"Select a Target (optional)"} /> }
        </Flex>
        
      </Box>
      <Spacer />
      </Flex>
      <br/>
			<Divider />
      <Flex width={"100%"} >
        {/* <Spacer /> */}
          <Box width={"99%"} >
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

          {/* <Spacer /> */}
      </Flex>        

        Assets:
				  {actionType.assetTypes?.map((type) => (
				  	<Tag key={type} textTransform='capitalize' colorScheme={'teal'} variant={'solid'}>
				  		{type}
				  	</Tag>
				  ))}
          {!assets.some(el => el) && (
            <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
              Missing Politican
            </Tag>
          )}
          {assets.some(el => el) && (
            <Tag variant='solid' colorScheme={'green'}>
              <CheckIcon />
            </Tag>
          )}
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
                assets={eligible}/>}
            {ass && <AssetCard showRemove removeAsset={()=> editState(false, ass.model, index)} compact type={'blueprint'} asset={ass} /> }   
          </Box>
          <Spacer />
          </>
          ))}
					<Spacer />

          <Box>
            Choice Type: {choiceType} <br/>
            <ButtonGroup>
              {['binary', 'multiple'].map(choice => (
                <Button onClick={() => setChoiceType(choice)} isDisabled={choiceType=== choice} >{choice}</Button>
              ))}
            </ButtonGroup>
          </Box>

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

export default NewAgenda;
