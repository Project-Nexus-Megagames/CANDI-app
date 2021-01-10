import React, { Component } from 'react';
import {List, FlexboxGrid, Container, } from 'rsuite';

class ActionList extends Component {
	state = { 
		rounds: []
	 }

	 componentDidMount = async () => {
		 try {
			const rounds = [];
			for (const action of this.props.actions) {
				if (!rounds.some(el => el === action.round)) rounds.push(action.round);
				console.log(`action.round: ${action.round} rounds: ${rounds}`)
			}
			rounds.reverse();
			this.setState({ rounds });
		 }
		 catch (err) {
			 console.log(err);
		 }
		}

		componentDidUpdate = (prevProps) => {
			if (this.props.actions !== prevProps.actions) {
				this.createListCatagories();
			}
		}

	listStyle (item) {
		if (item === this.state.selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429"})
		}
		else return({cursor: 'pointer'});
	}

	createListCatagories = () => {
		const rounds = [];
		for (const action of this.props.actions) {
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
						{this.props.actions.filter(el => el.round === round).map((action, index) => (
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


export default ActionList;