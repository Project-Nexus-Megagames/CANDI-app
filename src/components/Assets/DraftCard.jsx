import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, GridItem, Input, IconButton, CloseButton, Box, SimpleGrid, Stack, Text, HStack, Center, Wrap, Card, Flex, Spacer } from '@chakra-ui/react';
import { getFadedColor } from '../../scripts/frontend';
import TeamAvatar from '../Common/TeamAvatar';
import NexusTag from '../Common/NexusTag';
import AthleteCard from './AthleteCard';

const DraftCard = ({ draft, handleSelect }) => {
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, character } = useSelector(s => s.auth);
    const disabled = draft?.status?.some(el => el.toLowerCase() === ('cooldown'));
    const border = disabled ? 'dotted' : 'solid';

    return (
        <div key={draft._id}
            style={{
                textAlign: 'center',
                width: "20vw",
                border: `3px ${border} ${getFadedColor(draft.type)}`,
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

            {draft.picked && <AthleteCard asset={draft.picked} />}
        </div>
    );
}

export default (DraftCard);