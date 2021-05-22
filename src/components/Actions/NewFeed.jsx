import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, FlexboxGrid, InputPicker, InputNumber, Slider } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';

const NewFeed = props => {
	const [intent, setIntent] = React.useState('');
	const [asset1, setAsset] = React.useState('');
	const [overFeed, setOverFeed] = React.useState(0);

	const handleSubmit = async () => {
		props.actionDispatched();
		// 1) make a new action
		try{
			socket.emit('actionRequest', 'create', { intent, effort: overFeed, asset1, type: 'Feed', creator: props.myCharacter.characterName, description: 'Feed Action', round: props.gamestate.round});
			
			setIntent('');
			setOverFeed(0);
			props.closeFeed()
		}
		catch (err) {
			console.log(err);
			// Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
			// this.setState({ loading: false });
		}
	}

	const formattedUsedAssets = () => {
		let assets = [];
		for (const asset of props.usedAssets) {
			assets.push(asset.name)
		}
		return assets;
	}
	

	return ( 
		<Modal backdrop="static" show={props.show} size='md' onHide={() => props.closeFeed()}>
		<Modal.Header>
			<Modal.Title>New Feed Action</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<b>What are you doing with this feed?</b>
		<form>
				<textarea rows='6' value={intent} style={textStyle} onChange={(event)=> setIntent(event.target.value)}></textarea>							
			<br></br>				
			<FlexboxGrid style={{padding: '5px', textAlign: 'left', width: '100%'}} align="middle">
				<FlexboxGrid.Item  align="middle" colspan={10}>Overfeeding Level
					<Slider graduated
						min={0}
						max={4}
						defaultValue={0}
						progress
						value={overFeed}
						onChange={(event)=> setOverFeed(event)}>
					</Slider>
					<InputNumber value={overFeed} max={4} min={0} onChange={(event)=> setOverFeed(event)}></InputNumber>	
				</FlexboxGrid.Item>	
				<FlexboxGrid.Item colspan={1} />
				<FlexboxGrid.Item  align="middle" colspan={10}>Bond/Territory
					<InputPicker  block style={{ width: '75%' }} placeholder="Slot 1" labelKey='name' valueKey='name' data={props.getMyAssets.filter(el => (el.type === 'Bond' || el.type === 'Territory'))} disabledItemValues={formattedUsedAssets()} onChange={(event)=> setAsset(event)}/>
				</FlexboxGrid.Item>
			</FlexboxGrid>
		</form>
		</Modal.Body>
		<Modal.Footer>
			<Button loading={props.loading} onClick={() => {
								handleSubmit()
								}} appearance="primary">
				Submit
			</Button>
		</Modal.Footer>
	</Modal> 
	 );
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
const mapStateToProps = (state) => ({
  myCharacter: state.auth.user ? getMyCharacter(state): undefined,	
	loading: state.auth.loading,
	gamestate: state.gamestate,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
});

const mapDispatchToProps = (dispatch) => ({
  actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewFeed);
