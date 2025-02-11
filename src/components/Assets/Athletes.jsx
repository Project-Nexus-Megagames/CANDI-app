import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';
import { Grid, GridItem, Input, IconButton, CloseButton, Box, SimpleGrid, Center, ButtonGroup, Tag, TagCloseButton, TagLeftIcon, TagLabel, Button, Divider, AbsoluteCenter } from '@chakra-ui/react';
import { ArrowUp, Plus } from '@rsuite/icons';
import AssetCard from '../Common/AssetCard';
import { useSelector } from 'react-redux';
import { getAthletes, getReadyTeamDraft } from '../../redux/entities/assets';
import AthleteCard from './AthleteCard';
import { FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { AddTag } from '../Common/AddTag';

const Athletes = (props) => {
    const { isControl } = usePermissions();
    const [filter, setFilter] = useState('');
    const [filterTags, setFilterTags] = useState([]);
    const [selected, setSelected] = useState(null);
    const [mode, setMode] = useState('filter');
    const athletes = useSelector(getAthletes);
    const drafts = useSelector(getReadyTeamDraft);

    const navigate = useNavigate();
    useEffect(() => {
        if (!props.login) {
            navigate("/");
        }
    }, []);


    function compareFn(a, b) {
        let aValue = 0;
        let bValue = 0;
        for (const tag of filterTags) {
            // if (typeof tag)
            const nameA = a[tag.property] // ignore upper and lowercase
            const nameB = b[tag.property] // ignore upper and lowercase

            if (nameA < nameB) {
                aValue = aValue + tag.ascending;
            }
            if (nameA > nameB) {
                bValue = bValue + tag.ascending;
            }
        }

        if (aValue < bValue) {
            return -1;
        }
        if (aValue > bValue) {
            return 1;
        }


        // names must be equal
        return 0;
    }

    function setAscending(index, ascNumber) {
        let temp = [...filterTags];
        temp[index].ascending = ascNumber;
        setFilterTags(temp);
    }

    const stats = [
        { property: "position", name: "Position", color: "green" },
        { property: "popularity", name: "Popularity", color: "green" },
        { property: "robot", name: "Robot %", color: "green" },

        { property: "buff_ness", name: "Buff Ness", color: "blue" },
        { property: "theoretical_squat_strength", name: "Theoretical Squat Strength", color: "blue" },
        { property: "tibia_diameter", name: "Tibia Diameter", color: "blue" },
        { property: "juke_torque", name: "Juke Torque", color: "blue" },

        { property: "chakra", name: "Chakra", color: "yellow" },
        { property: "doctors_notes", name: "Doctor's Notes", color: "yellow" },
        { property: "williams_ratio", name: "Williams Ratio", color: "yellow" },
        { property: "playstyles", name: "Playstyles", color: "yellow" },

        { property: "k_score", name: "K Score", color: "red" },
        { property: "rdd", name: "RDD", color: "red" },
        { property: "bb", name: "BB", color: "red" },
        { property: "tackles", name: "Tackles", color: "red" },

        { property: "strides", name: "Strides", color: "purple" },
        { property: "syn_act", name: "Syn Act", color: "purple" },
        { property: "ydl", name: "YDL", color: "purple" },
        { property: "union_rank", name: "Union Rank", color: "purple" },
    ];


    return (
        <Grid
            templateAreas={`"nav"`}
            gridTemplateColumns={'100%'}
            gap='1'
            fontWeight='bold'>

            <GridItem pl='2' area={'nav'} >
                {!selected && <Center >
                    <Input style={{ width: '80%', margin: '5px' }} placeholder="Search" onChange={(e) => setFilter(e.target.value)}></Input>
                    <ButtonGroup isAttached marginRight={'0px'} >
                        {!selected && <IconButton variant={'solid'} onClick={() => setMode('new')} colorScheme='green' size="md" icon={<Plus />} />}
                        {selected && <IconButton variant={'outline'} onClick={() => setSelected(false)} colorScheme='red' size="md" icon={<CloseButton />} />}
                        <IconButton variant={'solid'} onClick={() => setMode('filter')} colorScheme='pink' size="md" icon={<FaFilter />} />
                    </ButtonGroup>

                </Center>}

                {mode === 'filter' && <Box>
                    <Box position='relative' >
                        <Divider />
                        <AbsoluteCenter bg='#0f131a'  px='4'>
                            Sort By
                        </AbsoluteCenter>
                    </Box>

                    {filterTags.map((tag, index) => (
                        <Tag
                            size={'md'}
                            key={index}
                            borderRadius='full'
                            variant='solid'
                            colorScheme={tag.color}
                                                       
                        >
                            <TagLeftIcon boxSize='18px' as={tag.ascending > 0 ? ChevronUpIcon : ChevronDownIcon} onClick={() => setAscending(index, tag.ascending * -1)} />
                            <TagLabel as={Button} variant={'colorScheme'} colorScheme='inherit' onClick={() => setAscending(index, tag.ascending * -1)} >{tag.property}</TagLabel>

                            <TagCloseButton onClick={(e) => {e.preventDefault(); setFilterTags(filterTags.filter(el => el.property !== tag.property));}} />
                        </Tag>
                    ))}
                    <AddTag
                        tags={stats.filter(el => !filterTags.some(ass => ass?.property === el.property))}
                        handleSelect={(tag) => setFilterTags([...filterTags, { ...tag, ascending: 1 }])}
                    />
                </Box>}

                <SimpleGrid columns={3} columnGap="2" rowGap="4">
                    {athletes.sort(compareFn).map(athlete => (
                        <AthleteCard asset={athlete} drafts={drafts} stats={stats} filterTags={filterTags} showButtons/>
                    ))}
                </SimpleGrid>
            </GridItem>
        </Grid>
    );
}

export default Athletes;