import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';
import { Grid, GridItem, Input, IconButton, CloseButton, Box, SimpleGrid, Stack, Text, HStack, Center, Wrap, Card, Flex, Spacer, WrapItem } from '@chakra-ui/react';
import { Plus } from '@rsuite/icons';
import AssetCard from '../Common/AssetCard';
import { useSelector } from 'react-redux';
import { getDraft } from '../../redux/entities/assets';
import AthleteCard from './AthleteCard';
import TeamAvatar from '../Common/TeamAvatar';
import NexusTag from '../Common/NexusTag';
import { getFadedColor } from '../../scripts/frontend';
import DraftCard from './DraftCard';
import MatchCard from './MatchCard';
import { useNavigate } from 'react-router-dom';

const Matches = (props) => {
    const { isControl } = usePermissions();
    const gamestate = useSelector(state => state.gamestate);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const rounds = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    const [extended, setExtended] = useState(rounds);
    const events = useSelector(state => state.events.list)

    const navigate = useNavigate();
    useEffect(() => {
        if (!props.login) {
            navigate("/");
        }
    }, []);

    const toggleRound = (round) => {
        if (extended.some(el => el === round)) {
            setExtended(extended.filter(el => el !== round))
        }
        else {
            setExtended([...extended, round])
        }
    }

    const handleSelect = () => {

    }

    return (
        <Grid
            templateAreas={`"nav"`}
            gridTemplateColumns={'100%'}
            gap='1'
            fontWeight='bold'>

            <GridItem pl='2' area={'nav'} >
                <Stack>
                    {rounds.map(r => (
                        <Box key={r} >
                            <h5 className={"toggle-tag"} onClick={() => toggleRound(r)} style={{ backgroundColor: getFadedColor('round', 0.2 * r) }} >Round: {r}</h5>

                            <Wrap spacing='5px' justify='space-around'>
                                {extended.some(el => el === r) && events.filter(dra => dra.round === r).map(match => {
                                    return (
                                        <WrapItem key={match._id} width={"40vw"} >
                                            <MatchCard match={match} />
                                        </WrapItem>
                                    )
                                })}
                            </Wrap>

                        </Box>
                    ))}
                </Stack>
            </GridItem>
        </Grid>
    );
}

export default Matches;