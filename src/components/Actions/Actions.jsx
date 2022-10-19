import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { filteredActions, getCurrentExplores, getMyActions, setFilter } from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';
import NewAction from './NewAction';
import ActionDrawer from "./ActionList/ActionDrawer";
import Action from "./ActionList/Action/Action";
import { Box, Container } from "@chakra-ui/react";
import usePermissions from "../../hooks/usePermissions";

const Actions = (props) => {
    const [selected, setSelected] = useState(null);
    const [showNew, setShowNew] = useState(false);
    const {isControl} = usePermissions();

    useEffect(() => {
        if (selected) {
            const newSelected = props.actions.find((el) => el._id === selected._id);
            setSelected(newSelected);
        }
    }, [props.actions, selected]);

    const handleSelect = (fuuuck) => {
        setSelected(fuuuck);
    };

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
                    actions={isControl ? props.filteredActions : props.myActions}
                    handleSelect={handleSelect}
                />

                {selected &&
                    <Action
                        action={selected}
                    />
                }

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
