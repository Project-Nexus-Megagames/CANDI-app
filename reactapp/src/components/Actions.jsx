import axios from 'axios';
import React, { Component } from 'react';
import { Container, Sidebar, Input, Panel, PanelGroup, List, FlexboxGrid, Content, Button } from 'rsuite';
import { gameServer } from '../config';
import NewAction from './NewAction';

class Actions extends Component {
	state = { 
		selected: {},
		showNew: false
	 }

	 componentDidMount() {
		this.setState({ selected: null });
	}

	listStyle (item) {
		if (item === this.state.selected) {
			return ({backgroundColor: "#212429"})
		}
	}

	showNew = () => { 
		this.setState({showNew: true}) 
		console.log(this.state.showNew)	
	};

	closeNew = () => { 
		this.setState({showNew: false}) 
	};


	render() { 
		return ( 
			<Container>
			<Sidebar style={{backgroundColor: "black"}}>
				<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Button appearance='primary' block onClick={() => this.showNew()}>New Action</Button>
						<br></br>
						<Input placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill >	
						<List hover size="sm" style={{maxHeight: 650, overflow: 'auto'}}>
								{actions.map((action, index) => (
									<List.Item key={index} index={index} size={'sm'} onClick={() => this.setState({ selected: action })} style={this.listStyle(action)}>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={24} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
											<div style={titleStyle}>{action.summary}</div>
											<div style={slimText}>{action.outcome.text}</div>
										</FlexboxGrid.Item>
									</FlexboxGrid>
									</List.Item>
								))}
						</List>	
					</Panel>						
				</PanelGroup>
			</Sidebar>
			{this.state.selected && 
					<Content>
						<FlexboxGrid >
							<FlexboxGrid.Item colspan={4} >
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={16} >
								<Panel style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e"}}>
									<p>
										Description
									</p>
									<p>
										{this.state.selected.summary}	
									</p>
									<p>
										Intent
									</p>
									<p>
										{this.state.selected.intent}	
									</p>
									<p>
										Outcome
									</p>
									<p>
										{this.state.selected.outcome}	
									</p>
								</Panel>
							</FlexboxGrid.Item>
						</FlexboxGrid>	
					</Content>			
					}	
					{this.state.showNew && <NewAction
						show={this.state.showNew}
						showNew={this.showNew} 
						closeNew={this.closeNew}
						// player={this.props.player????}
					/>

					}
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
  fontSize: '0.866em',
  color: '#97969B',
	fontWeight: 'lighter',
	whiteSpace: 'nowrap',
	paddingLeft: 5,
  paddingBottom: 5
};


const actions = [
	{
		summary: "Call me Jonah. My parents did, or nearly did. They called me John.",
		intent: "Jonah – John - if I had been a Sam, I would have been a Jonah still, not because I have been unlucky for others, but because somebody or something has compelled me to be certain places at certain times, without fail.",
		location: "Underworld",
		approach: "Clocks",
		traits: [

		],
		assets: [

		],
		outcome: "Conveyances and motives, both conventional and bizarre, have been provided. And, according to plan, at each appointed second, at each appointed place this Jonah was there.      Listen:  When I was a younger man--two wives ago, 250,000 cigarettes ago, 3,000 quarts of booze ago.      When I was a much younger man, I began to collect material for a book to be called The Day the World Ended.      The book was to be factual.      The book was to be an account of what important Americans had done on the day when the first atomic bomb was dropped on Hiroshima, Japan.",
	},
	{
		summary: " It was to be a Christian book. I was a Christian then.      I am a Bokononist now.",
		intent: " would have been a Bokononist then, if there had been anyone to teach me the bittersweet lies of Bokonon.",
		location: "Underworld",
		approach: "Clocks",
		traits: [

		],
		assets: [

		],
		outcome: "Conveyances and motives, both conventional and bizarre, have been provided. And, according to plan, at each appointed second, at each appointed place this Jonah was there.      Listen:  When I was a younger man--two wives ago, 250,000 cigarettes ago, 3,000 quarts of booze ago.      When I was a much younger man, I began to collect material for a book to be called The Day the World Ended.      The book was to be factual.      The book was to be an account of what important Americans had done on the day when the first atomic bomb was dropped on Hiroshima, Japan.",
	}
]
 
export default Actions;