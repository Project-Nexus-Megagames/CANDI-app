import React, { useEffect } from "react"; // React imports
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {  Button, Container, Form,  FormControl, Modal,  Schema,  Checkbox,  FormGroup,   FlexboxGrid, ControlLabel,} from "rsuite";
import { loadAllActions, loadplayerActions } from '../../redux/entities/playerActions';
import { authReceived, loginUser } from "../../redux/entities/auth";
import axios from "axios";
import banner from '../Images/banner1.jpg'

const { StringType } = Schema.Types;

const Login = (props) => {
  let { tokenLogin, loadAction, user } = props;
	const [login, setLogin] = React.useState({ user: '', password: ''});
	const [remember, setRemember] = React.useState(true);
  const history = useHistory();

  useEffect(() => {
    let loginToken = localStorage.getItem("candi-token");
    console.log("LoginToken " + loginToken);
    if (loginToken !== null && props.login === false) {
      console.log("Attempting to login!");
      const fetchData = async () => {
        try {
          const { data } = await axios.request({
            url: "https://nexus-central-portal.herokuapp.com/auth/tokenLogin",
            method: "post",
            data: { token: loginToken },
          });
          console.log(data.token);
          tokenLogin({ token: data.token });
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
      // make sure to catch any error
    }
  }, [props.login]);

  useEffect(() => {
    if (props.login) {
      loadAction(user);
      history.push("/home");
    }
  }, [props.login, user, loadAction, history]);
	

  const handleKeyPress = e => {
		if (e.key === 'Enter') props.handleLogin(login);
	}

  const onSubmit = async () => {
		remember ? localStorage.setItem('candi-token', login.user)
			: localStorage.removeItem('candi-token');
		
		props.handleLogin(login);
	}

	let buttonText = props.loading ? 'Loading' :  'Login'

  return (
		<Container style={{ height: '100vh' }} >
			 <img src={banner} className={props.disabled ? 'image disabled' : 'image'} height='100vh' alt='Failed to load img' />     
			<Modal size="xs" backdrop="static" show={true}>
				<Modal.Header style={{ textAlign: 'center' }}>
					<img src={`/images/favicon.ico`} height='100px' alt='Could not load our logo... oops!' />
					<Modal.Title>Login with your Nexus account</Modal.Title>
					<p>Don't have a Nexus account? 
						<Button appearance="link" onClick={() => {const win = window.open('https://nexus-central-portal.herokuapp.com/get-started', '_blank');	win.focus();} }>
								Sign up
							</Button>
					</p>
				</Modal.Header>
				<Modal.Body>
					<Form model={model} onChange={(form) => setLogin(form)}>
					<FormGroup>
							<ControlLabel>
								Email / Username
								</ControlLabel>
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
							<Checkbox onChange={(e) => setRemember(e)} checked={remember} >Remember me </Checkbox>
							<Button appearance="link" size="md"  onClick={() => {const win = window.open('https://nexus-central-portal.herokuapp.com/reset', '_blank');	win.focus();} }>
								Forgot password? 
							</Button>    
						</FlexboxGrid>
	

					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						disabled={!login || !login.user || !login.password}
						loading={props.loading}
						onClick={() => onSubmit()}
						appearance="primary"
					>
						{buttonText}
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>

  );
};

const model = Schema.Model({
  email: StringType().isRequired("This field is required."),
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  login: state.auth.login,
  error: state.auth.error,
  user: state.auth.user,
  loading: state.auth.loading,
  gamestateLast: state.gamestate.lastFetch,
});

const mapDispatchToProps = (dispatch) => ({
  handleLogin: (data) => dispatch(loginUser(data)),
  tokenLogin: (data) => dispatch(authReceived(data)),
	loadAction: (data) => dispatch(loadAllActions(data)),// dispatch(loadplayerActions(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
