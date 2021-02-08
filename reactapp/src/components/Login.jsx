import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, ControlLabel, Form, FormControl, FormGroup, Modal, Schema } from 'rsuite';
import { authReceived, loginUser } from '../redux/entities/auth';
const { StringType } = Schema.Types;

const Login = props => {
    const [errors, setErrors] = React.useState({});
    const [formValue, setFormValue] = React.useState({ email: '', password: '',});
		const history = useHistory();
		
		console.log('Mounting App...')
		let token = localStorage.getItem('token');
	
		if (token) {
			props.tokenLogin(token);
			props.history.push('/home')
		} 

		if(props.login) {
			history.push('/home');
		}
    
    return ( 
		<Modal backdrop="static" show={true}>
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
	login: state.auth.login,
	error: state.auth.error,
	user: state.auth.user,
	loading: state.auth.loading,
});

const mapDispatchToProps = (dispatch) => ({
	handleLogin: (data) => dispatch(loginUser(data)),
	tokenLogin: (data) => dispatch(authReceived(data))
	// updateUser: (user) => dispatch(updateUser({ user }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);