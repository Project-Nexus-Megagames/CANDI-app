import React from 'react';
import { Box, Flex, StackDivider, Tag, VStack } from "@chakra-ui/react";
import ActionTag from "./ActionTag";
import CharacterNugget from '../../Common/CharacterNugget';
import { getFadedColor } from '../../../scripts/frontend';

function ActionList({ actions, handleSelect, selected, renderRounds, rounds, handleRoundToggle }) {
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


  return (
    <VStack
      divider={<StackDivider />}
      align='stretch'
      
    >
      {rounds && rounds.map(round => (
        <div key={round} >
          <h4 onClick={() => handleRoundToggle(round)} style={{ backgroundColor: getFadedColor('gold'), color: 'black', cursor: 'pointer' }} >Round {round}</h4>
          <p>{(actions.filter(el => el.round === round)).length} Actions</p>

          {renderRounds.some(r => r === round) && actions.filter(el => el.round === round).map((action) => (
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
