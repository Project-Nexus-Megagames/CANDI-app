import React, { useEffect } from 'react';
import { Grid, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, Table, Divider} from 'rsuite';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect, useSelector } from 'react-redux';
import NavigationBar from '../Navigation/NavigationBar';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const  CharacterStats = (props) => {
	const config = useSelector((state) => state.gameConfig);
	const gamestate = useSelector((state) => state.gamestate);
	const [copy, setCopy] = React.useState([]);
	const [number, setNumber] = React.useState(3);

	
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}
	else return ( 
		
		<React.Fragment>
			<NavigationBar/>
				<h3>Leaderboard</h3>
				{props.control && <Button onClick={() => setNumber(number === 3 ? 100 : 3)}>Show All</Button>}
        <Divider>Global Stats</Divider>
        {gamestate.globalStats.map((stat, index) => (
          <Col key={index} xs={24/gamestate.globalStats.length} sm={24/gamestate.globalStats.length} md={24/gamestate.globalStats.length} className="gridbox">
            <div  style={{ border: `3px solid ${getFadedColor(stat.type)}`, borderRadius: '5px', width: '100%', }} >
              <h5 style={{ backgroundColor: getFadedColor(stat.type), color: 'black' }}>{stat.type} ~ {stat.statAmount}</h5>
            </div>
          </Col>
        ))}
        <Divider>Character Stats</Divider>
        {config.characterStats.map((stat, index) => (
          <Col key={index} xs={8} sm={8} md={8} className="gridbox">
            <div  style={{ border: `3px solid ${getFadedColor(stat.type)}`, borderRadius: '5px', width: '100%', }} >
              <h5 style={{ backgroundColor: getFadedColor(stat.type), color: getTextColor(stat.type) }}>{stat.type}</h5>
              <List hover size="sm">
                {props.characters.filter(el => el.tags.some(tag => tag.toLowerCase() === 'pc')).sort(function(a, b){return b[stat.type] - a[stat.type]}).splice(0, number).map((character, index) => (
                <List.Item key={index} index={index}>
                <FlexboxGrid>
                  <FlexboxGrid.Item colspan={2}>
                    <b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={20}>
                    {character.characterName} ({character.characterTitle})
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={2}>
                    {<div>
                      {character.characterStats.find(el => el.type === stat.type)?.statAmount}
                      </div>}
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </List.Item>
              ))}
              </List>
            </div>
          </Col>
        ))}



		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	control: state.auth.character ? state.auth.character.tags.some((el) => el.toLowerCase() === 'control') : state.auth.control,
	user: state.auth.user,
	gamestate: state.gamestate,
	assets: state.assets.list,
	login: state.auth.login,
	characters: state.characters.list,
	duck: state.gamestate.duck,
	mortalBonds: getMortalBonds(state),
	godBonds: getGodBonds(state),
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterStats);
