import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getMyCharacter } from '../../../redux/entities/characters';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Avatar,
    Box,
    Container,
    Flex,
    Heading,
    StackDivider,
    Tag,
    VStack
} from "@chakra-ui/react";
import ActionTag from "./ActionTag";

function ActionList(props) {
    const [rounds, setRounds] = useState([]);

    useEffect(() => {
        try {
            createListCategories();
        } catch (err) {
            console.log(err);
        }
    }, [props.actions])

    const createListCategories = () => {
        const rounds = [];
        for (const action of props.actions) {
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

    const sortedActions = (currRound) => {
        return props.actions
            .filter((action) => action.round === currRound)
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
        <Container>
            <Accordion
                allowMultiple
                defaultIndex={0}
            >
                {rounds.map((round, index) => (
                    <AccordionItem
                        key={index}
                        style={{
                            borderTop: 0,
                            borderBottom: 0,
                        }}
                    >
                        <h5>
                            <AccordionButton
                                style={{
                                    paddingLeft: 0
                                }}
                            >
                                <Box
                                    flex='1'
                                    textAlign='left'
                                >
                                    <Heading
                                        as='h5'
                                        textAlign='left'
                                    >
                                        Round {round}
                                    </Heading>
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                        </h5>
                        <AccordionPanel>
                            <VStack
                                divider={<StackDivider/>}
                                align='stretch'
                            >
                                {sortedActions(round).map((action, index) => (
                                        <Flex
                                            key={index}
                                            onClick={() => props.handleSelect(action)}
                                            style={{
                                                marginTop: '0',
                                            }}
                                        >
                                            <Box
                                                mr={'1rem'}
                                                alignItems={'center'}
                                                display={'flex'}
                                            >
                                                <Avatar
                                                    circle
                                                    src={action.creator.profilePicture}
                                                />
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
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Container>
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

const mapStateToProps = (state) => ({
    user: state.auth.user,
    gamestate: state.gamestate,
    myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
