import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filteredActions, getMyActions, getMyCovertActions } from '../../redux/entities/playerActions';
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
  const [filter, setFilter] = useState('');
  const login = useSelector(s => s.auth.login);
  const gamestate = useSelector(s => s.gamestate);
  const gameConfig = useSelector(s => s.gameConfig);


  const navigate = useNavigate();
  const [showNewActionModal, setShowNewActionModal] = useState(false);
  const [assetInfo, setAssetInfo] = useState({ show: false, asset: '' });
  const [editAction, setEditAction] = useState({ show: false, action: null })
  const { isControl } = usePermissions();
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

  let actionList = isControl ? fActions : myActions;

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

  actionList = actionList.filter(action =>
    action.submission.description.toLowerCase().includes(filter.toLowerCase()) ||
    action.creator?.characterName.toLowerCase().includes(filter.toLowerCase()) ||
    action.name.toLowerCase().includes(filter.toLowerCase()) ||
    action.tags.some(el => el.toLowerCase().includes(filter.toLowerCase())))
  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={'20% 80%'}
      gap='1'
      bg='#d4af37'
      fontWeight='bold'>

      <GridItem pl='2' bg='#212936' area={'nav'} style={{ height: 'calc(100vh - 99px)', overflow: 'auto', }}>
        <Flex align={'center'}>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
            >
              <SearchIcon />
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
              icon={<AddIcon />}
              onClick={setShowNewActionModal}
              colorScheme={'green'}
              style={{
                marginLeft: '1rem'
              }}
              aria-label='Add New Action'
              variant={'solid'}
            />
          </Tooltip>
        </Flex>
        <ActionList actions={actionList} handleSelect={setSelected} selected={selected} />
      </GridItem>

      <GridItem overflow='auto' pl='2' bg='#0f131a' area={'main'} style={{ height: 'calc(100vh - 95px)', overflow: 'auto', }} >
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
        <Center>
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
      </GridItem>

    </Grid>
  );
};

export default (Actions);
