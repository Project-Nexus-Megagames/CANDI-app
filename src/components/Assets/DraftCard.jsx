import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, GridItem, Input, IconButton, CloseButton, Box, SimpleGrid, Stack, Text, HStack, Center, Wrap, Card, Flex, Spacer } from '@chakra-ui/react';
import { getFadedColor } from '../../scripts/frontend';
import TeamAvatar from '../Common/TeamAvatar';
import NexusTag from '../Common/NexusTag';
import AthleteCard from './AthleteCard';
import { AddAsset } from '../Common/AddAsset';
import { getDraftableAthletes } from '../../redux/entities/assets';
import socket from '../../socket';
import CountDownTag from '../Common/CountDownTag';
import { Close } from '@rsuite/icons';
import { BsPlus } from 'react-icons/bs';

const DraftCard = ({ draft, handleSelect, removeAsset, showRemove = false, scheduleAthlete = false, handleClose = false }) => {
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, control } = useSelector(s => s.auth);
    const athletes = useSelector(getDraftableAthletes);
    const disabled = draft?.status?.some(el => el.toLowerCase() === ('cooldown'));
    const border = disabled ? 'dotted' : 'solid';
    const [loading, setLoading] = useState(false);

    const sortedAssets = [ ...athletes.filter(el => team.bookmarked.some(b => b === el._id)), ...athletes.filter(el => !team.bookmarked.some(b => b === el._id)) ]

    const quePick = (choiceNum, athlete) => {
        setLoading(true)
        socket.emit('request', {
            route: 'asset',
            action: 'choiceDraft',
            data: {
                athlete: athlete._id,
                draft: draft._id,
                choiceNum
            }
        },
            (response) => {
                handleClose && handleClose()
                setLoading(false)
            })
    }

    const removeChoice = (choiceNum) => {
        setLoading(true)
        socket.emit('request', {
            route: 'asset',
            action: 'removeChoice',
            data: {
                draft: draft._id,
                choiceNum
            }
        },
            (response) => {
                console.log(response);
                setLoading(false)
            })
    }

    return (
        <div key={draft._id}
            style={{
                textAlign: 'center',
                width: "20vw",
                border: `3px ${border} ${getFadedColor('draft')}`,
                backgroundColor: '#1a1d24',
                minWidth: '350px'
            }}
            onClick={() => (handleSelect) ? handleSelect(draft) : console.log((handleSelect))}
        >
            <Flex alignItems='center'>
                <Spacer />
                <TeamAvatar team={draft.teamOwner?._id} />
                <Spacer />
                <Stack textAlign={'left'} width={'60%'} >
                    <Text noOfLines={1} marginBottom={'-15px'} fontSize='lg'>{draft.name}</Text>
                    <Text noOfLines={1} marginBottom={'-10px'} fontSize='md' >{draft.teamOwner?.name}</Text>
                    <HStack>
                        {draft.status.length > 0 && draft.status?.map(el => (
                            <NexusTag key={el} value={el}></NexusTag>
                        ))}
                        <CountDownTag timeout={draft.pickNum} width={'20px'} />
                    </HStack>

                </Stack>
                {removeAsset &&
                    <IconButton
                        variant={'outline'}
                        onClick={removeAsset}
                        colorScheme="red"
                        size={'sm'}
                        icon={<Close />}
                    />}
                <Spacer />
            </Flex>

            {draft.picked && <AthleteCard asset={draft.picked} compact />}
            {disabled && (team._id === draft.teamOwner._id || control) && !draft.picked && <Box>
                First Choice
                {!draft.firstChoice && !scheduleAthlete &&
                    <AddAsset
                        assets={sortedAssets}
                        handleSelect={(athlete) => quePick('firstChoice', athlete)}
                    />}
                {!draft.firstChoice && scheduleAthlete &&
                    <Center>
                        <IconButton
                            onClick={() => quePick('firstChoice', scheduleAthlete)}
                            isLoading={loading}
                            variant="solid"
                            colorScheme='green'
                            size="sm"
                            icon={<BsPlus size={'25'} />}
                        />
                    </Center>}
                {draft.firstChoice &&
                    <AthleteCard
                        asset={draft.firstChoice}
                        compact
                        showRemove={showRemove}
                        removeAsset={() => removeChoice('firstChoice', false)}
                    />}

                Second Choice
                {!draft.secondChoice && !scheduleAthlete &&
                    <AddAsset
                        assets={sortedAssets}
                        handleSelect={(athlete) => quePick('secondChoice', athlete)}
                    />}
                {!draft.secondChoice && scheduleAthlete &&
                    <Center>
                        <IconButton
                            onClick={() => quePick('secondChoice', scheduleAthlete)}
                            isLoading={loading}
                            variant="solid"
                            colorScheme='green'
                            size="sm"
                            icon={<BsPlus size={'25'} />}
                        />
                    </Center>}
                {draft.secondChoice && <AthleteCard asset={draft.secondChoice} compact showRemove={showRemove} removeAsset={() => removeChoice('secondChoice', false)} />}
           
                Third Choice
                {!draft.thirdChoice && !scheduleAthlete &&
                    <AddAsset
                        assets={sortedAssets}
                        handleSelect={(athlete) => quePick('thirdChoice', athlete)}
                    />}
                {!draft.thirdChoice && scheduleAthlete &&
                    <Center>
                        <IconButton
                            onClick={() => quePick('thirdChoice', scheduleAthlete)}
                            isLoading={loading}
                            variant="solid"
                            colorScheme='green'
                            size="sm"
                            icon={<BsPlus size={'25'} />}
                        />
                    </Center>}
                {draft.thirdChoice &&
                    <AthleteCard
                        asset={draft.thirdChoice}
                        compact
                        showRemove={showRemove}
                        removeAsset={() => removeChoice('thirdChoice', false)}
                    />}
            </Box>}
        </div>
    );
}

export default (DraftCard);