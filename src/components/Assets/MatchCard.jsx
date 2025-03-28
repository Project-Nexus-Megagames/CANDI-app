import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, GridItem, Input, IconButton, StackDivider, Box, SimpleGrid, Stack, Text, HStack, Center, Wrap, Card, Flex, Spacer, Button, StatDownArrow, StatUpArrow, ButtonGroup, Tag } from '@chakra-ui/react';
import { getFadedColor } from '../../scripts/frontend';
import TeamAvatar from '../Common/TeamAvatar';
import NexusTag from '../Common/NexusTag';
import AthleteCard from './AthleteCard';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { AddAsset } from '../Common/AddAsset';
import { getTeamAssets, getTeamAthletes } from '../../redux/entities/assets';
import socket from '../../socket';
import LogRecords from '../Logs/LogRecords';
import StatIcon from './StatIcon';
import CountDownTag from '../Common/CountDownTag';

const MatchCard = ({ match, handleSelect }) => {
    const { matchRounds, athleteStats } = useSelector(s => s.gameConfig);
    const { login, team, character } = useSelector(s => s.auth);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(false);
    const athletes = useSelector(getTeamAthletes);
    const disabled = match?.status === 'finished' || match?.status === 'ongoing';
    const border = disabled ? 'dotted' : 'solid';
    const homeWon = match.homeScore > match.awayScore;
    const awayWon = match.homeScore < match.awayScore;

    const isHome = match.homeTeam?._id === team._id;
    const isVisitor = match.awayTeam?._id === team._id;

    const array = new Array(5).fill(null);
    const backgroundColor =
        match?.status === 'scheduled' ? getFadedColor() :
            homeWon ? match.homeTeam.color : match.awayTeam.color

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
                border: `3px ${border} ${backgroundColor}`,
                backgroundColor: '#1a1d24',
                opacity: '',
                margin: '3px',
                padding: '3px',
                minWidth: '40vw',
            }}
            onClick={() => (handleSelect && !disabled) ? handleSelect(match) : console.log((handleSelect && !disabled))}
        >
            <Text noOfLines={2} fontSize='lg'>{match.name}</Text>

            <Center>
                <NexusTag value={match.status} />
                <CountDownTag timeout={match.scheduledTick} width={'50px'} />
            </Center>
            <Flex alignItems='center'>
                <Spacer />

                <Stack backgroundColor={homeWon ? backgroundColor : 'inherit'}  >
                    <TeamAvatar size={"xl"} team={match.homeTeam?._id} />
                    {homeWon && <Text>Winner</Text>}
                    {awayWon && <Text>Loser</Text>}
                </Stack>

                <Spacer />

                <Stack textAlign={'center'} width={'60%'} >
                    <Text noOfLines={1} fontSize='4xl'>{match.homeScore} - {match.awayScore}</Text>

                    <SimpleGrid columns={2} gap={1}>
                        {matchRounds.filter(el => el.public).map((round, index) => (<Tag border={`2px solid ${getFadedColor(round.primaryStat)}`} backgroundColor={getFadedColor(round.primaryStat, 0.5)} key={round._id} colorScheme='green' variant={'solid'} >
                            <StatIcon stat={athleteStats.find(el => el.code === round.primaryStat)} compact />
                            <StatIcon stat={athleteStats.find(el => el.code === round.secondaryStat)} compact />
                            {round.name}
                        </Tag>))}

                        {match.facility?.specialRounds.map((round, index) => (<Tag border={`2px solid ${getFadedColor(round.primaryStat)}`} backgroundColor={getFadedColor(round.primaryStat, 0.5)} key={round._id} colorScheme='green' variant={'solid'} >
                            <StatIcon stat={athleteStats.find(el => el.code === round.primaryStat)} compact />
                            <StatIcon stat={athleteStats.find(el => el.code === round.secondaryStat)} compact />
                            {round.name}
                        </Tag>))}
                    </SimpleGrid>

                </Stack>

                <Spacer />

                <Stack backgroundColor={awayWon ? backgroundColor : 'inherit'} >
                    <TeamAvatar size={"xl"} team={match.awayTeam?._id} />
                    {awayWon && <Text>Winner</Text>}
                    {homeWon && <Text>Loser</Text>}
                </Stack>
                <Spacer />
            </Flex>

            <ButtonGroup isAttached>
                {mode && <Button onClick={() => setMode("roster")} variant={mode === 'roster' ? 'solid' : 'outline'} colorScheme='blue' size={'xs'} >Roster</Button>}
                {!mode && <IconButton size={'xs'} onClick={() => setMode("roster")} rounded="full" icon={<StatDownArrow />} />}
                {mode && <IconButton size={'xs'} variant={'solid'} colorScheme='red' onClick={() => setMode(false)} icon={<StatUpArrow />} />}
                {mode && <Button onClick={() => setMode("logs")} variant={mode === 'logs' ? 'solid' : 'outline'} colorScheme='orange' size={'xs'} >Logs</Button>}

            </ButtonGroup>

            {mode === 'roster' &&
                <Flex
                    style={{
                        backgroundColor: '#13151a',
                        maxHeight: '40vh',
                        overflow: 'auto'
                    }}
                >

                    <Stack width={'48%'} divider={<StackDivider borderColor='gray.200' />}>
                        {array.map((slot, index) => (
                            <div key={index} >
                                {match.homeRoster[index] && <AthleteCard asset={match.homeRoster[index]} compact stats={false} />}
                                {!match.homeRoster[index] &&
                                    <Center
                                        style={{
                                            border: `3px dotted ${getFadedColor('')}`,
                                            height: '100%',
                                            minHeight: '90px'
                                        }}
                                    >
                                        <b>Slot {index + 1}</b>
                                        {isHome && <AddAsset
                                            assets={athletes.filter(el => !match.homeRoster.some(ass => ass?._id === el._id || ass === el._id))}
                                            handleSelect={addRoster}
                                        />}
                                    </Center>}
                            </div>
                        ))}
                    </Stack>

                    <Spacer />

                    <Stack width={'48%'} divider={<StackDivider borderColor='gray.200' />}>
                        {array.map((slot, index) => (
                            <div key={index} >
                                {match.awayRoster[index] && <AthleteCard asset={match.awayRoster[index]} stats={false} compact height={"90px"} />}
                                {!match.awayRoster[index] &&
                                    <Center
                                        style={{
                                            border: `3px dotted ${getFadedColor('')}`,
                                            height: '100%',
                                            minHeight: '90px'
                                        }}
                                    >
                                        <b>Slot {index + 1}</b>
                                        {isVisitor && <AddAsset
                                            assets={athletes.filter(el => !match.awayRoster.some(ass => ass?._id === el._id || ass === el._id))}
                                            handleSelect={addRoster}
                                        />}
                                    </Center>}
                            </div>
                        ))}
                    </Stack>

                </Flex>}

            {mode === 'logs' &&
                <Stack
                    style={{
                        backgroundColor: '#13151a',
                        maxHeight: '40vh',
                        overflow: 'auto'
                    }}>
                    <LogRecords reports={match.logs} />
                </Stack>}

        </div>
    );
}

export default (MatchCard);