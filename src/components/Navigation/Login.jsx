import React, { useEffect } from 'react'; // React imports
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, ControlLabel, Form, FormControl, FormGroup, Modal, Schema } from 'rsuite';
import { loadAssets } from '../../redux/entities/assets';
import { authReceived, loginUser } from '../../redux/entities/auth';
import { loadCharacters } from '../../redux/entities/characters';
import { loadGamestate } from '../../redux/entities/gamestate';
import { loadAllActions, loadplayerActions } from '../../redux/entities/playerActions';

const { StringType } = Schema.Types;

const Login = props => {
	let { login, tokenLogin, loadAction, user, actionsLoaded } = props;
    const [errors, setErrors] = React.useState({});
    const [formValue, setFormValue] = React.useState({ email: '', password: '',});

	const history = useHistory();
	
	// console.log('Mounting App...')
	

	useEffect(() => {
		// localStorage.clear();
		let token = localStorage.getItem('nexusAuth');
		if (token !== null && login === false) {
			tokenLogin({ token });
		} 
	}, [login, tokenLogin])

	useEffect(() => {
		if (login) {
			if (!actionsLoaded) loadAction(user);
			history.push('/home');
		}
	}, [login, user, loadAction, history, actionsLoaded])



    return ( 
		<Modal style={{ width: '90%' }} backdrop="static" show={true}>
		<Modal.Header>
			<Modal.Title>Login</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form model={model} fluid formValue={formValue} onChange={form => setFormValue(form)}>
			<FormGroup>
					<ControlLabel>Email / Username</ControlLabel>
					<FormControl errorMessage={props.error} errorPlacement='topEnd' name="email" accepter={model.accepter}/>
				</FormGroup>
				<FormGroup>
					<ControlLabel>Password</ControlLabel>
					<FormControl errorMessage={props.error} errorPlacement='topEnd' name="password" type="password" />
				</FormGroup>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button loading={props.loading} onClick={() => {
                props.handleLogin({ user: formValue.email, password: formValue.password })
                }} appearance="primary">
				Submit
			</Button>
		</Modal.Footer>
	</Modal> 
	);
}

const model = Schema.Model({
    email: StringType()
    .isRequired('This field is required.')
});

const mapStateToProps = (state) => ({
	auth: state.auth,
	login: state.auth.login,
	error: state.auth.error,
	user: state.auth.user,
	loading: state.auth.loading,
	actionsLoaded: state.actions.loaded,
	assetsLast: state.assets.lastFetch,
	charactersLast: state.characters.lastFetch,
	gamestateLast: state.gamestate.lastFetch,
});

const mapDispatchToProps = (dispatch) => ({
	handleLogin: (data) => dispatch(loginUser(data)),
	tokenLogin: (data) => dispatch(authReceived(data)),
	loadChar: (data) => dispatch(loadCharacters()),
	loadAction: (data) => dispatch(loadAllActions(data)),// dispatch(loadplayerActions(data)),
	loadAssets: (data) => dispatch(loadAssets()),
	loadGamestate: (data) => dispatch(loadGamestate())
	// updateUser: (user) => dispatch(updateUser({ user }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);