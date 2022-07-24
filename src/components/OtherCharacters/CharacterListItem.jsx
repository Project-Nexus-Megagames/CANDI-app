import React from 'react'
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon } from 'rsuite';

const CharacterListItem = (props) => {
  const { character, setSelected, selected } = props;

  const listStyle = (item) => {
		if (selected && item._id === selected._id) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer' };
	};


	const tagStyle = (item, index) => {
		switch (item) {
			case 'Control':
				return (
					<Tag index={index} style={{ color: 'black' }} color="orange">
						{item}
					</Tag>
				);
			case 'God':
				return (
					<Tag index={index} color="green">
						{item}
					</Tag>
				);
			case 'NPC':
				return (
					<Tag index={index} color="blue">
						{item}
					</Tag>
				);
			case 'PC':
				return (
					<Tag index={index} color="cyan">
						{item}
					</Tag>
				);
			default:
				return <Tag index={index}>{item}</Tag>;
		}
	};

  return (
    <div
    onClick={() => setSelected(character)}
    style={listStyle(character)}
  >
    <FlexboxGrid align="middle" >
      <FlexboxGrid.Item colspan={5}>
        <Avatar
          src={character.profilePicture}
          alt="?"
          circle
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item
        colspan={19}
        style={{
          ...styleCenter,
          flexDirection: 'column',
          alignItems: 'flex-start',
          overflow: 'hidden'
        }}
      >
        <b style={titleStyle}>
          {character.characterName}
        </b>
        <b style={slimText}>{character.email} {"  "}
        {character.tags &&
					character.tags.map((item, index) =>
						tagStyle(item, index)
					)}
        </b>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  </div>
  )
}

const styleCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '60px'
};

const titleStyle = {
	whiteSpace: 'nowrap',
	fontWeight: 100,
  fontSize: 16,
	paddingLeft: 2
};

const slimText = {
	fontSize: '0.966em',
	color: '#97969B',
	fontWeight: 'lighter',
	paddingBottom: 5,
	paddingLeft: 2,
	whiteSpace: 'nowrap'
};

export default CharacterListItem