import React from 'react';
import { Box, Button, ButtonGroup, Card, CardHeader, Center, Flex, HStack, IconButton, Input, Spacer, Stack, Tag, TagCloseButton, Text } from '@chakra-ui/react';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from '../Common/CandiWarning';
import { useSelector } from 'react-redux';
import { BsPencil } from 'react-icons/bs';
import { getFadedColor, populateThisAccount } from '../../scripts/frontend';
import TeamAvatar from '../Common/TeamAvatar';
import StatIcon from '../Assets/StatIcon';
import { CandiModal } from '../Common/CandiModal';
import SelectPicker from '../Common/SelectPicker';
import { Edit } from '@rsuite/icons';


const FacilityCard = (props) => {
    const {
        showButtons = false,
        width = '100%',
        compact,
        isOwned=false
    } = props;
    const [mode, setMode] = useState(false);
    const [specialRound, setSpecialRound] = useState(false);
    const [editName, setEditName] = useState(false);
    const { athleteStats } = useSelector(s => s.gameConfig);
    const [overflow, setOverflow] = useState(false);

    const control = useSelector(state => state.auth.control);
    const teams = useSelector(state => state.teams.list);
    const facilitys = useSelector(state => state.facilities.list);

    const editRound = async () => {
        socket.emit('request', {
            route: 'facility',
            action: 'editRound',
            data: { facility: facility._id, specialRound }
        });
    };

    const editFacilityName = async () => {
        socket.emit('request', {
            route: 'facility',
            action: 'name',
            data: { facility: facility._id, name: editName }
        });
    };

    const facility = props.facility?._id ? props.facility : facilitys.find(el => el._id === props.facility)
    const disabled = false;

    if (facility)
        return (
            <div
                style={{ textAlign: 'center', width: width }}
            // onClick={() => (handleSelect && !disabled) ? handleSelect(facility) : console.log((handleSelect && !disabled))}
            >
                <Card
                    key={facility._id}
                    style={{
                        border: `3px solid ${getFadedColor('facility')}`,
                    }}
                >
                        <Flex align={'center'} overflow='hidden' width='100%'>
                            <Spacer />

                            <Stack>
                                <TeamAvatar size={compact ? 'xs' : 'md'} team={facility.teamOwner?._id} />

                                {showButtons && <ButtonGroup isAttached>
                                    {control &&
                                        <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'xs'} icon={<BsPencil />} />}
                                    {/* <Button onClick={() => setShow(!show)} >{!show ? "Show Stats" : "Hide Stats"}</Button> */}
                                </ButtonGroup>}
                            </Stack>

                            <div style={{ borderRadius: '10px', border: `2px solid ${getFadedColor(facility.type)}`, padding: '5px' }} display="flex"  >
                                <Center >
                                    <Box textAlign={'left'} marginLeft={'5px'} >
                                        <HStack marginBottom={'3px'} >
                                            <Text as='u' fontSize={compact ? 'sm' :'lg'} casing={'capitalize'} >{facility.name}</Text>
                                            {isOwned && <IconButton size={'xs'} variant={'outline'} icon={<Edit />} onClick={() => setEditName(facility.name)} />}
                                        </HStack>
                                    </Box>
                                </Center>
                            </div>

                            <Spacer />

                        </Flex>

                    {facility?.specialRounds.map((round) => (
                        <Tag border={`2px solid ${getFadedColor(round.primaryStat)}`} backgroundColor={getFadedColor(round.primaryStat, 0.5)} key={round._id} colorScheme='green' variant={'solid'} >
                            <StatIcon stat={athleteStats.find(el => el.code === round.primaryStat)} compact />
                            <StatIcon stat={athleteStats.find(el => el.code === round.secondaryStat)} compact />
                            {round.name}
                            {isOwned && <IconButton size={'xs'} variant={'outline'} icon={<Edit />} onClick={() => setSpecialRound(round)} />}
                        </Tag>))}

                </Card>

                {specialRound && <CandiModal
                    onClose={() => { setSpecialRound(false); }}
                    open={specialRound}
                    title={`Edit ${specialRound.name}`}
                >
                    <Input
                        onChange={(e) => setSpecialRound({ ...specialRound, name: e.target.value })}
                        value={props.filter}
                        placeholder={specialRound.name}
                        color='white'
                    />
                    <SelectPicker
                        data={athleteStats}
                        label="code"
                        valueKey="code"
                        onChange={(change) => setSpecialRound({ ...specialRound, primaryStat: change })}
                        placeholder={specialRound.primaryStat}
                        value={specialRound.primaryStat}
                    />
                    <SelectPicker
                        data={athleteStats}
                        label="code"
                        valueKey="code"
                        onChange={(change) => setSpecialRound({ ...specialRound, secondaryStat: change })}
                        placeholder={specialRound.secondaryStat}
                        value={specialRound.secondaryStat}
                    />

                    <Button onClick={editRound} > Submit

                    </Button>
                </CandiModal>}

                {editName && <CandiModal
                    onClose={() => { setEditName(false); }}
                    open={editName}
                    title={`Edit ${editName}`}
                >
                    <Input
                        onChange={(e) => setEditName(e.target.value)}
                        value={props.filter}
                        placeholder={editName}
                        color='white'
                    />

                    <Button onClick={editFacilityName}>Submit</Button>
                </CandiModal>}

            </div>
        );
    return (
        <b>Cannot Render Facility</b>
    )
}

export default (FacilityCard);