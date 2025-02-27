import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, GridItem, Input, IconButton, StackDivider, Box, SimpleGrid, Stack, Text, HStack, Center, Wrap, Card, Flex, Spacer, Button, StatDownArrow, StatUpArrow } from '@chakra-ui/react';
import { getFadedColor } from '../../scripts/frontend';
import TeamAvatar from '../Common/TeamAvatar';
import NexusTag from '../Common/NexusTag';
import AthleteCard from './AthleteCard';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { AddAsset } from '../Common/AddAsset';
import { getTeamAssets, getTeamAthletes } from '../../redux/entities/assets';
import socket from '../../socket';

const MatchCard = ({ match, handleSelect }) => {
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, character } = useSelector(s => s.auth);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(false);
    const athletes = useSelector(getTeamAthletes);
    const disabled = match?.status === 'finished' || match?.status === 'ongoing';
    const border = disabled ? 'dotted' : 'solid';

    const isHome = match.homeTeam?._id === team._id;
    const isVisitor = match.awayTeam?._id === team._id;

    const array = new Array(5).fill(null);

    const addRoster = (athlete) => {
        setLoading(true)
        socket.emit('request', { route: 'event', action: 'addRoster', data: { id: athlete._id, isHome, isVisitor, matchId: match._id } }, (response) => {
            console.log(response);
            setLoading(false)
        })
    }

    return (
        <div key={match._id}
            style={{
                textAlign: 'center',
                width: "40vw",
                border: `3px ${border} ${getFadedColor('match')}`,
                backgroundColor: '#1a1d24',
                margin: '3px',
                padding: '3px',
                minWidth: '350px'
            }}
            onClick={() => (handleSelect && !disabled) ? handleSelect(match) : console.log((handleSelect && !disabled))}
        >
            <Text noOfLines={2} fontSize='lg'>{match.name}</Text>
            <Flex alignItems='center'>
                <Spacer />

                <Stack>
                    <TeamAvatar size={"xl"} team={match.homeTeam?._id} />
                </Stack>

                <Spacer />

                <Stack textAlign={'center'} width={'60%'} >
                    <Text noOfLines={1} fontSize='4xl'>{match.homeScore} - {match.awayScore}</Text>
                    <Text noOfLines={1} marginTop={'-15px'} fontSize='md'>{match.status}</Text>
                </Stack>

                <Spacer />

                <Stack>
                    <TeamAvatar size={"xl"} team={match.awayTeam?._id} />
                </Stack>
            </Flex>

            {mode !== "expand" && <IconButton size={'xs'} onClick={() => setMode("expand")} rounded="full" icon={<StatDownArrow />} />}
            {mode === "expand" && <IconButton size={'xs'} onClick={() => setMode(false)} rounded="full" icon={<StatUpArrow />} />}

            {mode === "expand" && <Flex style={{ backgroundColor: '#13151a', }} >

                <Stack width={'48%'} divider={<StackDivider borderColor='gray.200' />}>
                    {array.map((slot, index) => (
                        <div key={index} >
                            {match.homeRoster[index] && <AthleteCard asset={match.homeRoster[index]} compact />}
                            {!match.homeRoster[index] &&
                                <div>
                                    <b>Slot {index + 1}</b>
                                    {isHome && <AddAsset assets={athletes} handleSelect={addRoster} />}
                                </div>}
                        </div>
                    ))}
                </Stack>

                <Spacer />

                <Stack width={'48%'} divider={<StackDivider borderColor='gray.200' />}>
                    {array.map((slot, index) => (
                        <div key={index} >
                            {match.awayRoster[index] && <AthleteCard asset={match.awayRoster[index]} compact />}
                            {!match.awayRoster[index] &&
                                <div>
                                    <b>Slot {index + 1}</b>
                                    {isVisitor && <AddAsset assets={athletes} handleSelect={addRoster} />}
                                </div>}
                        </div>
                    ))}
                </Stack>

            </Flex>}

        </div>
    );
}

export default (MatchCard);