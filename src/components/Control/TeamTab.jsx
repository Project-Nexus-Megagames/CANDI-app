import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Flex, Grid, GridItem, IconButton, Input, InputGroup, InputLeftElement, Tooltip, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import CharacterListItem from '../OtherCharacters/CharacterListItem';
import DynamicForm from './DynamicForm';
import AssetCard from '../Common/AssetCard';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import TeamForm from './TeamForm';
import socket from '../../socket';

const TeamTab = (props) => {
	const teams = useSelector(s => s.teams.list);
	const { login, team, character} = useSelector(s => s.auth);
	const loading =  useSelector(s => s.gamestate.loading);
  const [renderTags, setRenderTags] = useState([]); // TODO: update with Faction tags
	const [selected, setSelected] = useState(undefined);
	const [fil, setFilter] = useState('');
	const [mode, setMode] = useState(false);

  const handleSubmit = async (data) => {
    socket.emit('request', { route: 'team', action: 'create', data });
  };



	return ( 
		<Grid
        templateAreas={`"nav main"`}
        gridTemplateColumns={ '400px 1fr'}
        height={"5vh"}
        bg='blue'
        gap='1'
        fontWeight='bold'>

			<GridItem pl='2' bg='#0f131a' area={'nav'} style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }} >
      <Flex align={'center'} >
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
            >
              <SearchIcon />
            </InputLeftElement>
            <Input
              onChange={setFilter}
              value={fil}
              placeholder="Search"
              color='white'
            />
          </InputGroup>
          {<Tooltip
            label='Add New Character'
            aria-label='a tooltip'
          >
            <IconButton
              variant={'solid'}
              icon={<AddIcon />}
              onClick={() => setMode('new')}
              colorScheme={'green'}
              style={{
                marginLeft: '1rem'
              }}
              aria-label='Add New Team'
            />
          </Tooltip>}
        </Flex>

        {teams.map(team => 
          <Box key={team._id}>
            {team.name}
          </Box>
          )}
			</GridItem>

			<GridItem pl='2' bg='#0f131a' area={'main'} >
				
				<Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}> 
          {selected && <DynamicForm selected={selected} background={111} /> }
          {mode == 'new' && <TeamForm handleSubmit={handleSubmit} closeNew={() => setMode((false))} />}
				</Box>

			</GridItem>
		</Grid>
	);
}

export default (TeamTab);