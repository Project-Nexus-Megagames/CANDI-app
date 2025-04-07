import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTeamAccount } from '../../redux/entities/accounts';
import { Box, Center, Grid, GridItem, IconButton, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../Assets/MatchCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const MatchesCarosel = ({matches}) => {
    const navigate = useNavigate();
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, character} = useSelector(s => s.auth);
    const loading =  useSelector(s => s.gamestate.loading);
    const account = useSelector(getTeamAccount);
    
    const [index, setIndex] = useState(0);


    useEffect(() => {
        if(!login)
            navigate('/');
    }, [login, navigate])
        
    
    if (!login || !character || !team) return (<div />);	
    return ( 
        <Center height={'100%'} >
            <IconButton colorScheme='blue' variant={'solid'} icon={<ArrowLeftIcon/>} isDisabled={index <= 0} onClick={()=> setIndex(index-1)} />
            {matches[index] && <MatchCard match={matches[index]} />}
            <IconButton colorScheme='blue' variant={'solid'} icon={<ArrowRightIcon/>} isDisabled={index+1 === matches.length} onClick={()=> setIndex(index+1)} />
        </Center>
    );
}

export default (MatchesCarosel);