import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';
import { Grid, GridItem, Input, IconButton, CloseButton, Box, SimpleGrid } from '@chakra-ui/react';
import { Plus } from '@rsuite/icons';
import AssetCard from '../Common/AssetCard';
import { useSelector } from 'react-redux';
import { getAthletes } from '../../redux/entities/assets';
import AthleteCard from '../Common/AthleteCard';

const Athletes = (props) => {
    const { isControl } = usePermissions();
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [mode, setMode] = useState(null);
      const athletes = useSelector(getAthletes);

    return (
        <Grid
            templateAreas={`"nav"`}
            gridTemplateColumns={'100%'}
            gap='1'
            fontWeight='bold'>

            <GridItem pl='2' area={'nav'} >
                {!selected && <Box>
                    <Input style={{ width: '80%', margin: '5px' }} placeholder="Search" onChange={(e) => setFilter(e.target.value)}></Input>
                    {!selected && <IconButton variant={'solid'} onClick={() => setMode('new')} colorScheme='green' size="sm" icon={<Plus />} />}
                    {selected && <IconButton variant={'outline'} onClick={() => setSelected(false)} colorScheme='red' size="sm" icon={<CloseButton />} />}
                </Box>}

                <SimpleGrid columns={3} columnGap="2" rowGap="4">
                    {athletes.map(athlete => (
                        <AthleteCard asset={athlete} />
                    ))}
                </SimpleGrid>
            </GridItem>
        </Grid>
    );
}

export default Athletes;