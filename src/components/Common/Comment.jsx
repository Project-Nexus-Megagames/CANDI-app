import React from 'react';
import { Box, Flex, Spacer } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { getFadedColor, getThisTeam, getTime } from '../../scripts/frontend';
import CharacterNugget from './CharacterNugget';
import ActionMarkdown from '../Actions/ActionList/Action/ActionMarkdown';

const Comment = (props) => {
  const { comment } = props;
  const teams = useSelector(s => s.teams.list);
  const team = getThisTeam(teams, comment?.commentor._id);
  const creator = comment?.commentor;
  const time = getTime(comment.createdAt);

  return (
    <div
      style={{
        border: (team) ? `3px solid ${team?.color}` : `3px solid ${getFadedColor(comment.model)}`,
        borderRadius: '5px',
        marginTop: '10px'
      }}>
      <Flex justify={'center'}
        style={{
          backgroundColor: (team.color) ? `${team?.color}` : `${getFadedColor(comment.model)}`,
        }} >

        <CharacterNugget character={comment?.commentor} />

        <Spacer />

        <Box
          alignItems='center'
          justifyContent='center'
        >
          <Box
            fontSize={'.9rem'}
            fontWeight={'normal'}
          >
            {creator.playerName} - {creator.characterName}

          </Box>
          <Box
            fontSize={'.9rem'}
            fontWeight={'normal'}
          >
            {time}
          </Box>
        </Box>

        <Spacer />

        {/* <Box marginLeft='auto'>
          <ActionButtons
            action={subObject}
            toggleEdit={() => setMode('edit' + subObject.model)}
            creator={creator}
            handleDelete={handleDelete}
          />
        </Box> */}

      </Flex>

      <ActionMarkdown
        fontSize="sm"
        markdown={comment.body}
      />

    </div>
  )
}

export default (Comment);