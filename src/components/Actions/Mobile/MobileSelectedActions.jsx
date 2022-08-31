import React, { useEffect } from 'react';
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
import { getMyAssets, getMyUsedAssets } from '../../../redux/entities/assets';
import {
	characterUpdated,
	getMyCharacter
} from '../../../redux/entities/characters';
import { actionDeleted } from '../../../redux/entities/playerActions';
import Comment from '../Comment';
import Effect from '../Effect';
import NewAction from '../NewAction';
import NewComment from '../NewComment';
import NewResult from '../NewResult';
import Result from '../Result';
import Submission from '../Submission';

const MobileSelectedAction = (props) => {
	const [selectedArray, setSelectedArray] = React.useState([]);
	const [add, setAdd] = React.useState(false);
	const [submission, setSubmission] = React.useState(false);
	const [result, setResult] = React.useState(false);
	const [comment, setComment] = React.useState(false);

	useEffect(() => {
		if (props.selected) {
			let temp = [
				props.selected.submission,
				...props.selected.comments,
				...props.selected.results,
				...props.selected.effects
			];
			setSelectedArray(temp);
		}
	}, [props.selected]);

	const closeIt = () => {
		setAdd(false);
		setResult(false);
		setSubmission(false);
		setComment(false);
	};

	//const getTime = (date) => {
	//	let day = new Date(date).toDateString();
	//	return <b>{day}</b>;
	//};

	const renderSwitch = (el, index) => {
		switch (el.model) {
			case 'Submission':
				return (
					<div>
						<Submission
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
		<Content style={{ height: 'calc(100vh - 50px)', overflow: 'auto' }}>
			<FlexboxGrid>
				<FlexboxGrid.Item colspan={2}></FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={20}>
					{!props.selected && <h4>No Action Selected</h4>}
					{selectedArray.map((el, index) => renderSwitch(el, index))}

					<Divider>End of Action Feed</Divider>

					<div style={{ transition: '3s ease' }}>
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
								{/* <Button onClick={() => setSubmission(true)}  color='green' >Player Submission</Button> */}
								<Button onClick={() => setComment(true)} color="cyan">
									Comment
								</Button>
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<Button onClick={() => setResult(true)} color="blue">
										Result
									</Button>
								)}
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<Button disabled={true} color="violet">
										Effect
									</Button>
								)}
							</ButtonGroup>
						)}
					</div>
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={2} />
			</FlexboxGrid>
			<NewAction
				show={submission}
				closeNew={() => closeIt()}
				gamestate={props.gamestate}
				selected={props.selected}
			/>

			{props.selected && (
				<NewResult
					show={result}
					closeNew={() => closeIt()}
					gamestate={props.gamestate}
					submission={props.selected.submission}
					selected={props.selected}
				/>
			)}

			<NewComment
				show={comment}
				closeNew={() => closeIt()}
				gamestate={props.gamestate}
				selected={props.selected}
			/>
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

//const styleCenter = {
//	display: 'flex',
//	justifyContent: 'center'
//};

//const slimText = {
//	fontSize: '0.966em',
//	color: '#97969B',
//	fontWeight: '300',
//	whiteSpace: 'nowrap',
//	textAlign: 'center'
//};

//const pickerData = [
//	{
//		label: 'Draft',
//		value: 'Draft'
//	},
//	{
//		label: 'Awaiting Resolution',
//		value: 'Awaiting'
//	},
//	{
//		label: 'Ready for Publishing',
//		value: 'Ready'
//	},
//	{
//		label: 'Published',
//		value: 'Published'
//	}
//];

//const textStyle = {
//	backgroundColor: '#1a1d24',
//	border: '1.5px solid #3c3f43',
//	borderRadius: '5px',
//	width: '100%',
//	padding: '5px',
//	overflow: 'auto',
//	scrollbarWidth: 'none'
//};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MobileSelectedAction);
