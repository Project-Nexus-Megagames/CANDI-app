import React from 'react'
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon } from 'rsuite';

const CharacterListItem = (props) => {
  const { character, setSelected, selected } = props;

  const listStyle = (item) => {
		if (item === selected) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer' };
	};


	const tagStyle = (item, index) => {
		console.log(item)
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
    <List.Item
    onClick={() => setSelected(character)}
    style={listStyle(character)}
  >
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={5}>
        <Avatar
          src={
            character.tags.some((el) => el === 'Control')
              ? `/images/GW_Control_Icon.png`
              : `/images/${character.characterName}.jpg`
          }
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
						{character.tags &&
							character.tags.map((item, index) =>
								tagStyle(item, index)
							)}
        </b>
        <b style={slimText}>{character.email}</b>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  </List.Item>
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
	fontWeight: 500,
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