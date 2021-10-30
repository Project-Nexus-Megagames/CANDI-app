import React, { Component } from 'react';
import { connect } from 'react-redux';
import {List, FlexboxGrid, Container, Tag } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import { getMyActions, filteredActions, loadAllActions } from '../../redux/entities/playerActions';

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

	listStyle (item, index) {
		if (item === this.props.selected) return ({cursor: 'pointer', opacity: '0.6', backgroundColor: '#272b34', textAlign: "center", flexDirection: 'column', alignItems: 'center'})
		if (index === 1) return ({cursor: 'pointer', backgroundColor: '#161420', textAlign: "center", flexDirection: 'column', alignItems: 'center'})
		else return ({cursor: 'pointer', textAlign: "center", flexDirection: 'column', alignItems: 'center'});
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
					<div>
					<h5 style={{ backgroundColor: '#d4af37', color: 'black' }}>Round {round}</h5>
					{this.props.myCharacter.tags.some(el => el === 'Control') &&
						<List hover size="sm" >
							{/* <h5 >Control List</h5> */}
							{this.props.filteredActions.length === 0 && <h5 style={{ textAlign: 'center', marginTop: '40vh' }} >No Actions</h5>}
							{this.props.filteredActions.filter(action => action.round === round).sort((a, b) => { // sort the catagories alphabetically 
												if(a.creator.characterTitle < b.creator.characterTitle) { return -1; }
												if(a.creator.characterTitle > b.creator.characterTitle) { return 1; }
												return 0;
											}).map((action, index) => ( // .filter(el => el.round === round)
								<List.Item key={index} index={index} size={'sm'} onClick={()=>this.props.handleSelect(action)} style={this.listStyle(action, (index % 2))}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={24} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
											<div style={titleStyle}>{action.name}</div>
											<b style={slimText}>
												{action.creator.characterTitle} - 
												{action.results.length > 0 && action.results[0].ready && <Tag color='green'>R Ready</Tag>}
												{action.results.length > 0 && action.results[0].ready === false && <Tag color='orange'>R Draft</Tag>}
												</b>
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</List.Item>
							))}
						</List>}						

					{!this.props.myCharacter.tags.some(el => el === 'Control') && 
					<List hover size="sm" >
					{this.props.myActions.length === 0 && <h5 style={{ textAlign: 'center', marginTop: '40vh' }} >No Actions </h5>}
						{this.props.myActions.filter(action => action.round === round).map((action, index) => ( // .filter(el => el.round === round)
							<List.Item key={index} index={index} size={'sm'} onClick={()=>this.props.handleSelect(action)} style={this.listStyle(action, (index % 2))}>
								<FlexboxGrid>
									<FlexboxGrid.Item colspan={24} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
										<div style={titleStyle}>{action.name}</div>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						))}
					</List>	}			
					</div>					
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

const slimText = {	
	fontSize: '0.966em',
	color: '#97969B',
	fontWeight: 'lighter',
	paddingBottom: 5,
	paddingLeft: 2, 
	whiteSpace: 'nowrap',
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	myCharacter: state.auth.user ? getMyCharacter(state): undefined,

	myActions: getMyActions(state),
	filteredActions: filteredActions(state)

});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);