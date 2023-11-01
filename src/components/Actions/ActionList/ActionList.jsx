import React, { useEffect, useState } from 'react';
import { Box, Flex, StackDivider,    Tag,    VStack} from "@chakra-ui/react";
import ActionTag from "./ActionTag";
import CharacterNugget from '../../Common/CharacterNugget';

function ActionList({actions, handleSelect}) {
    const [rounds, setRounds] = useState([]);

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
    };

    const tagStyle = (item) => {
        switch (item.toLowerCase()) {
            case 'news':
                return (
                    <Tag
                        style={{color: 'black'}}
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

    const sortedActions = () => {
        return actions
            .sort((a, b) => {
                // sort the catagories alphabetically
                if (a.creator.characterName < b.creator.characterName) {
                    return -1;
                }
                if (a.creator.characterName > b.creator.characterName) {
                    return 1;
                }
                return 0;
            })
    }

    return (
      <VStack
        divider={<StackDivider/>}
        align='stretch'
        maxWidth={'20vw'}
    >
      {sortedActions().length <= 0 && <b>No Actions</b>}
        {sortedActions().map((action) => (
                <Flex
                    key={action._id}
                    onClick={() => handleSelect(action)}
                    style={{
                        marginTop: '0',
                        cursor: 'pointer',
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
