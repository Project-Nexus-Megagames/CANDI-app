import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTeamAccount } from '../../redux/entities/accounts';
import { Box, Button, Center, CircularProgress, Grid, GridItem, IconButton, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import MatchCard from './MatchCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const MatchesByRound = ({ matches, rounds }) => {
    const navigate = useNavigate();
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, character } = useSelector(s => s.auth);
    const round = useSelector(s => s.gamestate.round);
    const account = useSelector(getTeamAccount);
    const [selected, setSelected] = useState(null);
    const [index, setIndex] = useState(rounds.findIndex(el => el == round));

    if (rounds.length == 0 && matches) {
        rounds = Array.from(new Set(matches.map(match => match.round)));
    }

    return (
        <Stack height={'100%'} >

            <Text fontSize='24'>
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
            </Text>

            {matches && matches.filter(el => el.round === rounds[index]).length == 0 &&
                <Center>
                    <CircularProgress isIndeterminate color='green.300' />
                </Center>
            }

            {!selected && rounds[index] &&
                <Center alignContent={'center'} >
                    <SimpleGrid columns={2} spacing='20px' width={'99%'} >
                        {matches && matches.filter(el => el.round === rounds[index]).map(match => (
                            <MatchCard handleSelect={setSelected} key={match._id} match={match} showFacility={true} showStandard={false} />
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