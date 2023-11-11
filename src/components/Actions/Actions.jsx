import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { filteredActions, getMyActions, setFilter } from '../../redux/entities/playerActions';
import ActionDrawer from "./ActionList/ActionDrawer";
import Action from "./ActionList/Action/Action";
import { Accordion, Box, Button, Flex, Grid, GridItem, Hide, IconButton, Input, InputGroup, InputLeftElement, Spinner, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import usePermissions from "../../hooks/usePermissions";
import { AddIcon, ChevronLeftIcon, CloseIcon, PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
import AssetInfo from "./AssetInfo";
import { useNavigate } from 'react-router';
import { getFadedColor } from '../../scripts/frontend';
import ActionForm from './Forms/ActionForm';
import socket from '../../socket';
import ActionList from './ActionList/ActionList';

const Actions = (props) => {
	  const navigate = useNavigate();    
    const toast = useToast();
    const [showNewActionModal, setShowNewActionModal] = useState(false);
    const [assetInfo, setAssetInfo] = useState({show: false, asset: ''});
    const [editAction, setEditAction] = useState({show: false, action: null})
    const {isControl} = usePermissions();
    const [rounds, setRounds] = useState([]);
    const [renderRounds, setRenderRounds] = useState([]);
    const [number, setNumber] = useState(4);
    const [selected, setSelected] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [filter, setFilter] = useState('');

    const [windowSize, setWindowSize] = useState([
      window.innerWidth,
      window.innerHeight,
    ]);
  
    useEffect(() => {
      const handleWindowResize = () => {
        setWindowSize([window.innerWidth, window.innerHeight]);
      };
  
      window.addEventListener('resize', handleWindowResize);
  
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }, []);

    useEffect(() => {
        try {
            createListCategories(isControl ? props.filteredActions : props.myActions);
        } catch (err) {
            console.log(err);
        }
    }, [isControl, props.myActions, props.filteredActions])

    const handleEditSubmit = async (incoming) => {
      const { effort, assets, description, intent, name, actionType, myCharacter, collaborators } = incoming;
      try {
        const data = {
          submission: {
            effort: effort,
            assets: assets.filter(el => el),
            description: description,
            intent: intent,
          },
          name: name,
          type: actionType.type,
          id: incoming.actionID,
          numberOfInjuries: myCharacter.injuries.length,
        };
        // 1) make a new action 
		    socket.emit('request', { route: 'action', action: 'update', data });
        setEditAction({action: null, show: false})
      }
      catch (err) {
        // toast({
        //   position: "top-right",
        //   isClosable: true,
        //   status: 'error',
        //   duration: 5000,
        //   id: err,
        //   title: err,
        // });
      }
    };
  

    if (!props.login) {
      navigate('/');
      return (
          <Spinner
          />
      );
    }

    const createListCategories = (actions) => {
        const rounds = [];
        for (const action of actions) {
            if (!rounds.some((item) => item === action.round)) {
                rounds.push(action.round);
            }
        }
        rounds.reverse();
        setRounds(rounds);
        if (renderRounds.length === 0) setRenderRounds(rounds.slice(0, 1))
        if (selected) setSelected(actions.find(el => el._id === selected._id))
    };

    const handleRoundToggle = (round) => {
      if (renderRounds.some(r => r === round)) setRenderRounds(renderRounds.filter((r => r !== round)))
      else setRenderRounds([ ...renderRounds, round ])
    }

    const sortedActions = (currRound, actions) => {
      return actions
          .filter((action) => action.round === currRound)
          .sort((a, b) => {
              // sort alphabetically
              if (a?.creator?.characterName < b?.creator?.characterName) {
                  return -1;
              }
              if (a?.creator?.characterName > b?.creator?.characterName) {
                  return 1;
              }
              return 0;
          })            
    }

    const handleSubmit = async (incoming) => {
      const { effort, assets, description, intent, name, actionType, myCharacter, collaborators } = incoming;
      try {
        const data = {
          submission: {
            effort: effort,
            assets: assets.filter(el => el),
            description: description,
            intent: intent,
          },
          name: name,
          type: actionType.type,
    
          creator: myCharacter._id,
          numberOfInjuries: myCharacter.injuries.length,
          collaborators
        };
        // 1) make a new action 
        socket.emit('request', { route: 'action', action: 'create', data });
      }
      catch (err) {
        toast({
          position: "top-right",
          isClosable: true,
          status: 'error',
          duration: 5000,
          id: err,
          title: err,
        });
      }
    };

    const actionList = isControl ? props.filteredActions : props.myActions;
    const smallScreen = window.innerWidth < 1000;
    return (
			<Grid
          templateAreas={`"nav main"`}
          gridTemplateColumns={window.innerWidth < 1000 ? '0% 100%' : '25% 75%'}
          gap='1'
          fontWeight='bold'>
        <GridItem pl='2' bg='#1b2330' area={'nav'} style={{ height: 'calc(100vh - 78px)', overflow: 'auto', }} >
          <Flex align={'center'}>
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                >
                    <SearchIcon/>
                </InputLeftElement>
                <Input
                    onChange={(e) => props.setFilter(e.target.value)}
                    value={props.filter}
                    placeholder="Search"
                    color='white'
                />
            </InputGroup>
            <Tooltip
                label='Add New Action'
                aria-label='a tooltip'>
                <IconButton
                    icon={<AddIcon/>}
                    onClick={setShowNewActionModal}
                    colorScheme={'green'}
                    variant={'solid'}
                    style={{
                        marginLeft: '1rem'
                    }}
                    aria-label='Add New Action'
                />
            </Tooltip>
          </Flex>
          <ActionList selected={selected} actions={actionList} handleSelect={setSelected} />
				</GridItem>

        <GridItem overflow='auto' pl='1' bg='#1b2330' area={'main'} style={{ height: 'calc(100vh - 78px)', overflow: 'auto', width: '99%' }}>
          {smallScreen && <Flex
              align={'center'}
              marginTop='2rem'
              width={'100%'}
          >
              {window.innerWidth < 1000 && <Box
                  marginRight='1rem'
              >
                  <Button
                      onClick={() => onOpen()}
                      leftIcon={<ChevronLeftIcon/>}
                      colorScheme='orange'
                      variant='solid'
                  >
                    <Hide below='md'>Open Drawer</Hide>                            
                  </Button>
              </Box>}
              <InputGroup>
                  <InputLeftElement
                      pointerEvents='none'
                  >
                      <SearchIcon/>
                  </InputLeftElement>
                  <Input
                      onChange={(e) => props.setFilter(e.target.value)}
                      value={props.filter}
                      placeholder="Search"
                      color='white'
                  />
              </InputGroup>
              <Box
                  marginLeft='1rem'
              >
                  {!showNewActionModal && <Button
                      onClick={() => setShowNewActionModal(true)}
                      leftIcon={<PlusSquareIcon/>}
                      colorScheme='green'
                      variant='solid'
                  >
                    <Hide below='md'>Create New Action</Hide>                           
                  </Button>}
                  {showNewActionModal && <Button
                      onClick={() => setShowNewActionModal(false)}
                      leftIcon={<CloseIcon/>}
                      colorScheme='orange'
                      variant='solid'
                  >
                    <Hide below='md'>Cancel New Action</Hide>                           
                  </Button>}
              </Box>
          </Flex>}

                <ActionDrawer
                    // onChange={(e) => props.setFilter(e.target.value)}
                    onClick={() => setShowNewActionModal(true)}
                    actions={actionList}
                    handleSelect={(action) => { setSelected(action); onClose() }}
                    isOpen={isOpen}
                    onClose={onClose}
                />

                <Box
                    allowMultiple                    
                    width={'100%'}
                >
                    {!selected && !showNewActionModal && rounds.map((round, index) => (
                        <Box
                            key={index}
                        >
                            <Box
                                marginTop='2rem'
                            />
                            <h4 onClick={() => handleRoundToggle(round)} style={{ backgroundColor: getFadedColor('gold'), color: 'black', cursor: 'pointer' }} >Round {round}</h4>
                            <Box
                                marginBottom='1rem'
                            />
                            {renderRounds.some(r => r === round) && <div>
                              {sortedActions(round, actionList).slice(0, number).map((action =>
                                <Action
                                  action={action}
                                  key={action._id}
                                  toggleAssetInfo={(asset) => {
                                      setAssetInfo({show: true, asset});
                                  }}
                                  toggleEdit={(action) => {
                                      editAction.show ? setEditAction({action: null, show: false}) :
                                      setEditAction({show: true, action})
                                  }}
                                  handleEditSubmit={handleEditSubmit}
                                  editAction={editAction}
                                />
                              ))}
                              {sortedActions(round, actionList).length > number && <Button onClick={() => setNumber(number + 5)} >More ({sortedActions(round, actionList).length - number})</Button>}                                 
                            </div>}
                     
                        </Box>
                    ))}

                    {selected && !showNewActionModal && <Action
                      action={selected}
                      key={selected._id}
                      editAction={editAction}
                      handleEditSubmit={handleEditSubmit}
                      toggleAssetInfo={(asset) => {
                          setAssetInfo({show: true, asset});
                      }}
                      toggleEdit={(action) => {
                        editAction.show ? setEditAction({action: null, show: false}) :
                        setEditAction({show: true, action})
                    }}
                    />}

                      {showNewActionModal && <ActionForm handleSubmit={(data) =>handleSubmit(data)} closeNew={() => setShowNewActionModal(false)} />}
                </Box>

                <AssetInfo
                    asset={assetInfo.asset}
                    showInfo={assetInfo.show}
                    closeInfo={() => setAssetInfo({asset: '', show: false})}
                />

                {/* <EditAction
                    action={editAction.action}
                    showEdit={editAction.show}
                    handleClose={() => setEditAction({action: null, show: false})}
                /> */}
        </GridItem> 
       
      </Grid>
    );
};

const mapStateToProps = (state) => ({
    actions: state.actions.list,
    user: state.auth.user,
    filter: state.actions.filter,
    login: state.auth.login,
    gamestate: state.gamestate,
    myActions: getMyActions(state),
    filteredActions: filteredActions(state)
});

const mapDispatchToProps = (dispatch) => ({
    setFilter: (data) => dispatch(setFilter(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
