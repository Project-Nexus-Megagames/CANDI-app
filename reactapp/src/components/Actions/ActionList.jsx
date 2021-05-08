import React, { Component } from 'react';
import { connect } from 'react-redux';
import {List, FlexboxGrid, Container, } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import { filteredActions } from '../../redux/entities/playerActions';

class ActionList extends Component {
	state = { 
		rounds: []
	}

	componentDidMount = async () => {
		try {
			this.createListCatagories();
		}
		catch (err) {
			console.log(err);
		}
		}

		componentDidUpdate = (prevProps) => {
			if (this.props.filteredActions !== prevProps.filteredActions) {
				this.createListCatagories();
			}
		}

	listStyle (item) {
		if (item.type === "Project") {
			return ({cursor: 'pointer', backgroundColor: "#274472", textAlign: "center", flexDirection: 'column', alignItems: 'center'})
		}
		else if (item.type === "Feed") {
			return ({cursor: 'pointer', backgroundColor: "#880015", textAlign: "center", flexDirection: 'column', alignItems: 'center'})
		}
		else if (item === this.props.selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429"})
		}
		else return({cursor: 'pointer'});
	}

	createListCatagories = () => {
		const rounds = [];
		for (const action of this.props.filteredActions) {
			if (!rounds.some(el => el === action.round)) rounds.push(action.round);
		}
		rounds.reverse();
		this.setState({ rounds });
	}

	render() { 
		return ( 
			<Container>
				{this.state.rounds.map((round, index) => (
					<React.Fragment key={index}>
					<h6 style={{backgroundColor: "#61342e"}}>Round {round}</h6>	
					<List key={index} hover size="sm" >
						{this.props.filteredActions.filter(el => el.round === round).map((action, index) => (
							<List.Item key={index} index={index} size={'sm'} onClick={()=>this.props.handleSelect(action)} style={this.listStyle(action)}>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={24} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
										<div style={titleStyle}>{action.description}</div>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						))}
					</List>								
					</React.Fragment>

				))}		
			</Container>
		 );
	}
}
 
const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px'
};
const titleStyle = {
	paddingBottom: 5,
	paddingLeft: 5,
  whiteSpace: 'nowrap',
  fontWeight: 500
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	myCharacter: state.auth.user ? getMyCharacter(state): undefined,
	filteredActions: filteredActions(state)//state.auth.control ? filteredActions(state) : 	getMyActions(state) 
});

const mapDispatchToProps = (dispatch) => ({
  // handleLogin: (data) => dispatch(loginUser(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);