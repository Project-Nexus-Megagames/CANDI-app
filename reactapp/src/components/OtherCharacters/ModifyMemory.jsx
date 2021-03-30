import React, { Component } from 'react';
import { Button, Divider, Drawer, FlexboxGrid, Toggle } from 'rsuite';
import socket from '../../socket';

class ModifyMemory extends Component {
	state = { 
		revealedFirst: false,
		triggerFirst: "",
		recallFirst: "",

		revealedSecond: false,
		triggerSecond: "",
		recallSecond: "",

		revealedThird: false,
		triggerThird: "",
		recallThird: ""
	 }

	componentDidMount = () => {
		if (this.props.character !== undefined && this.props.character.memories !== undefined ) {
			const { first, second, third } = this.props.character.memories;
			//console.log(this.props.memories);	
			this.setState({ 
				revealedFirst: first.revealed,
				triggerFirst:  first.trigger,
				recallFirst:   first.recall,
		
				revealedSecond: second.revealed,
				triggerSecond:  second.trigger,
				recallSecond:   second.recall,
		
				revealedThird: third.revealed,
				triggerThird:  third.trigger,
				recallThird:   third.recall,
			});
		}
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.character !== prevProps.character) {
			const { first, second, third } = this.props.character.memories;
			//console.log(this.props.memories);	
			this.setState({ 
				revealedFirst: first.revealed,
				triggerFirst:  first.trigger,
				recallFirst:   first.recall,
		
				revealedSecond: second.revealed,
				triggerSecond:  second.trigger,
				recallSecond:   second.recall,
		
				revealedThird: third.revealed,
				triggerThird:  third.trigger,
				recallThird:   third.recall,
			});
		}
	}

	handleSubmit = async () => {
		// 1) make a new memory
		const formValue = {
			memories: {
				first: {
					revealed: this.state.revealedFirst,
					trigger: this.state.triggerFirst,
					recall: this.state.recallFirst
				},
				second: {
					revealed: this.state.revealedSecond,
					trigger: this.state.triggerSecond,
					recall: this.state.recallSecond
				},
				third: {
					revealed: this.state.revealedThird,
					trigger: this.state.triggerThird,
					recall: this.state.recallThird
				},
			},
			id: this.props.character._id, 
	 }
	 socket.emit('characterRequest', 'memory', { data: formValue }); // new Socket event
	 this.props.closeModal();
	 }


	render() { 

		return ( 
			<Drawer
			show={this.props.show}
			onHide={() => this.props.closeModal()}>
				<Drawer.Body>
					<Divider style={{marginTop: '15px', marginBottom: '15px'}}>First Memory</Divider>
					<FlexboxGrid>
						<FlexboxGrid.Item colspan={12} >
							Trigger: <textarea value= {this.state.triggerFirst} style={textStyle} onChange={(event)=> this.setState({triggerFirst: event.target.value})}></textarea>	
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={2}>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item style={{ paddingTop: '25px' }} colspan={10} >
							<Toggle  size='lg' onChange={()=> this.setState({ revealedFirst: !this.state.revealedFirst })} checked={this.state.revealedFirst} checkedChildren="Revealed" unCheckedChildren="Hidden"></Toggle>
						</FlexboxGrid.Item>
					</FlexboxGrid>
					Memory Text
					<textarea rows='5' value={this.state.recallFirst} style={textStyle} onChange={(event)=> this.setState({recallFirst: event.target.value})}></textarea>	

					<Divider style={{marginTop: '15px', marginBottom: '15px'}}>Second Memory</Divider>
					<FlexboxGrid>
						<FlexboxGrid.Item colspan={12} >
							Trigger: <textarea value= {this.state.triggerSecond} style={textStyle} onChange={(event)=> this.setState({triggerSecond: event.target.value})}></textarea>	
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={2}>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item style={{ paddingTop: '25px' }} colspan={10} >
							<Toggle  size='lg' onChange={()=> this.setState({ revealedSecond: !this.state.revealedSecond })} checked={this.state.revealedSecond} checkedChildren="Revealed" unCheckedChildren="Hidden"></Toggle>
						</FlexboxGrid.Item>
					</FlexboxGrid>
						Memory Text
						<textarea rows='5' value={this.state.recallSecond} style={textStyle} onChange={(event)=> this.setState({recallSecond: event.target.value})}></textarea>	

					<Divider style={{marginTop: '15px', marginBottom: '15px'}}>Third Memory</Divider>
					<FlexboxGrid>
						<FlexboxGrid.Item colspan={12} >
							Trigger: <textarea value= {this.state.triggerThird} style={textStyle} onChange={(event)=> this.setState({triggerThird: event.target.value})}></textarea>	
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={2}>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item style={{ paddingTop: '25px' }} colspan={10} >
							<Toggle  size='lg' onChange={()=> this.setState({ revealedThird: !this.state.revealedThird })} checked={this.state.revealedThird} checkedChildren="Revealed" unCheckedChildren="Hidden"></Toggle>
						</FlexboxGrid.Item>
					</FlexboxGrid>
						Memory Text
						<textarea rows='5' value={this.state.recallThird} style={textStyle} onChange={(event)=> this.setState({recallThird: event.target.value})}></textarea>	


				</Drawer.Body>
				<Drawer.Footer style={{ paddingBottom: '15px'}} >	<Button onClick={() => this.handleSubmit()} appearance="primary">Submit</Button> </Drawer.Footer>
			</Drawer>
		 );
	}
}

const textStyle = {
	backgroundColor: '#1a1d24', 
	border: '1.5px solid #3c3f43', 
	borderRadius: '5px', 
	width: '100%',
	padding: '5px',
	overflow: 'auto', 
	scrollbarWidth: 'none',
}
 
export default ModifyMemory;