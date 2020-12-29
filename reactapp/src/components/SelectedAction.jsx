import React, { Component } from 'react';
import { Container, Sidebar, Input, Panel, PanelGroup, List, FlexboxGrid, Content, Tag, TagGroup } from 'rsuite';

class SelectedAction extends Component {
	state = {  }
	render() { 
		const action = this.props.action;
		return ( 
			<Content>
			<FlexboxGrid >
				<FlexboxGrid.Item colspan={4} >
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={16} >
					<Panel style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e"}}>
						<p style={slimText}>
							Description
						</p>
						<p>
							{action.description}	
						</p>
						<p style={slimText}>
							Intent
						</p>
						<p>
							{action.intent}	
						</p>
					</Panel>
					{action.status.complete &&
						<Panel style={{backgroundColor: "#61342e"}}>

						</Panel>
					}

				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={4}>

				</FlexboxGrid.Item>
			</FlexboxGrid>	
		</Content>		
		 );
	}
}

const slimText = {
  fontSize: '0.866em',
  color: '#97969B',
	fontWeight: 'lighter',
	whiteSpace: 'nowrap',
};
 
export default SelectedAction;