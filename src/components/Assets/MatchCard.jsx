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
import FacilityCard from '../Team/FacilityCard';

const MatchCard = ({ match, handleSelect, defaultMode = false, showFacility = true, showStandard = true }) => {
    const { matchRounds, athleteStats } = useSelector(s => s.gameConfig);
    const { login, team, control } = useSelector(s => s.auth);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(defaultMode);
    const athletes = useSelector(getTeamAthletes);
    const disabled = match?.status === 'completed' || match?.status === 'ongoing';
    const border = disabled ? 'solid' : 'dotted';
    const homeWon = match.homeScore > match.awayScore;
    const awayWon = match.homeScore < match.awayScore;

    const isHome = match.homeTeam?._id === team._id;
    const isVisitor = match.awayTeam?._id === team._id;

    const wasTied = match.logs.find(el => el.type === 'tie')
    const array = new Array(4).fill(null);
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

    const removeRoster = (athlete) => {
        setLoading(true)
        socket.emit('request', { route: 'event', action: 'removeRoster', data: { id: athlete._id, isHome, isVisitor, matchId: match._id } }, (response) => {
            console.log(response);
            setLoading(false)
        })
    }

    const runMatch = () => {
        setLoading(true)
        socket.emit('request', { route: 'event', action: 'runMatch', data: { matchId: match._id } }, (response) => {
            console.log(response);
            setLoading(false)
        })
    }

    return (
        <div key={match._id}
            style={{
                textAlign: 'center',
                width: "100%",
                border: `3px ${border} ${backgroundColor}`,
                backgroundColor: '#1a1d24',
                opacity: '',
                margin: '3px',
                padding: '3px',
                height: '100%'
            }}
        >
            <Text noOfLines={2} fontSize='lg'>{match.name}</Text>

            <Center>
                <NexusTag value={match.status} />
                <CountDownTag timeout={match.scheduledTick} width={'50px'} />
            </Center>

            <Flex alignItems='center'>
                <Spacer />

                <Stack backgroundColor={homeWon ? backgroundColor : 'inherit'}  >
                    <TeamAvatar opacity={awayWon && 0.5} size={"xl"} team={match.homeTeam} />
                    {homeWon && <Text>Won</Text>}
                    {awayWon && <Text>Lost</Text>}
                </Stack>

                <Spacer />

                <Stack textAlign={'center'} width={'60%'} >
                    <Text marginBottom={'-2'} noOfLines={1} fontSize='4xl'>{match.homeScore} - {match.awayScore}</Text>

                    <Stack gap={1} align={'center'} >
                        {showFacility && match.facility &&
                            <FacilityCard
                                showStandard={showStandard}
                                width={'60%'}
                                compact
                                facility={match.facility}
                            />}

                        {showStandard && matchRounds &&
                            [...match.facility.specialRounds, ...matchRounds.filter(el => el.public)]
                                .map((round, index) => {
                                    const log = match.logs.find(el => el.type === 'end-round' && el.round == (index + 2 - 0.01))
                                    const homeWonRound = log?.homeRoundScore > log?.awayRoundScore
                                    const awayWonRound = log?.homeRoundScore < log?.awayRoundScore
                                    const color = homeWonRound ? match.homeTeam.color :
                                    awayWonRound ? match.awayTeam.color :
                                            getFadedColor(round.color);
                                    return (
                                        <Tag
                                            border={`3px solid ${color}`}
                                            backgroundColor={getFadedColor(round.primaryStat, 0.5)}
                                            key={round._id}
                                            colorScheme='green'
                                            variant={'solid'}
                                            width={'60%'}
                                        >
                                            {log && <Center marginRight={'10px'}>
                                                <TeamAvatar opacity={awayWonRound && 0.5} size={"xs"} team={match.homeTeam} />
                                                <Text minW={'15px'} as={log?.homeRoundScore > log?.awayRoundScore && "u"} noOfLines={1} >{log?.homeRoundScore}</Text>
                                                <TeamAvatar opacity={homeWonRound && 0.5} size={"xs"} team={match.awayTeam} />
                                                <Text minW={'15px'} as={log?.homeRoundScore < log?.awayRoundScore && "u"} noOfLines={1} >{log?.awayRoundScore}</Text>
                                            </Center>}
                                            <StatIcon stat={{ code: round.primaryStat }} compact />
                                            <StatIcon stat={athleteStats.find(el => el.code === round.secondaryStat)} compact />
                                            <Text noOfLines={1} >{round.name}</Text>
                                        </Tag>)
                                })}
                        {wasTied &&
                            <Tag
                                border={`3px solid ${backgroundColor}`}
                                backgroundColor={getFadedColor(wasTied.color, 0.5)}
                                colorScheme='green'
                                alignContent={'center'}
                                variant={'solid'}
                                width={'60%'}
                            >
                                <TeamAvatar size={"xs"} team={homeWon ? match.homeTeam : match.awayTeam} />
                                <Text noOfLines={2} >{wasTied.text}</Text>
                            </Tag>}
                    </Stack>

                </Stack>

                <Spacer />

                <Stack backgroundColor={awayWon ? backgroundColor : 'inherit'} >
                    <TeamAvatar opacity={homeWon && 0.5} size={"xl"} team={match.awayTeam} />
                    {awayWon && <Text>Won</Text>}
                    {homeWon && <Text>Lost</Text>}
                </Stack>
                <Spacer />
            </Flex>

            <ButtonGroup isAttached>
                {mode && <Button onClick={() => setMode("roster")} variant={mode === 'roster' ? 'solid' : 'outline'} colorScheme='blue' size={'xs'} >Roster</Button>}
                {!mode && !handleSelect && <IconButton size={'xs'} onClick={() => setMode("roster")} rounded="full" icon={<StatDownArrow />} />}
                {!mode && handleSelect && <Button onClick={() => handleSelect(match)} variant={'solid'} colorScheme='blue' size={'xs'} >View </Button>}
                {mode && !defaultMode && <IconButton size={'xs'} variant={'solid'} colorScheme='red' onClick={() => setMode(false)} icon={<StatUpArrow />} />}
                {mode && <Button onClick={() => setMode("logs")} variant={mode === 'logs' ? 'solid' : 'outline'} colorScheme='orange' size={'xs'} >Logs</Button>}
                {mode && control && <Button onClick={runMatch} variant={'solid'} colorScheme='blue' size={'xs'} >Run</Button>}

            </ButtonGroup>

            {mode === 'roster' &&
                <Flex
                    style={{
                        backgroundColor: '#13151a',
                        overflow: 'auto'
                    }}
                >

                    <Stack width={'48%'} divider={<StackDivider borderColor='gray.200' />}>
                        {array.map((slot, index) => (
                            <div key={index} >
                                {match.homeRoster[index] &&
                                    <AthleteCard
                                        compact
                                        asset={match.homeRoster[index]}
                                        stats={true}
                                        showRemove={isHome && !disabled}
                                        removeAsset={() => removeRoster(match.homeRoster[index])}
                                    />}
                                {!match.homeRoster[index] &&
                                    <Center
                                        style={{
                                            border: `3px dotted ${getFadedColor('')}`,
                                            height: '100%',
                                            minHeight: '90px'
                                        }}
                                    >
                                        <b>Slot {index + 1}</b>
                                        {isHome && !disabled && <AddAsset
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
                                {match.awayRoster[index] &&
                                    <AthleteCard
                                        compact
                                        asset={match.awayRoster[index]}
                                        stats={true}
                                        showRemove={isVisitor && !disabled}
                                        removeAsset={() => removeRoster(match.awayRoster[index])}

                                    />}
                                {!match.awayRoster[index] &&
                                    <Center
                                        style={{
                                            border: `3px dotted ${getFadedColor('')}`,
                                            height: '100%',
                                            minHeight: '90px'
                                        }}
                                    >
                                        <b>Slot {index + 1}</b>
                                        {isVisitor && !disabled && <AddAsset
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
                        overflow: 'auto'
                    }}>
                    <LogRecords reports={match.logs} />
                </Stack>}

        </div>
    );
}

export default (MatchCard);