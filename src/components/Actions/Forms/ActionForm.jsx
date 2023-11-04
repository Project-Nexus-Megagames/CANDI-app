import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getIcon } from '../../../scripts/frontend';
import { getMyAssets } from '../../../redux/entities/assets';
import { Tag,	Box,	Flex,	Button,	ButtonGroup,	Tooltip,	Divider,	Spacer,  Center, TagLabel, TagCloseButton, Wrap, useBreakpointValue, SimpleGrid} from '@chakra-ui/react';
import { CheckIcon, PlusSquareIcon } from '@chakra-ui/icons';
import AssetCard from '../../Common/AssetCard';
import { AddAsset } from '../../Common/AddAsset';
import { AddCharacter } from '../../Common/AddCharacter';

/**
 * Form for a new ACTION
 * @param {*} props
 * @returns Component
 */
const ActionForm = (props) => {
  const { collabMode, handleSubmit, defaultValue, actionID } = props;

	const { gameConfig } = useSelector((state) => state);
	const { myCharacter } = useSelector((s) => s.auth);
	// const myCharacter = useSelector(getMyCharacter);
	const myAssets = useSelector(getMyAssets);
	const myContacts = useSelector(s => s.characters.list);

	const [effort, setEffort] = React.useState(defaultValue?.effort ? { effortType: defaultValue.effort.effortType, amount: defaultValue.effort.amount } : { effortType: 'Normal', amount: 0 });
	const [resource, setResource] = React.useState(defaultValue?.assets ? defaultValue.assets : []);
  const [collaborators, setCollaborators] = React.useState([]);
	const [actionType, setActionType] = React.useState(
    props.actionType ? gameConfig.actionTypes.find(el => el.type === props.actionType) :
    gameConfig.actionTypes[0]);
	const [description, setDescription] = React.useState(defaultValue?.description ? defaultValue.description : '');
	const [intent, setIntent] = React.useState(defaultValue?.intent ? defaultValue.intent : '');
	const [name, setName] = React.useState(defaultValue?.name ? defaultValue.name : '');
	const [max, setMax] = React.useState(0);

  const breakpoints = useBreakpointValue({
    base: {columns: 0, rows: 3, width: '15rem', bottom: '1.75rem', left: '7.5rem'},
    md: {columns: 3, rows: 0, width: '10rem', bottom: '1.75rem', left: '5rem'},
    lg: {columns: 3, rows: 0, width: '15rem', bottom: '1.75rem', left: '7.5rem'}
})

  
	useEffect(() => {
		if (actionType && actionType.type && !defaultValue) {
			setEffort({ effortType: actionType.effortTypes[0], amount: 0 });
      newMap(actionType.maxAssets);
		}
	}, [actionType?.type]);

  useEffect(() => {
    newMap(actionType?.maxAssets);
	}, [actionType])


  const editState = (incoming, type, index) => {
    // console.log(incoming, type, index)
		let thing;
		switch (type) {
      case 'Asset':
        let temp = [ ...resource ];
        temp[index] = incoming;
        setResource(temp);
        break;
      case 'collab':
        setCollaborators(collaborators.filter(c => c._id !== incoming._id));
        break;
			default:
				console.log(`uWu Scott made an oopsie doodle! ${type} `);
		}
	};

	const passSubmit = async () => {
		// 1) make a new action
		const data = {
			effort: effort,
			assets: resource.filter(el => el),
			description: description,
			intent: intent,
			name: name,
			actionType: actionType,
			myCharacter: myCharacter,
			creator: myCharacter,      
			numberOfInjuries: myCharacter.injuries.length,
      collaborators,
      actionID: actionID
		};
		setActionType(false);
		setDescription('');
		setIntent('');
		setName('');
		setResource([]);
		setCollaborators([]);

    handleSubmit(data)
		props.closeNew();
	};

	function isDisabled(effort) {
		if (description.length < 10 || intent.length < 10 || (name.length < 10 && !collabMode)) return true;
		if ((effort.amount === 0 || effort <= 0) && !collabMode) return true;
		else return false;
	}

  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(defaultValue?.assets[i]);
    }
    setResource(arr);
  }

	return (
		<Box style={{
      border: `4px solid ${getFadedColor(actionType?.type)}`,
      borderRadius: '5px',
      padding: '15px',
      marginTop: '1rem',
  }}>
      {!collabMode && <Center>
            <ButtonGroup isAttached>
              {props.actionType}
              {gameConfig &&
                gameConfig.actionTypes.filter(el => el).map((aType) => (
                  <Tooltip key={aType?.type} openDelay={50} placement='top' label={<b>{true ? `Create New "${aType.type}" Action` : `'No ${aType?.type} Left'`}</b>}>
                    <Button
                      style={{ backgroundColor: actionType?.type === aType?.type ? getFadedColor(`${aType?.type}`) : '#273040' }}
                      onClick={() => {
                        setActionType(aType);
                        setResource([]);
                      }}
                      variant={'outline'}
                      leftIcon={getIcon(aType?.type)}
                    >
                      {aType?.type}
                    </Button>
                  </Tooltip>
                ))}
            </ButtonGroup>
      </Center>}

			{actionType && actionType.type && (
						<div>
							<form>

              {!collabMode && <div>
                <Center>
                  <AddCharacter characters={myContacts.filter(el => !collaborators.some(ass => ass?._id === el._id ) )} handleSelect={(character) => setCollaborators([...collaborators, character]) } />
                </Center>
                {collaborators.map((char, index) => 
                    <Tag margin={'2px'} key={char._id} variant={'solid'} colorScheme='teal' >
                      <TagLabel>{char.characterName}</TagLabel>
                      <TagCloseButton onClick={(e) => {
                          editState(char, 'collab', index);
                      }}
                      />
                    </Tag>
                  )}
              </div>}


              {<Flex width={"100%"} align={"end"} >
                <Spacer />
                {<Box width={"49%"}>
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
                </Box>}

                <Spacer />

                <Box width={"49%"}>
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
														variant={effort.effortType == e ? 'solid' : 'ghost'}
													>
														{e} ~ ({max})
													</Button>
												))}
										</ButtonGroup>
										<Spacer />

                </Box>
                <Spacer />
              </Flex>}

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
                  
								<Box
										style={{
											paddingTop: '5px',
											textAlign: 'left',
										}}
									>
										Resources (Max: {actionType.maxAssets})
										{actionType.resourceTypes?.map((type) => (
											<Tag key={type} textTransform='capitalize' colorScheme={'teal'} variant={'solid'}>
												{type}
											</Tag>
										))}
sxxsax
                <SimpleGrid
                      columns={breakpoints.columns}
                      rows={breakpoints.rows}
                      textAlign={'center'}
                      justifyContent={'space-around'}
                      alignItems={'center'} >                      
                      {resource.map((ass, index) => (
                        <Box
                          key={index}
                          style={{
                            paddingTop: '5px',
                            paddingLeft: '10px',
                            textAlign: 'left',
                            maxWidth: '100%'
                          }}
                        >
                          {myAssets.length}!!!!!
                          {!ass && 
                            <AddAsset 
                              key={index} 
                              handleSelect={(ass) =>editState(ass, ass.model, index)} 
                              assets={
                                myAssets.filter(el => 
                                  actionType.resourceTypes.some(a => a === el.type) && 
                                  !resource.some(ass => ass?._id === el._id ) &&
                                  !el.status?.some(el => el === 'used')
                                )} 
                            />}
                          {ass && <AssetCard disabled removeAsset={(data)=> editState(false, data.model, index)} compact type={'blueprint'} asset={ass} /> }   
                        </Box>
                      ))}

                    </SimpleGrid>                    
								</Box>


							</form>
							<div
								style={{
									justifyContent: 'end',
									display: 'flex',
									marginTop: '15px'
								}}
							>
								<Button onClick={() => passSubmit()} disabled={isDisabled(effort)} colorScheme={isDisabled(effort) ? 'red' : 'green'} variant='solid'>
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
