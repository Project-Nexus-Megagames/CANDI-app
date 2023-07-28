import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getThisEffort } from '../../../scripts/frontend';
import { getMyAssets } from '../../../redux/entities/assets';
import { getMyCharacter } from '../../../redux/entities/characters';
import socket from '../../../socket';
import { Modal,	ModalOverlay,	ModalContent,	ModalHeader,	ModalFooter,	ModalBody,	ModalCloseButton,	Tag,	Icon,	Spinner,	Box,	Flex,	Button,	ButtonGroup,	Tooltip,	Divider,	Spacer,  Center} from '@chakra-ui/react';
import { CheckIcon, PlusSquareIcon } from '@chakra-ui/icons';
import NexusSlider from '../../Common/NexusSlider';
import AssetCard from '../../Common/AssetCard';
import { AddAsset } from '../../Common/AddAsset';

/**
 * Form for a new ACTION
 * @param {*} props
 * @returns Component
 */
const ActionForm = (props) => {
	const { gameConfig } = useSelector((state) => state);
	const { myCharacter } = useSelector((s) => s.auth);
	// const myCharacter = useSelector(getMyCharacter);
	const myAssets = useSelector(getMyAssets);

	const [effort, setEffort] = React.useState({ effortType: 'Normal', amount: 0 });
	const [resource, setResource] = React.useState([]);
	const [actionType, setActionType] = React.useState(false);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');
	const [max, setMax] = React.useState(0);

	const setMaxEffort = () => {
		let charEffort = getThisEffort(myCharacter.effort, actionType.type);
		setMax(charEffort < actionType.maxEffort ? charEffort : actionType.maxEffort);
	};
  
  useEffect(() => {
    newMap(actionType.maxAssets);
	}, [])

	useEffect(() => {
		if (actionType && actionType.type) {
			setEffort({ effortType: actionType.type, amount: 0 });
			setMaxEffort();
      newMap(actionType.maxAssets);
		}
	}, [actionType?.type]);

  useEffect(() => {
    newMap(actionType.maxAssets);
	}, [actionType])

	useEffect(() => {
		if (effort) setMaxEffort();
	}, [effort]);

	const editState = (incoming, type, index) => {
		let thing;
		switch (type) {
			case 'effort':
				thing = { ...effort };
				if (typeof incoming === 'number') {
					thing.amount = parseInt(incoming);
				} else {
					thing.effortType = incoming;
					thing.amount = 0;
					setMax(getThisEffort(myCharacter.effort, incoming));
				}
				setEffort(thing);
				break;
      case 'Asset':
        let temp = [ ...resource ];
        temp[index] = incoming;
        setResource(temp);
        break;
			default:
				console.log('UwU Scott made an oopsie doodle!');
		}
	};

	const handleSubmit = async () => {
		// 1) make a new action
		const data = {
			submission: {
				effort: effort,
				assets: resource,
				description: description,
				intent: intent
			},
			name: name,
			type: actionType.type,
			creator: myCharacter._id,
			numberOfInjuries: myCharacter.injuries.length
		};
		setActionType(false);
		setDescription('');
		setIntent('');
		setName('');
		setResource([]);

		socket.emit('request', { route: 'action', action: 'create', data });
		props.closeNew();
	};

	function isDisabled(effort) {
		if (description.length < 10 || intent.length < 10 || name.length < 10) return true;
		if (effort.amount === 0 || effort <= 0) return true;
		else return false;
	}

  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(undefined);
    }
    setResource(arr);
  }

	function getIcon(type) {
		switch (type) {
			case 'Normal':
				return <PlusSquareIcon />;
			case 'Agenda':
				return <PlusSquareIcon />;
			default:
				return <PlusSquareIcon />;
		}
	}

	return (
		<Box style={{
      border: `4px solid ${getFadedColor(actionType?.type)}`,
      borderRadius: '5px',
      padding: '15px',
      marginTop: '1rem',
  }}>
      <Center>
            <ButtonGroup isAttached>
              {gameConfig &&
                gameConfig.actionTypes.map((aType) => (
                  <Tooltip key={aType.type} openDelay={50} placement='top' label={<b>{true ? `Create New "${aType.type}" Action` : `'No ${aType.type} Left'`}</b>}>
                    <Button
                      style={{ backgroundColor: actionType.type === aType.type ? getFadedColor(`${aType.type}`) : '#273040' }}
                      onClick={() => {
                        setActionType(aType);
                        setResource([]);
                      }}
                      variant={'outline'}
                      leftIcon={getIcon(aType.type)}
                    >
                      {aType.type}
                    </Button>
                  </Tooltip>
                ))}
            </ButtonGroup>
      </Center>

			{actionType.type && (
						<div>
							<form>
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
								<Divider />
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
								<Divider />
								<Box>
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
									<Divider />
								</Box>
								<Flex>
									<Spacer />
									<Box
										style={{
											paddingTop: '25px',
											paddingLeft: '10px',
											textAlign: 'left'
										}}
										align='middle'
									>
										<h5 style={{ textAlign: 'center' }}>
											Effort {effort.amount} / {max}
											{effort === 0 && (
												<Tag style={{ color: 'black' }} colorScheme={'orange'}>
													Need Effort
												</Tag>
											)}
										</h5>
										<ButtonGroup>
											{actionType &&
												actionType.effortTypes.map((e) => (
													<Button
														key={e}
														onClick={() => editState(e, 'effort')}
														color={getFadedColor(e)}
														disabled={getThisEffort(myCharacter.effort, e) < 1}
														variant={effort.effortType == e ? 'solid' : 'ghost'}
													>
														{e} ~ ({max})
													</Button>
												))}
										</ButtonGroup>
										<Spacer />

										<NexusSlider min={0} max={max} defaultValue={0} value={effort.amount} onChange={(event) => editState(parseInt(event), 'effort')}></NexusSlider>
									</Box>

									<Spacer />
                  
									<Box
										style={{
											paddingTop: '5px',
											paddingLeft: '10px',
											textAlign: 'left'
										}}
									>
										Resources:
										{actionType.resourceTypes?.map((type) => (
											<Tag key={type} textTransform='capitalize' colorScheme={'teal'} variant={'solid'}>
												{type}
											</Tag>
										))}

                    <Flex>
                      {resource.map((ass, index) => (
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
                            assets={myAssets.filter(el => actionType.resourceTypes.some(a => a === el.type) && !resource.some(ass => ass?._id === el._id ) )}/>}
                        {ass && <AssetCard disabled removeAsset={()=> editState(false, ass.model, index)} compact type={'blueprint'} asset={ass} /> }   
                      </Box>
                      <Spacer />
                      </>
                      ))}
                      <Spacer />
                    </Flex>                    
									</Box>


									<Spacer />
								</Flex>

							</form>
							<div
								style={{
									justifyContent: 'end',
									display: 'flex',
									marginTop: '15px'
								}}
							>
								<Button onClick={() => handleSubmit()} disabled={isDisabled(effort)} colorScheme={isDisabled(effort) ? 'red' : 'green'} variant='solid'>
									<b>Submit</b>
								</Button>
								<Button onClick={() => props.closeNew()} variant='outline'>
									Cancel
								</Button>
							</div>
						</div>
			)}
		</Box>
	);
};

export default ActionForm;
