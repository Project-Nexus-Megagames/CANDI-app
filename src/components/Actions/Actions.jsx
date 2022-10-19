import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { filteredActions, getCurrentExplores, getMyActions, setFilter } from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';
import NewAction from './NewAction';
import ActionDrawer from "./ActionList/ActionDrawer";
import Action from "./ActionList/Action/Action";
import { Accordion, Box, Container } from "@chakra-ui/react";
import usePermissions from "../../hooks/usePermissions";
import WordDivider from "../WordDivider";

const Actions = (props) => {
    const [showNew, setShowNew] = useState(false);
    const {isControl} = usePermissions();
    const [rounds, setRounds] = useState([]);

    useEffect(() => {
        try {
            createListCategories(isControl ? props.filteredActions : props.myActions);
        } catch (err) {
            console.log(err);
        }
    }, [isControl, props.myActions, props.filteredActions])

    if (!props.login) {
        props.history.push('/');
        return (
            <Loader
                inverse
                center
                content="doot..."
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
    };

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

    const actionList = isControl ? props.filteredActions : props.myActions;
    return (
        <Box
            overflowY={'scroll'}
        >
            <NavigationBar/>
            <Container
                height={'calc(100vh - 50px)'}
                centerContent
                maxW={'1200px'}
                minW={'350px'}
            >
                <ActionDrawer
                    onChange={(value) => props.setFilter(value)}
                    value={props.filter}
                    onClick={() => setShowNew(true)}
                    actions={actionList}
                    handleSelect={() => console.log('something selected')}
                />

                <Accordion
                    defaultIndex={[0]}
                    allowMultiple
                    allowToggle
                >
                    {rounds.map((round, index) => (
                        <Box
                            key={index}
                        >
                            <Box
                                marginTop='2rem'
                            />
                            <WordDivider
                                word={`Round ${round}`}
                                size={'xl'}
                                marginTop={'1rem'}
                            />
                            <Box
                                marginBottom='1rem'
                            />
                            {sortedActions(round, actionList).map((action =>
                                    <Action
                                        action={action}
                                        key={action._id}
                                    />
                            ))}
                        </Box>
                    ))}
                </Accordion>

                <NewAction
                    show={showNew}
                    closeNew={() => setShowNew(false)}
                    gamestate={props.gamestate}
                />
            </Container>
        </Box>
    );
};

const mapStateToProps = (state) => ({
    actions: state.actions.list,
    explore: state.auth.user ? getCurrentExplores(state) : 'undefined',
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
