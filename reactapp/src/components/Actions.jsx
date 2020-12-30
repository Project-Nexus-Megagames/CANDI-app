import React, { Component } from 'react';
import { Container, Sidebar, Input, Panel, PanelGroup, List, FlexboxGrid, Button } from 'rsuite';
import ActionList from './ActionList';
import NewAction from './NewAction';
import SelectedAction from './SelectedAction';
class Actions extends Component {
	state = { 
		selected: {},
		showNew: false
	 }

	 componentDidMount() {
		this.setState({ selected: null });
	}

	showNew = () => { 
		this.setState({showNew: true}) 
	};

	closeNew = () => { 
		this.setState({showNew: false}) 
	};

	handleSelect = (fuuuck) => {
		this.setState({ selected: fuuuck })
	}

	render() { 
		return ( 
			<Container>
			<Sidebar style={{backgroundColor: "black"}}>
				<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill >	
						<ActionList actions={this.props.actions} handleSelect={this.handleSelect}/>
					</Panel>
					<Panel style={{ backgroundColor: "#000101"}}>
						<Button appearance='primary' block onClick={() => this.showNew()}>New Action</Button>
					</Panel>						
				</PanelGroup>
			</Sidebar>
			{this.state.selected && <SelectedAction action={this.state.selected}/>}	
			{this.state.showNew && <NewAction
				show={this.state.showNew}
				showNew={this.showNew} 
				closeNew={this.closeNew}
				// player={this.props.player????}
			/>}
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
	},
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
]
 
export default Actions;