import React, { Component } from 'react';
import {List, FlexboxGrid, } from 'rsuite';

class ActionList extends Component {
	state = {  }

	listStyle (item) {
		if (item === this.state.selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429"})
		}
		else return({cursor: 'pointer'});
	}


	render() { 
		return ( 
			<List hover size="sm" style={{height: 575, overflow: 'auto', scrollbarWidth: 'none', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>
			{this.props.actions.map((action, index) => (
				<List.Item key={index} index={index} size={'sm'} onClick={()=>this.props.handleSelect(action)} style={this.listStyle(action)}>
				<FlexboxGrid>
					<FlexboxGrid.Item colspan={24} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
						<div style={titleStyle}>{action.description}</div>
					</FlexboxGrid.Item>
				</FlexboxGrid>
				</List.Item>
			))}
	</List>
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