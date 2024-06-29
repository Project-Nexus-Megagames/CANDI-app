import React, { useEffect, useState } from 'react';
import { Box, Flex, StackDivider, Switch, Tag, VStack } from "@chakra-ui/react";
import ActionTag from "./ActionTag";
import CharacterNugget from '../../Common/CharacterNugget';
import { getFadedColor } from '../../../scripts/frontend';
import usePermissions from '../../../hooks/usePermissions';
import { useSelector } from 'react-redux';

function ActionList({ actions, handleSelect, selected, controlMode }) {
  const [rounds, setRounds] = useState([]);
  const [renderRounds, setRenderRounds] = useState([]);
  const myCharacter = useSelector(state => state.auth.myCharacter);
  const { isControl } = usePermissions();

  useEffect(() => {
    try {
      createListCategories();
    } catch (err) {
      console.log(err);
    }
  }, [actions])

  const createListCategories = () => {
    const rounds = [];
    for (const action of actions) {
      if (!rounds.some((item) => item === action.round)) {
        rounds.push(action.round);
      }
    }
    rounds.reverse();
    setRounds(rounds);
    setRenderRounds(rounds);
  };

  const tagStyle = (item) => {
    switch (item.toLowerCase()) {
      case 'news':
        return (
          <Tag
            style={{ color: 'black' }}
            color="orange"
            key={item}
          >
            {item}
          </Tag>
        );
      default:
        break;
    }
  };

  const sortedActions = (actions) => {
    if (controlMode) return actions.filter(el => el.control?._id == myCharacter._id)
    return actions
      .sort((a, b) => {
        // sort the catagories alphabetically
        if (a.creator?.characterName < b.creator?.characterName) {
          return -1;
        }
        if (a.creator?.characterName > b.creator?.characterName) {
          return 1;
        }
        return 0;
      })
  }

  const handleRoundToggle = (round) => {
    if (renderRounds.some(r => r === round)) setRenderRounds(renderRounds.filter((r => r !== round)))
    else setRenderRounds([...renderRounds, round])
  }

  return (
    <VStack
      divider={<StackDivider />}
      align='stretch'
      maxWidth={'20vw'}
    >
      {rounds.map(round => (
        <div key={round} >
          <h4 onClick={() => handleRoundToggle(round)} style={{ backgroundColor: getFadedColor('gold'), color: 'black', cursor: 'pointer' }} >Round {round}</h4>
          {sortedActions(actions.filter(el => el.round === round)).length <= 0 && <b>No Actions</b>}
          {renderRounds.some(r => r === round) && sortedActions(actions.filter(el => el.round === round)).map((action) => (
            <Flex
              key={action._id}
              onClick={() => handleSelect(action)}
              style={{
                marginTop: '0',
                cursor: 'pointer',
                backgroundColor: selected == action ? getFadedColor('default', 0.5) : 'inherit'
              }}
            >
              <Box
                mr={'1rem'}
                alignItems={'center'}
                display={'flex'}
              >
                <CharacterNugget character={action.creator} />
              </Box>
              <Box
                style={{
                  ...styleCenter,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  overflow: 'hidden'
                }}
              >
                <div style={titleStyle}>{action.name}</div>
                <Flex>
                  <ActionTag
                    color='black'
                    action={action}
                    text={action.type}
                  />
                  {action.results.length > 0 && action.results[0].ready &&
                    <ActionTag
                      color='green'
                      text='R Ready'
                    />
                  }
                  {action.effects.length > 0 &&
                    <ActionTag
                      color='violet'
                      text={`${action.effects.length} Effects`}
                    />
                  }
                  {action.tags.map((tag) => tagStyle(tag))}
                </Flex>
              </Box>
            </Flex>
          )
          )}
        </div>
      ))}
    </VStack>
  );
}

const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px'
};

const titleStyle = {
  paddingBottom: 5,
  paddingLeft: 5,
  whiteSpace: 'nowrap',
  fontWeight: 500,
  overflow: 'ellipsis'
};

export default ActionList;
