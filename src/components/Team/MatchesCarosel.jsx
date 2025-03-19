import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTeamAccount } from '../../redux/entities/accounts';
import { Box, Grid, GridItem, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../Assets/MatchCard';

const MatchesCarosel = ({matches}) => {
    const navigate = useNavigate();
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, character} = useSelector(s => s.auth);
    const loading =  useSelector(s => s.gamestate.loading);
    const account = useSelector(getTeamAccount);
    


    const [levels, setLevels] = React.useState([]);

    useEffect(() => {
        if(!login)
            navigate('/');
    }, [login, navigate])
        
    
    if (!login || !character || !team) return (<div />);	
    return ( 
        <Stack>
            {matches.map((match, index) => (
                <MatchCard match={match} key={index} />
            ))}
        </Stack>
    );
}

export default (MatchesCarosel);