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

const DraftCard = ({ draft, handleSelect }) => {
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, control } = useSelector(s => s.auth);
    const athletes = useSelector(getDraftableAthletes);
    const disabled = draft?.status?.some(el => el.toLowerCase() === ('cooldown'));
    const border = disabled ? 'dotted' : 'solid';
    const [loading, setLoading] = useState(false);

    const quePick = (choiceNum, athlete) => {
        setLoading(true)
        socket.emit('request', { 
            route: 'asset', 
            action: 'choiceDraft', 
            data: { 
                athlete: athlete._id, 
                draft: draft._id, 
                choiceNum
             }}, 
                (response) => {
            console.log(response);
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
             }}, 
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
            onClick={() => (handleSelect && !disabled) ? handleSelect(draft) : console.log((handleSelect && !disabled))}
        >
            <Flex alignItems='center'>
                <Spacer />
                <TeamAvatar team={draft.teamOwner?._id} />
                <Spacer />
                <Stack textAlign={'left'} width={'60%'} >
                    <Text noOfLines={1} marginBottom={'-15px'} fontSize='lg'>{draft.name}</Text>
                    <Text noOfLines={1} marginBottom={'-10px'} fontSize='md' >{draft.teamOwner?.name}</Text>
                    {draft.status.length > 0 && draft.status?.map(el => (
                        <NexusTag key={el} value={el}></NexusTag>
                    ))}
                </Stack>
                <Spacer />
            </Flex>

            {draft.picked && <AthleteCard asset={draft.picked} compact />}
            {disabled && (team._id === draft.teamOwner._id || control) && !draft.picked && <Box>
                First Choice
                {!draft.firstChoice && <AddAsset assets={athletes} handleSelect={(athlete) => quePick('firstChoice', athlete)}/>}
                {draft.firstChoice && <AthleteCard asset={draft.firstChoice} compact showRemove removeAsset={() => removeChoice('firstChoice', false)} />}
                
                Second Choice
                {!draft.secondChoice && <AddAsset assets={athletes} handleSelect={(athlete) => quePick('secondChoice', athlete)}/>}
                {draft.secondChoice && <AthleteCard asset={draft.secondChoice} compact showRemove removeAsset={() => removeChoice('secondChoice', false)} />}
                </Box>}
        </div>
    );
}

export default (DraftCard);