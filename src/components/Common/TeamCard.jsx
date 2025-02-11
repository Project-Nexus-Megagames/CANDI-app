import { CopyIcon } from '@chakra-ui/icons';
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Button, Flex, Hide, Spacer, useToast } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from './ResourceNugget';
import { getFadedColor } from '../../scripts/frontend';

const TeamCard = (props) => {
    const { team, handleSelect, selected } = props;
    const myCharacter = useSelector(state => state.auth.myCharacter);
    const characters = useSelector(state => state.characters.list);
    const toast = useToast();

    if (team)
    return (
        <Flex align={'center'} width={'100%'} onClick={() => handleSelect(team)} backgroundColor={getFadedColor(team.code, 0.5)} >
            <Box flex={1}>
                <Avatar size={'md'} bg={getFadedColor(team.code)} name={team.name} src={`/images/team/${team.code}.png`}>
                </Avatar>
            </Box>
            <Box
                flex={8}
                className="styleCenter"
                style={{
                    flexDirection: 'column',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                <h4>{team.name}</h4>

            </Box>


        </Flex>
    );
    return(<b>Error in Teamcard</b>)
};

export default TeamCard;
