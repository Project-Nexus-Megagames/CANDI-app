import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
	Content,
	FlexboxGrid,
	ButtonGroup,
	Button,
	Divider,
	IconButton,
	Icon
} from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import {
	characterUpdated,
	getMyCharacter
} from '../../redux/entities/characters';
import { actionDeleted } from '../../redux/entities/playerActions';
import NewAction from './NewAction';
import NewComment from './NewComment';
import NewResult from './NewResult';
import Submission from './Submission';
import Comment from './Comment';
import Result from './Result';
import NewEffects from './NewEffect';
import Effect from './Effect';
import Support from './Support';

const SelectedAction = (props) => {
	const [selectedArray, setSelectedArray] = useState([]);
	const [add, setAdd] = useState(false);
	const [support, setSupport] = useState(false);
	const [result, setResult] = useState(false);
	const [comment, setComment] = useState(false);
	const [effect, setEffect] = useState(false);

	useEffect(() => {
		if (props.selected) {
			let temp = [
				props.selected.submission,
				...props.selected.comments,
				...props.selected.results,
				...props.selected.effects
			];
			// temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //new Date(a.createdAt) -  new Date(b.createdAt // disabled until the updatedAt bug is worked out
			setSelectedArray(temp);
			setAdd(false);
		}
	}, [props.selected]);

	const closeIt = () => {
		setAdd(false);
		setResult(false);
		setSupport(false);
		setComment(false);
		setEffect(false);
	};

	const renderSwitch = (el, index) => {
		switch (el.model) {
			case 'Submission':
				return (
					<div>
						<Submission
							special={props.special}
							handleSelect={props.handleSelect}
							index={index}
							submission={el}
							action={props.selected}
							creator={props.selected.creator}
						/>
					</div>
				);
			case 'Comment':
				return (
					<div>
						<Comment selected={props.selected} index={index} comment={el} />
					</div>
				);
			case 'Result':
				return (
					<div>
						<Divider vertical />
						<Result
							index={index}
							result={el}
							selected={props.selected}
							submission={props.selected.submission}
						/>
					</div>
				);
			case 'Effect':
				return (
					<div>
						<Divider vertical />
						<Effect selected={props.selected} index={index} effect={el} />
					</div>
				);
			default:
				return <b> Oops </b>;
		}
	};


	return (
		<Content style={{ overflow: 'auto', height: '100%' }}>
			<FlexboxGrid align='middle' justify="space-around">
				<FlexboxGrid.Item colspan={16}>
					{!props.selected && <h4>No Action Selected</h4>}
					{selectedArray.map((el, index) => renderSwitch(el, index))}
					<Divider vertical />
					<Divider>End of Action Feed</Divider>

					<div style={{ transition: '3s ease', marginBottom: '30px' }}>
						{!add && (
							<IconButton
								onClick={() => setAdd(true)}
								color="blue"
								icon={<Icon icon="plus" />}
							></IconButton>
						)}
						{add && (
							<ButtonGroup
								justified
								style={{ width: '100%', transition: '.5s' }}
							>
								{props.selected && props.selected.type === 'Agenda' && <Button disabled={props.myCharacter.effort.find(el => el.type === 'Agenda').amount <= 0} onClick={() => setSupport(true)}  color='green' >Support</Button>}
								<Button onClick={() => setComment(true)} color="cyan">
									Comment
								</Button>
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<Button onClick={() => setResult(true)} color="blue">
										Result
									</Button>
								)}
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<Button onClick={() => setEffect(true)} color="violet">
										Effect
									</Button>
								)}
							</ButtonGroup>
						)}
					</div>
				</FlexboxGrid.Item>
			</FlexboxGrid>

			{props.selected.submission && <NewResult
				show={result}
				closeNew={() => closeIt()}
				gamestate={props.gamestate}
				submission={props.selected.submission}
				selected={props.selected}
			/>}

			<NewComment
				show={comment}
				closeNew={() => closeIt()}
				gamestate={props.gamestate}
				selected={props.selected}
			/>

			<Support show={support} closeNew={() => closeIt()} gamestate={props.gamestate} selected={props.selected}/>

			{props.selected && props.selected.creator && <NewEffects
				show={effect}
				action={props.selected}
				selected={props.selected}
				hide={() => closeIt()}
			/>}
		</Content>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
	assetsRedux: state.assets.list,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	deleteAction: (data) => dispatch(actionDeleted(data)),
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedAction);
