import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';
import { Grid, GridItem, Input, IconButton, CloseButton, Box, SimpleGrid, Stack } from '@chakra-ui/react';
import { Plus } from '@rsuite/icons';
import AssetCard from '../Common/AssetCard';
import { useSelector } from 'react-redux';
import { getDraft } from '../../redux/entities/assets';
import AthleteCard from '../Common/AthleteCard';
import TeamAvatar from '../Common/TeamAvatar';

const Draft = (props) => {
    const { isControl } = usePermissions();
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [extended, setExtended] = useState([1]);
    const draft = useSelector(getDraft);
    const rounds = [1, 2, 3, 4, 5]

    const toggleRound = (round) => {
        if (extended.some(el => el === round)) {
            setExtended(extended.filter(el=> el !== round))
        }
        else {
            setExtended([...extended, round])
        }
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
                        <Box>
                            <h5 onClick={()=> toggleRound(r)} style={{ backgroundColor: 'red'}} >Round: {r}</h5>
                            
                            {extended.some(el => el === r) && draft.filter(dra => dra.round === r).map(dra => (
                                <Box> <TeamAvatar team={dra.teamOwner} /> {dra.name}</Box>
                            ))}
                        </Box>
                    ))}
                </Stack>
            </GridItem>
        </Grid>
    );
}

export default Draft;