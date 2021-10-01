import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Content, Slider, Panel, FlexboxGrid, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle, IconButton, Icon } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted } from '../../redux/entities/playerActions';
import socket from '../../socket';
import NewAction from './NewAction';
import NewComment from './NewComment';
import NewResult from './NewResult';
import Submission from './Submission';
import Comment from './Comment';
import Result from './Result';
import MobileSelectedActions from './Mobile/MobileSelectedActions';

const SelectedAction = (props) => {
	const [selectedArray, setSelectedArray] = React.useState([]);
	const [add, setAdd] = React.useState(false);
	const [submission, setSubmission] = React.useState(false);
	const [result, setResult] = React.useState(false);
	const [comment, setComment] = React.useState(false);

	useEffect(() => {
		if (props.selected) {
			let temp = [ props.selected.submission, ...props.selected.comments, ...props.selected.results, ...props.selected.effects ];
			// temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //new Date(a.createdAt) -  new Date(b.createdAt // disabled until the updatedAt bug is worked out
			setSelectedArray(temp);
		}
	}, [props.selected]);
	
	const closeIt =() => {
		setAdd(false);
		setResult(false);
		setSubmission(false);
		setComment(false);
	}

	const renderSwitch = (el, index) => {
		switch(el.model) {
			case 'Submission':
				return(
					<div>
						<Submission handleSelect={props.handleSelect} index={index} sumbission={el} action={props.selected} creator={props.selected.creator}/>
					</div>
				)
				case 'Comment':
					return(
						<div>
							<Comment selected={props.selected} index={index} comment={el} />								
						</div>
					)
					case 'Result':
						return(
							<div>
								<Divider vertical/>	
								<Result index={index} result={el} selected={props.selected} submission={props.selected.submission}/>
							</div>
						)
			default:
				return(<b> Oops </b>)	
		}	
	}

	if (window.innerHeight < 900) {
		return (<MobileSelectedActions />)
	}
	return ( 
		<Content style={{overflow: 'auto', height: '100%'}} >
		<FlexboxGrid >
			<FlexboxGrid.Item colspan={2} >
			</FlexboxGrid.Item>
			<FlexboxGrid.Item colspan={16} >

			{selectedArray.map((el, index) => (
					renderSwitch(el, index)
			))}		
			<Divider vertical/>
			<Divider>End of Action Feed</Divider>

			<div style={{ transition: '3s ease'}}>
				{!add && <IconButton onClick={() => setAdd(true)} color='blue' icon={<Icon icon="plus" />}></IconButton>}
				{add &&
					<ButtonGroup justified style={{ width: '100%', transition: '.5s' }} >
						{/* <Button onClick={() => setSubmission(true)}  color='green' >Player Submission</Button> */}
						<Button onClick={() => setComment(true)}color='cyan'>Comment</Button>
						{props.myCharacter.tags.some(el=> el === 'Control') && <Button onClick={() => setResult(true)} color='blue' >Result</Button>}
						{props.myCharacter.tags.some(el=> el === 'Control') && <Button disabled={true} color='violet' >Effect</Button>}
					</ButtonGroup>}						
			</div>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item colspan={1} />
		</FlexboxGrid>	
			<NewAction
				show={submission}
				closeNew={() => closeIt()}
				gamestate={props.gamestate}
				selected={props.selected}
			/>

			<NewResult
				show={result}
				closeNew={() => closeIt()}
				gamestate={props.gamestate}
				submission={props.selected.submission}
				selected={props.selected}
			/>

			<NewComment
				show={comment}
				closeNew={() => closeIt()}
				gamestate={props.gamestate}
				selected={props.selected}
			/>

	</Content>		
	);
}


const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
	assetsRedux: state.assets.list,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	deleteAction: (data) => dispatch(actionDeleted(data)),
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedAction);