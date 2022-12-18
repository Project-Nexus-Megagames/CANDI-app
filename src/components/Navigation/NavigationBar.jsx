import React, { useEffect } from 'react';
import { Icon, IconButton, FlexboxGrid, SelectPicker } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { signOut, setCharacter } from '../../redux/entities/auth';
import { getMyCharacter, getCharacterById, getPlayerCharacters } from '../../redux/entities/characters';

const Navigation = (props) => {
	const [days, setDays] = React.useState(0);
	const [minutes, setMinutes] = React.useState(0);
	const [hours, setHours] = React.useState(0);
	const myChar = useSelector(getMyCharacter);

	const [selectedChar, setSelectedChar] = React.useState(myChar._id);
	const currentCharacter = useSelector(getCharacterById(selectedChar));

	const allCharacters = useSelector(state => state.characters.list);

	const history = useHistory();

	useEffect(() => {
		renderTime(props.gamestate.endTime);
		setInterval(() => {
			renderTime(props.gamestate.endTime);
			//clearInterval(interval);
		}, 60000);
	}, [props.gamestate.endTime]);

	useEffect(() => {
		props.setCharacter(currentCharacter);
	}, [currentCharacter]);

	const handleCharChange = (charId) => {
		if (charId) {
			setSelectedChar(charId);
		} else setSelectedChar(myChar._id);
	};

	const renderTime = (endTime) => {
		let countDownDate = new Date(endTime).getTime();
		const now = new Date().getTime();
		let distance = countDownDate - now;
		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		setDays(days);
		setHours(hours);
		setMinutes(minutes);
	};

	return (
		<div style={{ height: '50px', backgroundColor: '#746D75', width: '100%', fontSize: '0.966em', borderBottom: '3px solid', borderRadius: 0, borderColor: '#FA9C37' }}>
			<FlexboxGrid justify="start" align="middle">
				<FlexboxGrid.Item onClick={() => history.push('/home')} justify="start" colspan={1}>
					<IconButton onClick={() => history.push('/home')} icon={<Icon icon="arrow-left" />} appearance="subtle" color="cyan" style={{}}></IconButton>
				</FlexboxGrid.Item>
				<FlexboxGrid.Item onClick={() => history.push('/home')} justify="start" colspan={1} />
				<FlexboxGrid.Item colspan={19}>
					<div>
						<p>Round: {props.gamestate.round} </p>
						{days > 0 && (
							<p>
								Time Left: {days} Days, {hours} Hours{' '}
							</p>
						)}
						{hours > 0 && days <= 0 && (
							<p>
								Time Left: {hours} Hours, {minutes} Minutes
							</p>
						)}
						{days + hours + minutes <= 0 && <p>Game Status: {props.gamestate.status}</p>}
					</div>
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={3}>
					{currentCharacter.tags.some((el) => el.toLowerCase() === 'control') && (
						<p>
							VIEW AS:
							<SelectPicker data={allCharacters} valueKey="_id" labelKey="characterName" onChange={(event) => handleCharChange(event)}></SelectPicker>
						</p>
					)}
				</FlexboxGrid.Item>
			</FlexboxGrid>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut()),
	setCharacter: (payload) => dispatch(setCharacter(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
