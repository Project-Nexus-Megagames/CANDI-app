import { Avatar, Flex } from '@chakra-ui/react';
import React from 'react';
import ResourceNugget from '../Common/ResourceNugget';

const CharacterListItem = (props) => {
	const { character, setSelected, selected } = props;

	const listStyle = (item) => {
		if (selected && item._id === selected._id) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer' };
	};

	return (
			<Flex align="left" onClick={() => setSelected(character)} style={{ ...listStyle(character), whiteSpace: 'nowrap',}}>
				<div>
					<Avatar size="lg" src={character.profilePicture} alt="?" circle />
				</div>

				<div
					style={{
						...styleCenter,
						flexDirection: 'column',
						alignItems: 'flex-start',
						overflow: 'hidden'
					}}
				>
					<b style={titleStyle}>{character.characterName}</b>
					<b style={slimText}>
						{character.email} {'  '}						
					</b>
					<Flex style={{ display: 'flex', marginLeft: '0px', marginTop: '-1px' }}>
            {character.tags && character.tags.filter(el => el.toLowerCase() !== 'public').map((item) =>
             <ResourceNugget key={item._id} value={item} width={'50px'} height={'30'} />
             )}
          </Flex>
					
				</div>
			</Flex>
	);
};

const styleCenter = {
	display: 'flex',
	justifyContent: 'center',
};

const titleStyle = {
	whiteSpace: 'nowrap',
	fontWeight: 100,
	paddingBottom: 0,
	fontSize: 17,
	paddingLeft: 2,
	margin: -3
};

const slimText = {
	fontSize: '0.95em',
	color: '#97969B',
	fontWeight: 'lighter',
	paddingBottom: 2,
	paddingLeft: 2,
	whiteSpace: 'nowrap'
};

export default CharacterListItem;
