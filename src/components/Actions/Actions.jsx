import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filteredActions, getMyActions, getMyCovertActions } from '../../redux/entities/playerActions';
import NewAction from './Modals/NewAction';
import Action from "./ActionList/Action/Action";
import { Grid, GridItem, Flex, Input, InputGroup, InputLeftElement, Tooltip, IconButton, Accordion, Box, Center, ButtonGroup, Button, Hide, useDisclosure } from "@chakra-ui/react";
import usePermissions from "../../hooks/usePermissions";
import { AddIcon, ChevronLeftIcon, CloseIcon, PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router';
import ActionList from './ActionList/ActionList';
import { getFadedColor, getIcon } from '../../scripts/frontend';
import ActionDrawer from './ActionList/ActionDrawer';

const Actions = (props) => {
  const compactActions = useSelector(s => s.actions.compactList);
  const myActions = useSelector(getMyActions);
  const fActions = useSelector(filteredActions);
  const [filter, setFilter] = useState('');
  const login = useSelector(s => s.auth.login);
  const gameConfig = useSelector(s => s.gameConfig);
  const gamestate = useSelector(s => s.gamestate);


  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showNewActionModal, setShowNewActionModal] = useState(false);
  const [assetInfo, setAssetInfo] = useState({ show: false, asset: '' });
  const { isControl } = usePermissions();
  const [selected, setSelected] = useState(false);
  const [rounds, setRounds] = useState([1, 2]);
  const [renderRounds, setRenderRounds] = useState([]);
  const [number, setNumber] = useState(4); // number of actions to display on mobile layout 

  const [actionType, setActionType] = React.useState(
    gameConfig.actionTypes.find(el => el.type === props.actionType) ||
    gameConfig.actionTypes[0]);

  if (!props.login) {
    navigate("/");
    return <div />;
  }

  let actionList = isControl ? fActions : myActions;

  useEffect(() => {
    try {
      createListCategories(actionList);
    } catch (err) {
      console.log(err);
    }
  }, [isControl, actionList])

  useEffect(() => {
    try {
      if (selected) {
        const found = actionList.find(el => el._id === selected._id)
        if (found) setSelected(found);
      }
    } catch (err) {
      console.log(err);
    }
  }, [actionList])

  useEffect(() => {
    if (showNewActionModal && selected) setShowNewActionModal(false)
  }, [selected])

  const createListCategories = (actions) => {
    console.log('hi boss')
    const listRounds = [];
    for (const action of actions) {
      if (!listRounds.some((item) => item === action.round)) {
        listRounds.push(action.round);
      }
    }
    listRounds.reverse();
    setRounds(listRounds);
    setRenderRounds([gamestate.round]);
    // if (renderRounds.length === 0) setRenderRounds(listRounds.slice(0, 1))
    // if (selected) setSelected(actions.find(el => el._id === selected._id))
    
    console.log(listRounds)
  };

  const handleRoundToggle = (round) => {
    if (renderRounds.some(r => r === round)) setRenderRounds(renderRounds.filter((r => r !== round)))
    else setRenderRounds([...renderRounds, round])
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

  actionList = actionList.filter(action =>
    // action.submission.description.toLowerCase().includes(filter.toLowerCase()) ||
    action.creator?.characterName.toLowerCase().includes(filter.toLowerCase()) ||
    action.name.toLowerCase().includes(filter.toLowerCase()) ||
    action.tags.some(el => el.toLowerCase().includes(filter.toLowerCase())))

  //const actionList = isControl ? props.filteredActions : props.myActions;
  const smallScreen = window.innerWidth < 1000;
  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={window.innerWidth < 1000 ? '0% 100%' : '25% 75%'}
      gap='1'
      fontWeight='bold'>
      <GridItem pl='2' bg='#1b2330' area={'nav'} style={{ height: 'calc(100vh - 78px)', overflow: 'auto',scrollbarWidth: 'none' }} >

        <Flex align={'center'}>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
            >
              <SearchIcon />
            </InputLeftElement>
            <Input
              onChange={(e) => setFilter(e.target.value)}
              value={props.filter}
              placeholder="Search"
              color='white'
            />
          </InputGroup>
          <Tooltip
            label='Add New Action'
            aria-label='a tooltip'>
            <IconButton
              icon={<AddIcon />}
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

        <ActionList
          selected={selected}
          actions={actionList}
          handleSelect={setSelected}
          renderRounds={renderRounds}
          rounds={rounds}
          handleRoundToggle={handleRoundToggle}
        />
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
              leftIcon={<ChevronLeftIcon />}
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
              <SearchIcon />
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
              leftIcon={<PlusSquareIcon />}
              colorScheme='green'
              variant='solid'
            >
              {/* <Hide below='md'>Create New Action</Hide> */}
            </Button>}
            {showNewActionModal && <Button
              onClick={() => setShowNewActionModal(false)}
              leftIcon={<CloseIcon />}
              colorScheme='orange'
              variant='solid'
            >
              {/* <Hide below='md'>Cancel New Action</Hide> */}
            </Button>}
          </Box>
        </Flex>}

        {smallScreen && showNewActionModal &&
          <Box>
            <Center>
              <ButtonGroup isAttached>
                {props.actionType}
                {gameConfig &&
                  gameConfig.actionTypes.filter(el => el).map((aType) => (
                    <Tooltip key={aType?.type} openDelay={50} placement='top' label={<b>{true ? `Create New "${aType.type}" Action` : `'No ${aType?.type} Left'`}</b>}>
                      <Button
                        style={{ backgroundColor: actionType?.type === aType?.type ? getFadedColor(`${aType?.type}`) : '#273040' }}
                        onClick={() => {
                          setActionType(aType);
                        }}
                        variant={'outline'}
                        leftIcon={getIcon(aType?.type)}
                      >
                        {aType?.type}
                      </Button>
                    </Tooltip>
                  ))}
              </ButtonGroup>
            </Center>
            <NewAction closeNew={() => setShowNewActionModal(false)} actionType={actionType} />
          </Box>
        }
        {selected && !showNewActionModal &&
          <Center  >
            <Action
              action={selected}
              actionType={gameConfig.actionTypes.find(el => el.type === selected.type)}
              key={selected._id}
              toggleAssetInfo={(asset) => {
                setAssetInfo({ show: true, asset });
              }}
            />
          </Center>

        }
        {smallScreen && isOpen && <ActionDrawer
          // onChange={(e) => props.setFilter(e.target.value)}
          onClick={() => setShowNewActionModal(true)}
          actions={actionList}
          handleSelect={(action) => { setSelected(action); onClose() }}
          isOpen={isOpen}
          onClose={onClose}
          renderRounds={renderRounds}
          rounds={rounds}
          handleRoundToggle={handleRoundToggle}
        />}

        <Box

          width={'100%'}
        >
          {smallScreen && !selected && !showNewActionModal && rounds.map((round, index) => (
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
                    actionType={gameConfig.actionTypes.find(el => el.type === action.type)}
                    key={action._id}
                  />
                ))}
                {sortedActions(round, actionList).length > number && <Button onClick={() => setNumber(number + 5)} >More ({sortedActions(round, actionList).length - number})</Button>}
              </div>}

            </Box>
          ))}
        </Box>
      </GridItem>

    </Grid>
  );
  // return (
  //   <Grid
  //     templateAreas={`"nav main"`}
  //     gridTemplateColumns={window.innerWidth < 1000 ? '0% 100%' : '20% 80%'}
  //     gap='1'
  //     bg='#d4af37'
  //     fontWeight='bold'>

  //     <GridItem pl='2' bg='#212936' area={'nav'} style={{ height: 'calc(100vh - 99px)', overflow: 'auto', }}>
  //       <Flex align={'center'}>
  //         <InputGroup>
  //           <InputLeftElement
  //             pointerEvents='none'
  //           >
  //             <SearchIcon />
  //           </InputLeftElement>
  //           <Input
  //             onChange={(e) => setFilter(e.target.value)}
  //             value={filter}
  //             placeholder="Search"
  //             color='white'
  //           />
  //         </InputGroup>
  //         <Tooltip
  //           label='Add New Action'
  //           aria-label='a tooltip'>
  //           <IconButton
  //             icon={<AddIcon />}
  //             onClick={() => {setShowNewActionModal(true); setSelected(false) }}
  //             colorScheme={'green'}
  //             style={{
  //               marginLeft: '1rem'
  //             }}
  //             aria-label='Add New Action'
  //             variant={'solid'}
  //           />
  //         </Tooltip>
  //       </Flex>
  //       <ActionList actions={actionList} handleSelect={setSelected} selected={selected} />
  //     </GridItem>

  //     <GridItem overflow='auto' pl='2' bg='#0f131a' area={'main'} style={{ height: 'calc(100vh - 95px)', overflow: 'auto', }} >
  //       {showNewActionModal &&
  //         <Box>
  //           <Center>
  //             <ButtonGroup isAttached>
  //               {props.actionType}
  //               {gameConfig &&
  //                 gameConfig.actionTypes.filter(el => el).map((aType) => (
  //                   <Tooltip key={aType?.type} openDelay={50} placement='top' label={<b>{true ? `Create New "${aType.type}" Action` : `'No ${aType?.type} Left'`}</b>}>
  //                     <Button
  //                       style={{ backgroundColor: actionType?.type === aType?.type ? getFadedColor(`${aType?.type}`) : '#273040' }}
  //                       onClick={() => {
  //                         setActionType(aType);
  //                       }}
  //                       variant={'outline'}
  //                       leftIcon={getIcon(aType?.type)}
  //                     >
  //                       {aType?.type}
  //                     </Button>
  //                   </Tooltip>
  //                 ))}
  //             </ButtonGroup>
  //           </Center>
  //           <NewAction closeNew={() => setShowNewActionModal(false)} actionType={actionType} />
  //         </Box>
  //       }
  //       {selected && !showNewActionModal &&
  //       <Center  >
  //         <Action
  //           action={selected}
  //           actionType={gameConfig.actionTypes.find(el => el.type === selected.type)}
  //           key={selected._id}
  //           toggleAssetInfo={(asset) => {
  //             setAssetInfo({ show: true, asset });
  //           }}
  //         />          
  //       </Center>

  //       }
  //     </GridItem>

  //   </Grid>
  // );
};

export default (Actions);
