import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filteredActions, getMyActions, setFilter, getMyCovertActions } from '../../redux/entities/playerActions';
import NewAction from './Modals/NewAction';
import Action from "./ActionList/Action/Action";
import { Grid, GridItem, Flex, Input, InputGroup, InputLeftElement, Tooltip, IconButton, Accordion, Box, Center, ButtonGroup, Button } from "@chakra-ui/react";
import usePermissions from "../../hooks/usePermissions";
import { AddIcon, PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router';
import ActionList from './ActionList/ActionList';
import { getFadedColor, getIcon } from '../../scripts/frontend';

const Actions = (props) => {
	const actions = useSelector(s => s.actions.list);
	const myActions = useSelector(getMyActions);
	const myCovertActions = useSelector(getMyCovertActions);
	const fActions = useSelector(filteredActions);
	const filter = useSelector(s => s.actions.filter);
	const login = useSelector(s => s.auth.login);
	const gamestate = useSelector(s => s.gamestate);
	const gameConfig = useSelector(s => s.gameConfig);


	const navigate = useNavigate();
  const [showNewActionModal, setShowNewActionModal] = useState(false);
  const [assetInfo, setAssetInfo] = useState({show: false, asset: ''});
  const [editAction, setEditAction] = useState({show: false, action: null})
  const {isControl} = usePermissions();
  const [rounds, setRounds] = useState([]);
  const [renderRounds, setRenderRounds] = useState([]);
  const [selected, setSelected] = useState(false);

  const [actionType, setActionType] = React.useState(
    props.actionType ? gameConfig.actionTypes.find(el => el.type === props.actionType) :
    gameConfig.actionTypes[0]);

    if (!props.login) {
      navigate("/");
      return <div />;
    }
  

    useEffect(() => {
        try {
           if (selected) {
            setSelected(myActions.find(el => el._id === selected._id));
           } 
        } catch (err) {
            console.log(err);
        }
    }, [myActions])

    const createListCategories = (actions) => {
        const rounds = [];
        for (const action of actions) {
            if (!rounds.some((item) => item === action.round)) {
                rounds.push(action.round);
            }
        }
        rounds.reverse();
        setRounds(rounds);
        setRenderRounds(rounds.slice(0, 1))
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
                if (a.creator.characterName < b.creator.characterName) {
                    return -1;
                }
                if (a.creator.characterName > b.creator.characterName) {
                    return 1;
                }
                return 0;
            })            
    }

    const actionList = isControl ? fActions : myActions;
    return (
			<Grid
          templateAreas={`"nav main"`}
          gridTemplateColumns={ '20% 80%'}
          gap='1'
          bg='#d4af37'
          fontWeight='bold'>

        <GridItem pl='2' bg='#212936' area={'nav'} style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}>
          <Flex align={'center'}>
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                >
                    <SearchIcon/>
                </InputLeftElement>
                <Input
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
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
                    style={{
                        marginLeft: '1rem'
                    }}
                    aria-label='Add New Action'
                />
            </Tooltip>
          </Flex>
          <ActionList actions={actionList} handleSelect={setSelected} />
				</GridItem>

        <GridItem overflow='auto' pl='2' bg='#0f131a' area={'main'} style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }} >
          {showNewActionModal && 
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
              <Action
                action={selected}
                actionType={gameConfig.actionTypes[0]}
                key={selected._id}
                toggleAssetInfo={(asset) => {
                    setAssetInfo({show: true, asset});
                }}
              />           
          }
        </GridItem>

      </Grid>
    );
};

export default (Actions);
