import React from 'react';
import { FlexboxGrid, Avatar, Tag, TagGroup } from 'rsuite';
import ResourceNugget from '../Common/ResourceNugget';

const CharacterListItem = (props) => {
	const { character, setSelected, selected } = props;

	const listStyle = (item) => {
		if (selected && item._id === selected._id) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer' };
	};

	const tagStyle = (item, index) => {
		return(
			<ResourceNugget value={item} width={'50px'} height={'30'} />
		)
		// switch (item) {
		// 	case 'Control':
		// 		return (
		// 			<Tag index={index} style={{ color: 'black' }} key={index} color="orange">
		// 				{item}
		// 			</Tag>
		// 		);
		// 	case 'God':
		// 		return (
		// 			<Tag index={index} key={index} color="green">
		// 				{item}
		// 			</Tag>
		// 		);
		// 	case 'NPC':
		// 		return (
		// 			<Tag index={index} key={index} color="blue">
		// 				{item}
		// 			</Tag>
		// 		);
		// 	case 'PC':
		// 		return (
		// 			<Tag index={index} key={index} color="cyan">
		// 				{item}
		// 			</Tag>
		// 		);
		// 	case 'Public':
		// 		return (
		// 			<Tag style={{ color: 'black' }} index={index} color="green">
		// 				{item}
		// 			</Tag>
		// 		);
		// 	default:
		// 		return (
		// 			<Tag index={index} key={index}>
		// 				{item}
		// 			</Tag>
		// 		);
		// }
	};

	return (
			<FlexboxGrid align="middle" onClick={() => setSelected(character)} style={{ ...listStyle(character), whiteSpace: 'nowrap',}}>
				<FlexboxGrid.Item colspan={7}>
					<Avatar size="lg" src={character.profilePicture} alt="?" circle />
				</FlexboxGrid.Item>
				<FlexboxGrid.Item
					colspan={17}
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
					<TagGroup style={{ display: 'flex', marginLeft: '0px', marginTop: '-1px' }}>{character.tags && character.tags.filter(el => el.toLowerCase() !== 'public').map((item, index) => tagStyle(item, index))}</TagGroup>
					
				</FlexboxGrid.Item>
			</FlexboxGrid>
	);
};

const styleCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
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
