import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeamAccount } from '../../redux/entities/accounts';
import { Box, Button, Center, CircularProgress, Grid, GridItem, IconButton, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import MatchCard from './MatchCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { gameServer } from '../../config';
import { eventMassAdd, eventsRequested } from '../../redux/entities/events';
import axios from 'axios';

const MatchesByRound = (props) => {
    const navigate = useNavigate();
    const reduxAction = useDispatch();
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, character } = useSelector(s => s.auth);
    const round = useSelector(s => s.gamestate.round);
    const { rounds, loading, list } = useSelector(s => s.events);
    let matches = list;
    const account = useSelector(getTeamAccount);
    const [selected, setSelected] = useState(null);
    const [index, setIndex] = useState(rounds.findIndex(el => el == round));

    useEffect(() => {
        if (selected) {
            const match = matches.find(el => el._id === selected._id)
            setSelected(match)
        }
    }, [matches]);

    useEffect(() => {
        if (index && !loading && matches.filter(el => el.round === rounds[index]).length == 0) {
            const fetchData = async () => {
                reduxAction(eventsRequested());
                const { data } = await axios.get(`${gameServer}api/events/matches/${rounds[index]}`);
                reduxAction(eventMassAdd(data));
            }
            fetchData()
        }
    }, [index]);


    useEffect(() => {
        if (matches.length == 0) {
            navigate("/");
        }
    }, []);

    if (index < 0) setIndex(0)
    return (
        <Stack height={'100%'} >
            {!selected && <Text fontSize='24'>
                <IconButton
                    colorScheme='blue'
                    variant={'solid'}
                    icon={<ArrowLeftIcon />}
                    isDisabled={index <= 0}
                    margin={1}
                    onClick={() => setIndex(index - 1)}
                />

                Round {rounds[index]}
                <IconButton
                    colorScheme='blue'
                    variant={'solid'}
                    icon={<ArrowRightIcon />}
                    isDisabled={index + 1 === rounds.length}
                    margin={1}
                    onClick={() => setIndex(index + 1)}
                />
            </Text>}

            {matches && matches.filter(el => el.round === rounds[index]).length == 0 &&
                <Center>
                    <CircularProgress isIndeterminate color='green.300' />
                </Center>
            }

            {!selected && rounds[index] &&
                <Center alignContent={'center'} >
                    <SimpleGrid columns={2} spacing='20px' width={'99%'} >
                        {matches && matches.filter(el => el.round == rounds[index]).map(match => (
                            <MatchCard
                                handleSelect={setSelected}
                                key={match._id}
                                match={match}
                                showFacility={true}
                                showStandard={login}
                            />
                        ))}
                    </SimpleGrid>
                </Center>}

            {selected && <Stack align={'center'} >
                <Button variant='outline' colorScheme='white' onClick={() => setSelected(false)} >Back</Button>
                <MatchCard match={selected} defaultMode="roster" />
            </Stack>}

        </Stack>
    );
}

export default (MatchesByRound);