import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlexboxGrid, Loader, Panel, IconButton, Icon, Form, FormGroup, Button, ButtonToolbar, FormControl, ControlLabel, Divider, Content, Affix, Tag, Modal, Drawer, SelectPicker, Placeholder, Alert } from 'rsuite';
import { gameServer } from '../../config';
import { getMyCharacter } from '../../redux/entities/characters';
import { assetLent, assetUpdated } from '../../redux/entities/assets'

class MyCharacter extends Component {
	state = { 
		formValue: {
      textarea: ''
    },
		memory: '',
		show: false,
		lending: null,
		target: null,
		characters: null,
		lendShow: false,
		unlend: false, // boolean for displaying the "unlend" modal
		unleanding: null // what is being "Unlent"
	 }

	 componentDidMount = () => {
		const char = this.props.myCharacter;
		// console.log(this.props.character)
		if (char !== undefined) {
		 const formValue = {
			textarea: char.standingOrders,
		 }
		 const characters = {...this.props.characters}
		 this.setState({ formValue, characters });			 
		}
	}

	/*componentDidUpdate = (prevProps) => {
	 if (this.props.playerCharacter !== prevProps.playerCharacter) {
		 const char = this.props.playerCharacter;
		 const formValue = {
			textarea: char.standingOrders,
		}
	 this.setState({ formValue });		
	 }
	}*/

	openAnvil (url) {
		const win = window.open(url, '_blank');
		win.focus();
	}

	showMemory = (memory) => {
		this.setState({ memory, show: true });
	}

	openLend = (lending) => { 
		this.setState({ lending, lendShow: true });
	}

	closeLend = () => {
		this.setState({ lendShow: false });
	}

	openUnlend = (unleanding) => { 
		this.setState({ unleanding, unlend: true });
	}


	render(){ 
		const playerCharacter = this.props.myCharacter;
		if (!this.props.login) {
			this.props.history.push('/');
			return (<Loader inverse center content="doot..." />)
		};
		return ( 
			<Content style={{overflow: 'auto', height: 'calc(100vh - 100px)'}}>
			<Panel>
				<FlexboxGrid justify="start" style={{textAlign: 'left'}}>
					<FlexboxGrid.Item key={1} colspan={6}>
							<img
								src={`/images/${playerCharacter.characterName}.jpg`} alt='Unable to load img' width="95%" height="320" 
							/>	
						<Divider style={{ width: "95%" }} >Wealth</Divider>
						<Panel style={{backgroundColor: "#bfb606", textAlign: 'center', width: '95%', }} shaded bordered >
							<h4 style={{color: 'black'}} >{playerCharacter.wealth.description}</h4>
							<b style={{color: 'black'}} >Uses: {playerCharacter.wealth.uses}</b>
							<FlexboxGrid>
								<FlexboxGrid.Item style={{textAlign: 'left'}} colspan={20}>{playerCharacter.wealth.status.lent && <b style={{color: 'black', fontSize: '1.35em',}}>Wealth lent to: '{playerCharacter.wealth.currentHolder}'</b>}</FlexboxGrid.Item>
								<FlexboxGrid.Item colspan={4}> 
									{!playerCharacter.wealth.status.lent &&  <Button onClick={() => this.openLend(playerCharacter.wealth)} color='blue' size='sm' >Lend</Button>}
									{playerCharacter.wealth.status.lent && <Button onClick={() => this.openUnlend(playerCharacter.wealth)} color='blue' size='sm' >Un-Lend</Button>}	
								</FlexboxGrid.Item>
							</FlexboxGrid>

						</Panel>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item key={2} colspan={12} >
						<Panel style={{width: '95%', height: 'calc(50vh)'}}>
							<p>
								<b>{playerCharacter.characterName}</b> {playerCharacter.tag}
							</p>
							<p>
								<b>World Anvil Link 				<IconButton onClick={()=> this.openAnvil(playerCharacter.worldAnvil)} icon={<Icon icon="link"/>} appearance="primary"/></b>
							</p>
							<p>
								<b>Bio:</b> {playerCharacter.bio}
							</p>
							<Divider>Memory Triggers</Divider>
							<p>
								<b>1st) </b> {playerCharacter.memories.first.trigger}
							</p>
								{playerCharacter.memories.first.revealed && <Button onClick={() => this.showMemory(playerCharacter.memories.first)} appearance="subtle">View Memory</Button>}
								<Divider style={{marginTop: '10px', marginBottom: '10px'}}></Divider>
							<p>
								<b>2nd) </b> {playerCharacter.memories.second.trigger}
							</p>
							{playerCharacter.memories.second.revealed && <Button onClick={() => this.showMemory(playerCharacter.memories.second)} appearance="subtle">View Memory</Button>}
							<Divider style={{marginTop: '10px', marginBottom: '10px'}}></Divider>
							<p>
								<b>3rd) </b> {playerCharacter.memories.third.trigger}
							</p>
							{playerCharacter.memories.third.revealed && <Button onClick={() => this.showMemory(playerCharacter.memories.third)} appearance="subtle">View Memory</Button>}
							<Divider style={{marginTop: '10px', marginBottom: '10px'}}></Divider>						
						</Panel>
						<Panel header="Standing Orders" bordered style={{width: '95%'}}>
							<Form fluid formValue={this.state.formValue} onChange={(value) => this.setState({ formValue: value })}>
							<FormGroup>
								<ControlLabel></ControlLabel>
								<FormControl name="textarea" componentClass="textarea" placeholder="Orders for if you miss a turn..."/>
							</FormGroup>
							<FormGroup>
								<ButtonToolbar>
									<Button appearance="primary" onClick={() => this.handleStanding()} >Submit</Button>
								</ButtonToolbar>
							</FormGroup>
							</Form>
						</Panel>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item key={3} colspan={6} >
						<Divider style={{marginTop: '5px', marginBottom: '0px'}} >Traits</Divider>
							{playerCharacter.traits.map((trait, index) => (
								<div key={index} style={{paddingTop: '10px'}}>
								{trait.uses > 0 && <React.Fragment>
										{/*<Affix>
											{trait.status.lent && this.rednerHolder(trait)}
											{!trait.status.lent && <Tag color='green' >Ready</Tag>}
										</Affix>*/}
										<Panel style={{backgroundColor: "#1a1d24"}} shaded header={trait.name} bordered collapsible>
											<FlexboxGrid>
												<FlexboxGrid.Item colspan={20}>
													<p>{trait.description}</p>												
												</FlexboxGrid.Item>
												{/*<FlexboxGrid.Item style={{ textAlign: 'center' }} colspan={4}>
													{!trait.status.lent &&  <Button onClick={() => this.openLend(trait)} appearance="ghost" size='sm' >Lend</Button>}
													{trait.status.lent && <Button onClick={() => this.openUnlend(trait)} appearance="ghost" size='sm' >Un-Lend</Button>}								
								</FlexboxGrid.Item>*/}
											</FlexboxGrid>
										{trait.uses !== 999 &&	
										<p>
											Uses: {trait.uses}
										</p>}
										</Panel>									
									</React.Fragment>}							
								</div>							
							))}
						<Divider style={{marginTop: '15px', marginBottom: '0px'}}>Assets</Divider>
							{playerCharacter.assets.map((asset, index) => (
								<div key={index} style={{paddingTop: '10px'}}>
								{asset.uses > 0 && <React.Fragment>
									<Affix>
										{asset.status.lent && this.rednerHolder(asset)}
										{!asset.status.lent && <Tag color='green' >Ready</Tag>}
									</Affix>
									<Panel style={{backgroundColor: "#1a1d24"}} shaded header={asset.name} bordered collapsible>
										<FlexboxGrid>
											<FlexboxGrid.Item colspan={20}>
												<p>{asset.description}</p>												
											</FlexboxGrid.Item>
											<FlexboxGrid.Item style={{ textAlign: 'center' }} colspan={4}>
												{!asset.status.lent &&  <Button onClick={() => this.openLend(asset)} appearance="ghost" size='sm' >Lend</Button>}
												{asset.status.lent && <Button onClick={() => this.openUnlend(asset)} appearance="ghost" size='sm' >Un-Lend</Button>}													
											</FlexboxGrid.Item>
										</FlexboxGrid>
										{asset.uses !== 999 &&	
										<p>
											Uses: {asset.uses}
										</p>}
									</Panel>									
								</React.Fragment>}								
								</div>
							))}
						<Divider style={{marginTop: '15px', marginBottom: '0px'}}>Borrowed Assets</Divider>
							{playerCharacter.lentAssets.map((borrowed, index) => (
								<div key={index} style={{paddingTop: '10px'}}>
								<Affix>
									{borrowed.status.lent && this.findOwner(borrowed._id)}
								</Affix>
								<Panel style={{backgroundColor: "#1a1d24"}} shaded header={borrowed.name} bordered collapsible>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={18}>
											<p>{borrowed.description}</p>
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={6}>
										</FlexboxGrid.Item>
									</FlexboxGrid>

								</Panel>									
								</div>
							))}
					</FlexboxGrid.Item>
				</FlexboxGrid>
			</Panel>
				
			<Modal 
				size='md'
				show={this.state.show}
				onHide={() => this.setState({ show: false })}>
					<b>{this.state.memory.trigger}</b>
					<p>
						{this.state.memory.recall}
					</p>
			</Modal>

			<Modal backdrop="static"
			size='sm'
			show={this.state.unlend}
			onHide={() => this.setState({ unlend: false, unleanding: null })}>
				{this.state.unleanding && 
					<React.Fragment>
						<Modal.Body>
							{this.renderUnLendation()}
						</Modal.Body>	
						<Modal.Footer>
							<Button onClick={() => this.handleTakeback()} appearance="primary">
								Take it Back!
							</Button>
							<Button onClick={() => this.setState({ unlend: false, unleanding: null })} appearance="subtle">
								Cancel
							</Button>
						</Modal.Footer>											
					</React.Fragment>
				}
			</Modal>

			<Drawer
			show={this.state.lendShow}
			onHide={() => this.closeLend()}>
				<Drawer.Body>
					<SelectPicker placeholder="Select a Lending Target" onChange={(event) => this.setState({ target: event })} block valueKey='_id' labelKey='characterName' disabledItemValues={[playerCharacter._id]} data={this.props.characters}/>					
					{this.renderLendation()}
				</Drawer.Body>
			</Drawer>
		</Content>
		);
	}

	rednerHolder = (asset) => {
		const holder = this.props.characters.find(el => el.lentAssets.some(el2=> el2._id === asset._id));
		return (<Tag color='violet' >Lent to: {holder.characterName}</Tag>)
	}

	findOwner = (id) => {
		for (const character of this.props.characters) {
			if (character.assets.some(el => el._id === id) || character.traits.some(el => el._id === id)) {
				return (<Tag color='blue' >Borrowed from: {character.characterName}</Tag>)
			}
		}
		return <Tag color='blue' >Borrowed from: ???</Tag>
	}

	renderLendation = () => {
			if (this.state.target === null || this.state.target === undefined) {
				return (
					<Placeholder.Paragraph rows={15} >Awaiting Selection</Placeholder.Paragraph>
				)
			}
			else {
				const target = this.props.characters.find(el => el._id === this.state.target)
				return (
					<div>
						<Divider style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }}>{target.characterName}, {target.tag}</Divider>
						<p>{target.bio}</p>		
						<Divider></Divider>		
						<p style={{ fontWeight: 'bolder', fontSize: 20 }}>Are you sure you want to lend your '{this.state.lending.name}' to this person? </p>	
						<Button onClick={() => this.handleSubmit()} disabled={this.state.target === null || this.state.target === undefined}  appearance="primary">Lend</Button>	
					</div>
				)
			}
	}

	renderUnLendation = () => {
		if (this.state.unleanding === null ) {
			return (
				<Placeholder.Paragraph rows={15} >Awaiting Selection</Placeholder.Paragraph>
			)
		}
		else {
			return (
				<p>
					Are you sure you want to take back your {this.state.unleanding.name} from {this.state.unleanding.currentHolder}?					
				</p>
			)
		}
	}

	handleSubmit = async () => {
		const data = {
			asset: this.state.lending._id,
			target: this.state.target,
			lendingBoolean: true
		}
		try{
			await axios.post(`${gameServer}api/assets/lend`, { data });
		}
		catch (err) {
			console.log(err)
			Alert.error(`Error: ${err}`, 5000);
		}
		// this.props.lendAsset(this.state.lending._id);
		Alert.success('Asset Successfully Lent');

		this.setState({ lending: null, target: null });
		this.closeLend();
	}

	handleTakeback = async () => {
		const holder = this.props.characters.find(el => el.lentAssets.some(el2=> el2._id === this.state.unleanding._id))
		
		const data = {
			asset: this.state.unleanding._id,
			target: holder._id,
			lendingBoolean: false
		}
		try{
			await axios.post(`${gameServer}api/assets/lend`, { data });
			Alert.success('Asset Successfully Taken Back');	
			this.setState({ unlend: false, unleanding: null });
		}
		catch (err) {
			console.log(err.response)
			Alert.error(`Error: ${err.response.data}`, 5000);
		}
	}

	handleStanding = async () => {
		const data = {
			id: this.props.myCharacter._id, 
			standing: this.state.formValue.textarea
		}
		try{
			await axios.patch(`${gameServer}api/characters/standing`, { data });
			Alert.success('Standing Orders Set!');
		}
		catch (err) {
			console.log(err)
			Alert.error(`Error: ${err}`, 5000);
		}
	} 
}

const mapStateToProps = (state) => ({
	login: state.auth.login,
	user: state.auth.user,
	assets: state.assets.list,
	characters: state.characters.list,
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateAsset: (data) => dispatch(assetUpdated(data)),
	lendAsset: (data) => dispatch(assetLent(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCharacter);
 