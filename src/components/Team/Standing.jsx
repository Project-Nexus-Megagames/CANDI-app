import React, { useEffect, useState } from 'react';
import usePermissions from '../../hooks/usePermissions';
import { Grid, GridItem, Box, Stack, Wrap, WrapItem, SimpleGrid, Text, Center, Spacer, Flex, Avatar } from '@chakra-ui/react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'

import { useSelector } from 'react-redux';
import TeamAvatar from '../Common/TeamAvatar';
import { getFadedColor } from '../../scripts/frontend';
import { useNavigate } from 'react-router-dom';
import StatIcon from '../Assets/StatIcon';
import ResourceNugget from '../Common/ResourceNugget';
import { getTeamAccounts } from '../../redux/entities/accounts';
import { CandiModal } from '../Common/CandiModal';
import AthleteCard from '../Assets/AthleteCard';

const Standing = (props) => {
    const { isControl, myCharacter, login } = usePermissions();
    const gamestate = useSelector(state => state.gamestate);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const accounts = useSelector(getTeamAccounts)
    const teams = useSelector(state => state.teams.list)
    const assets = useSelector(state => state.assets.list)

    const divisions = [
        { name: "Toad Division", description: "Warts warts warts", code: 'toad' },
        { name: "Garbage Division", description: "", code: 'garbage' },
        { name: "Slime Division", description: "", code: 'slime' },
        { name: "Squid Division", description: "", code: 'squid' }
    ]

    const navigate = useNavigate();
    useEffect(() => {
        if (teams.length == 0) {
            navigate("/");
        }
    }, []);

    return (
        <SimpleGrid
            columns={2}
            spacing={'2'}
            fontWeight='bold'>
            {divisions.map(d => (
                <TableContainer key={d.code} >
                    <Table variant='unstyled' border={'2px solid #d4af37'} >
                        <Thead style={{ backgroundColor: "#393c3e", color: 'wheat' }}>
                            <Tr>
                                <Th><Avatar size={'sm'} name={d.name} src={`/images/divisions/${d.code}.png`} /></Th>
                                <Th>{d.name}</Th>
                                <Th>W</Th>
                                <Th >L</Th>
                                <Th >POP</Th>
                                {props.login && <Th >RES</Th>}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {teams && [...teams]
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
                                    const account = accounts.find(el => el.team._id === team._id)
                                    return (
                                        <Tr backgroundColor={team.color} cursor={'pointer'} onClick={() => setSelected(team)} >
                                            <Td width={'50px'} ><TeamAvatar team={team} /></Td>
                                            <Td width={'400px'} ><Text fontSize='2xl' >{team.name}</Text></Td>
                                            <Td>{team.wins}</Td>
                                            <Td>{team.losses}</Td>
                                            <Td>{team.popularity}</Td>
                                            {props.login && <Td>
                                                <SimpleGrid columns={3} >
                                                    {account && account.resources?.filter(r => r.balance > 0).map((item) =>
                                                        <ResourceNugget key={item._id} type={item.type} value={item.balance} width={'50px'} height={'30'} />
                                                    )}
                                                </SimpleGrid>
                                            </Td>}

                                        </Tr>
                                    )
                                })}
                        </Tbody>

                    </Table>
                </TableContainer>
            ))}

            {selected && <CandiModal size="4xl" onClose={() => { setSelected(false); }} open={selected} title={`${selected?.name}`} border={`3px solid ${selected.secondaryColor}`} >
                <Flex align={'center'} backgroundColor={selected.color} cursor={'pointer'} onClick={() => setSelected(selected)} >
                    <TeamAvatar team={selected} />
                    <Text fontSize='2xl' >{selected.name}</Text>
                    <Spacer />
                    <Text fontSize='2xl' >
                        Win: {selected.wins} -
                        Loss: {selected.losses} -
                        Pop: {selected.popularity}
                    </Text>
                </Flex>

                <Text fontSize='2xl' >Roster</Text>
                <Wrap spacing='10px' justify='space-around'>
                    {assets.filter(el => el.teamOwner?._id === selected._id && el.__t == 'Athlete').map(asset => (
                        <WrapItem key={asset._id}>
                            <AthleteCard asset={asset} />
                        </WrapItem>
                    ))}
                </Wrap>
            </CandiModal>}
        </SimpleGrid>
    );
}

export default Standing;