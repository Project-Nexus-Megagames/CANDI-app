import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, SliderMark, Grid, GridItem, Input, IconButton, CloseButton, Box, SimpleGrid, Center, ButtonGroup, Tag, TagCloseButton, TagLeftIcon, TagLabel, Button, Divider, AbsoluteCenter,
    InputGroup,
    HStack,
    Stack
} from '@chakra-ui/react';
import { Plus } from '@rsuite/icons';
import { useSelector } from 'react-redux';
import { getAthletes, getReadyTeamDraft, getUpcomingTeamDraft } from '../../redux/entities/assets';
import AthleteCard from './AthleteCard';
import { FaEye, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon, Search2Icon } from '@chakra-ui/icons';
import { AddTag } from '../Common/AddTag';
import InputNumber from '../Common/InputNumber';
import socket from '../../socket';
import StatIcon from './StatIcon';

const Athletes = (props) => {
    const { isControl } = usePermissions();
    const gameConfig = useSelector(state => state.gameConfig);
    const [filter, setFilter] = useState('');
    const [filterTags, setFilterTags] = useState([]);
    const [selected, setSelected] = useState(null);
    const [mode, setMode] = useState('filter');
    const athletes = useSelector(getAthletes);
    const drafts = useSelector(getReadyTeamDraft);
    const upcomingDrafts = useSelector(getUpcomingTeamDraft);
    const salaryTypes = [
        { name: "Shiny Rock", code: "shiny_rock" },
        { name: "Excellent Moss", code: "excellent_moss" },
        { name: "Mushroom", code: "mushroom" },
        { name: "Gold", code: "gold" }
    ]
    const [renderSalary, setRenderSalary] = React.useState(salaryTypes);

    const [loading, setLoading] = React.useState(false);
    const [renderedOwned, setRenderOwned] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (!props.login) {
            navigate("/");
        }
    }, []);

    function toggleAdditionalFilter(sal) {
        if (renderSalary.some(el => el.code === sal.code))
            setRenderSalary(renderSalary.filter(el => el.code !== sal.code))
        else
            setRenderSalary([...renderSalary, sal])
    }

    // for sorting post filters
    function compareFn(a, b) {
        let aValue = 0;
        let bValue = 0;
        for (const tag of filterTags) {
            // if (typeof tag)
            const nameA = a.stats.find(el => el.code === tag.code) // ignore upper and lowercase
            const nameB = b.stats.find(el => el.code === tag.code)  // ignore upper and lowercase

            if (nameA.statAmount < nameB.statAmount) {
                aValue = aValue + tag.ascending;
            }
            if (nameA.statAmount > nameB.statAmount) {
                bValue = bValue + tag.ascending;
            }
        }

        if (aValue < bValue) {
            return -1;
        }
        if (aValue > bValue) {
            return 1;
        }
        return 0;
    }

    function filterFn(value) {
        let tagCompare = renderedOwned ? value.teamOwner !== undefined : true;
        for (const tag of filterTags) {
            // if (typeof tag)
            const nameA = value.stats.find(el => el.code === tag.code) // ignore upper and lowercase

            if (nameA.statAmount < tag.min) {
                tagCompare = false;
            }
            if (nameA.statAmount > tag.max) {
                tagCompare = false;
            }
        }
        return tagCompare &&
            renderSalary.some(el => el.code === value.preferredCurrency) &&
            (value.name.includes(filter) || value.species.includes(filter) || value.tags.some(t => t.toLowerCase().includes(filter)))
    }

    function setAscending(index, ascNumber) {
        let temp = [...filterTags];
        temp[index].ascending = ascNumber;
        setFilterTags(temp);
    }

    function setMin(index, min) {
        let temp = [...filterTags];
        temp[index].min = min;
        setFilterTags(temp);
    }
    function setMax(index, ascNumber) {
        let temp = [...filterTags];
        temp[index].max = ascNumber;
        setFilterTags(temp);
    }


    return (
        <Grid
            templateAreas={`"nav main"`}
            gridTemplateColumns={'400px 1fr'}
            gap='1'
            h='calc(100vh - 78px)'
            fontWeight='bold'>

            <GridItem pl='2' area={'nav'} overflow={'auto'}>
                {!selected && <Center >
                    <Input style={{ width: '80%', margin: '5px' }} placeholder="Search Name, Tag, Species" onChange={(e) => setFilter(e.target.value)}></Input>
                    <ButtonGroup isAttached marginRight={'0px'} >
                        {!selected && isControl && <IconButton variant={'solid'} onClick={() => setMode('new')} colorScheme='green' size="md" icon={<Plus />} />}
                        {selected && <IconButton variant={'outline'} onClick={() => setSelected(false)} colorScheme='red' size="md" icon={<CloseButton />} />}
                        <Popover  >
                            <PopoverTrigger>
                                <IconButton isLoading={loading} variant={'solid'} colorScheme='pink' size="md" icon={<FaEye />} />
                            </PopoverTrigger>
                            <PopoverContent backgroundColor='#1d232e'>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Filter by...</PopoverHeader>
                                <PopoverBody>
                                    <Stack>
                                        {salaryTypes.map(sal =>
                                            <Button
                                                variant={renderSalary.some(el => el.code === sal.code) ? 'solid' : 'outline'}
                                                colorScheme='blue'
                                                onClick={() => toggleAdditionalFilter(sal)}
                                                leftIcon={<StatIcon stat={{ code: 'SAL' }} preferredCurrency={sal.code} />}
                                                key={sal.code} >
                                                {sal.name}
                                            </Button>
                                        )}
                                        <Button
                                            variant={renderedOwned ? 'solid' : 'outline'}
                                            colorScheme='green'
                                            onClick={() => setRenderOwned(!renderedOwned)}
                                        >
                                            {renderedOwned ? "Showing Owned Athletes" : "Showing All Athletes"}
                                        </Button>
                                    </Stack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>

                    </ButtonGroup>

                </Center>}

                {mode === 'filter' && <Box>
                    <Box position='relative' >
                        <Divider />
                        <AbsoluteCenter bg='#0f131a' px='4'>
                            Sort/Filter By
                        </AbsoluteCenter>
                    </Box>

                    {filterTags.map((tag, index) => (
                        <Box key={index}>
                            <Tag
                                size={'md'}
                                borderRadius='full'
                                variant='solid'
                                backgroundColor={tag.color}
                                color={tag.textColor}
                            >
                                <TagLeftIcon boxSize='18px' as={tag.ascending > 0 ? ChevronUpIcon : ChevronDownIcon} onClick={() => setAscending(index, tag.ascending * -1)} />
                                <TagLabel as={Button} variant={'colorScheme'} colorScheme='inherit' onClick={() => setAscending(index, tag.ascending * -1)} >{tag.code}</TagLabel>

                                <TagCloseButton onClick={(e) => { e.preventDefault(); setFilterTags(filterTags.filter(el => el.code !== tag.code)); }} />
                            </Tag>

                            <InputGroup>
                                <InputNumber
                                    prefix='Max'
                                    style={{ width: '10px' }}
                                    defaultValue={tag.max}
                                    value={tag.max}
                                    max={20}
                                    onChange={(event) => setMax(index, parseInt(event))}>
                                </InputNumber>

                                <InputNumber
                                    prefix='Min'
                                    style={{ width: 200 }}
                                    defaultValue={tag.min}
                                    value={tag.min}
                                    min={-8}
                                    onChange={(event) => setMin(index, parseInt(event))}>
                                </InputNumber>
                            </InputGroup>

                        </Box>
                    ))}
                    <AddTag
                        tags={gameConfig.athleteStats.filter(el => !filterTags.some(ass => ass?.code === el.code))}
                        handleSelect={(tag) => setFilterTags([...filterTags, { ...tag, ascending: 1, max: 20, min: -8 }])}
                    />
                </Box>}
            </GridItem>

            <GridItem pl='2' area={'main'} overflow={'auto'}>
                <SimpleGrid columns={3} columnGap="2" rowGap="4">
                    {athletes.filter(filterFn).sort(compareFn).map(athlete => (
                        <AthleteCard
                            key={athlete._id}
                            asset={athlete}
                            drafts={drafts}
                            upcomingDrafts={upcomingDrafts}
                            showButtons
                            stats={true}
                        />
                    ))}
                </SimpleGrid>
            </GridItem>
        </Grid>
    );
}

export default Athletes;