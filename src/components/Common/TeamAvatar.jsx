import { Avatar, AvatarBadge, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getThisTeam } from '../../scripts/frontend';

const TeamAvatar = (props) => {
	const { account, online, badge, size, character } = props;
	const teams = useSelector(s => s.teams.list);  
	const accounts = useSelector(s => s.accounts.list);

  let team;
  if (props.team) team = props.team;
  if (account && !team) {
    let acc = accounts.find(el => el._id === account);
    team = acc?.team;
  }
  if (character && !team) {
    team = getThisTeam(teams, character);
  }

  if (team?._id === undefined) team = teams.find(el => el._id === team) 


  if (team)
	return (
    <Tooltip openDelay={200} hasArrow placement='top' label={<div>
      <p color='black' >{team.name}</p>
      </div>}>
        <Avatar size={size ? size : 'md'} bg={getFadedColor(team.code)} name={team.name} src={`/images/team/${team.code}.png`}>
          {badge && <AvatarBadge boxSize='1.25em' bg={online ? 'green.500' : '#d4af37'} />}
        </Avatar>
    </Tooltip>
	);
  else {
    console.log(props.team)
    return (<b>oops team avatar broke</b>)
  }
};

export default TeamAvatar;
