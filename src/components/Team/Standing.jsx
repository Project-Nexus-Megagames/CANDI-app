import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';
import { Grid, GridItem, Box, Stack, Wrap, WrapItem, SimpleGrid, Text, Center } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import TeamAvatar from '../Common/TeamAvatar';
import { getFadedColor } from '../../scripts/frontend';
import { useNavigate } from 'react-router-dom';
import StatIcon from '../Assets/StatIcon';

const Standing = (props) => {
    const { isControl } = usePermissions();
    const gamestate = useSelector(state => state.gamestate);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const teams = useSelector(state => state.teams.list)
    const divisions = [
        { name: "Toad Division", description: "Warts warts warts", code: 'toad' },
        { name: "Garbage Division", description: "", code: 'garbage' },
        { name: "Slime Division", description: "", code: 'slime' },
        { name: "Squid Division", description: "", code: 'squid' }
    ]

    const navigate = useNavigate();
    useEffect(() => {
        if (!props.login) {
            navigate("/");
        }
    }, []);

    const handleSelect = () => {

    }

    return (
        <SimpleGrid
            columns={2} spacing={10}
            gap='1'
            fontWeight='bold'>

            <GridItem pl='2' >
                <Stack>
                    <Box >
                        <h5 className={"toggle-tag"} style={{ backgroundColor: getFadedColor('pop') }} >Popularity</h5>

                        <Wrap spacing='5px' justify='space-around'>
                            {[...teams]
                                .sort((a, b) => {
                                    // sort alphabetically
                                    if (a?.popularity < b?.popularity) {
                                        return 1;
                                    }
                                    if (a?.popularity > b?.popularity) {
                                        return -1;
                                    }
                                    return 0;
                                })
                                .slice(0, 5)
                                .map(team => {
                                    return (
                                        <Center key={team._id} width={"40vw"} >
                                            <TeamAvatar team={team} />
                                            <Text noOfLines={1} fontSize='4xl'>{team.popularity}</Text>
                                        </Center>
                                    )
                                })}
                        </Wrap>

                    </Box>
                </Stack>
            </GridItem>

            {divisions.map(d => (
                <GridItem key={d.code} pl='2' >
                    <Stack>
                        <Box >
                            <h5 className={"toggle-tag"} style={{ backgroundColor: getFadedColor(d.code) }} >{d.name}</h5>

                            <Wrap spacing='5px' justify='space-around'>
                                {[...teams]
                                    .sort((a, b) => {
                                        // sort alphabetically
                                        if (a?.wins < b?.wins) {
                                            return 1;
                                        }
                                        if (a?.wins > b?.wins) {
                                            return -1;
                                        }
                                        return 0;
                                    })
                                    .filter(team => team.division.toLowerCase() === d.code).map(team => {
                                        return (
                                            <Center key={team._id} width={"40vw"} >
                                                <TeamAvatar team={team} />
                                                <Text noOfLines={1} fontSize='4xl'>W: {team.wins} L: {team.losses}</Text>
                                                <StatIcon stat={{ code: 'pop', name: "Popularity" }} compact size={'md'} />
                                                <Text noOfLines={1} fontSize='4xl'>{team.popularity}</Text>
                                            </Center>
                                        )
                                    })}
                            </Wrap>

                        </Box>
                    </Stack>
                </GridItem>
            ))}
        </SimpleGrid>
    );
}

export default Standing;