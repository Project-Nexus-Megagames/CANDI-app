import React, { useEffect } from 'react'; // React imports
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	Button,
	Container,
	Form,
	FormControl,
	Schema,
	Checkbox,
	FormGroup,
	FlexboxGrid,
	ControlLabel,
	Panel
} from 'rsuite';
import { loadAllActions } from '../../redux/entities/playerActions';
import { authReceived, loginUser } from '../../redux/entities/auth';
import banner from '../Images/Banner.jpg';

const { StringType } = Schema.Types;

const Login = (props) => {
	let { tokenLogin, loadAction, user } = props;
	const [login, setLogin] = React.useState({ user: '', password: '' });
	const [remember, setRemember] = React.useState(true);
	const history = useHistory();

	useEffect(() => {
		let token = localStorage.getItem('candi-token');
		console.log('token ' + token);
		if (token !== null && props.login === false) {
			console.log('Attempting to login!');
			tokenLogin({ token });
		}
	}, [props.login]);

	useEffect(() => {
		if (props.login) {
			loadAction(user);
			history.push('/home');
		}
	}, [props.login, user, loadAction, history]);

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') props.handleLogin(login);
	};

	const onSubmit = async () => {
		remember
			? localStorage.setItem('candi-token', login.user)
			: localStorage.removeItem('candi-token');
		props.handleLogin(login);
	};

	let buttonText = props.loading ? 'Loading' : 'Login';

	return (
		<Container style={{ display: 'flex', alignItems: 'center', }}>

			<Panel bordered style={{ display: 'flex', alignItems: 'center', }}>
			<img
				src={banner}
				width={800}
				alt="Failed to load img"
			/>
			<h5>Login with your Nexus account</h5>
					<p>
						Don't have a Nexus account?
						<Button
							appearance="link"
							onClick={() => {
								const win = window.open(
									'https://nexus-portal.onrender.com/get-started',
									'_blank'
								);
								win.focus();
							}}
						>
							Sign up
						</Button>
					</p>
					<Form model={model} onChange={(form) => setLogin(form)}>
						<FormGroup>
							<ControlLabel>Email / Username</ControlLabel>
							<FormControl
								errorMessage={props.error}
								errorPlacement="topEnd"
								name="user"
								accepter={model.accepter}
								onKeyPress={handleKeyPress}
							/>
						</FormGroup>

						<FormGroup>
							<ControlLabel>Password</ControlLabel>
							<FormControl
								errorMessage={props.error}
								errorPlacement="topEnd"
								name="password"
								type="password"
								onKeyPress={handleKeyPress}
							/>
						</FormGroup>

						<FlexboxGrid justify="space-between">
							<Checkbox onChange={(e) => setRemember(e)} checked={remember}>
								Remember me{' '}
							</Checkbox>
							<Button
								appearance="link"
								size="md"
								onClick={() => {
									const win = window.open(
										'https://nexus-portal.onrender.com/reset',
										'_blank'
									);
									win.focus();
								}}
							>
								Forgot password?
							</Button>
						</FlexboxGrid>
					</Form>
					<Button
						disabled={!login || !login.user || !login.password}
						loading={props.loading}
						onClick={() => onSubmit()}
						appearance="primary"
					>
						{buttonText}
					</Button>				
			</Panel>
		</Container>
	);
};

const model = Schema.Model({
	email: StringType().isRequired('This field is required.')
});

const mapStateToProps = (state) => ({
	auth: state.auth,
	login: state.auth.login,
	error: state.auth.error,
	user: state.auth.user,
	loading: state.auth.loading,
	gamestateLast: state.gamestate.lastFetch
});

const mapDispatchToProps = (dispatch) => ({
	handleLogin: (data) => dispatch(loginUser(data)),
	tokenLogin: (data) => dispatch(authReceived(data)),
	loadAction: (data) => dispatch(loadAllActions(data)) // dispatch(loadplayerActions(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
