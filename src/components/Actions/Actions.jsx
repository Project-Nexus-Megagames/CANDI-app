import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { filteredActions, getCurrentExplores, getMyActions, setFilter } from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';
import NewAction from './Modals/NewAction';
import ActionDrawer from "./ActionList/ActionDrawer";
import Action from "./ActionList/Action/Action";
import {
    Accordion,
    Box,
    Button,
    Container,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    useDisclosure
} from "@chakra-ui/react";
import usePermissions from "../../hooks/usePermissions";
import WordDivider from "../WordDivider";
import { ChevronLeftIcon, PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
import AssetInfo from "./AssetInfo";
import EditAction from "./Modals/EditAction";

const Actions = (props) => {
    const [showNewActionModal, setShowNewActionModal] = useState(false);
    const [assetInfo, setAssetInfo] = useState({show: false, asset: ''});
    const [editAction, setEditAction] = useState({show: false, action: null})
    const {isControl} = usePermissions();
    const [rounds, setRounds] = useState([]);
    const {isOpen, onOpen, onClose} = useDisclosure();

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
            <Spinner
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
                <Flex
                    marginTop='2rem'
                    width={'100%'}
                >
                    <Box
                        marginRight='1rem'
                    >
                        <Button
                            onClick={() => onOpen()}
                            leftIcon={<ChevronLeftIcon/>}
                            colorScheme='orange'
                            variant='solid'
                        >
                            Open Drawer
                        </Button>
                    </Box>
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
                        <Button
                            onClick={() => setShowNewActionModal(true)}
                            leftIcon={<PlusSquareIcon/>}
                            colorScheme='green'
                            variant='solid'
                        >
                            Create New Action
                        </Button>
                    </Box>
                </Flex>

                <ActionDrawer
                    onChange={(e) => props.setFilter(e.target.value)}
                    value={props.filter}
                    onClick={() => setShowNewActionModal(true)}
                    actions={actionList}
                    handleSelect={() => console.log('something selected')}
                    isOpen={isOpen}
                    onClose={onClose}
                />

                <Accordion
                    defaultIndex={[0]}
                    allowMultiple
                    allowToggle
                    width={'100%'}
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
                                        toggleAssetInfo={(asset) => {
                                            setAssetInfo({show: true, asset});
                                        }}
                                        toggleEdit={(action) => {
                                            setEditAction({show: true, action})
                                        }}
                                    />
                            ))}
                        </Box>
                    ))}
                </Accordion>

                <NewAction
                    show={showNewActionModal}
                    closeNew={() => setShowNewActionModal(false)}
                    gamestate={props.gamestate}
                />

                <AssetInfo
                    asset={assetInfo.asset}
                    showInfo={assetInfo.show}
                    closeInfo={() => setAssetInfo({asset: '', show: false})}
                />

                <EditAction
                    action={editAction.action}
                    showEdit={editAction.show}
                    handleClose={() => setEditAction({action: null, show: false})}
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
