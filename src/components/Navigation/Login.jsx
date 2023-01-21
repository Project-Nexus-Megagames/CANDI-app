import React, { useEffect } from 'react'; // React imports
import { useNavigate } from 'react-router-dom';
import { Card } from '@chakra-ui/card';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { authReceived, authRequestFailed, loginRequested, loginUser } from '../../redux/entities/auth';
import axios from "axios";
import { loadAllActions, loadplayerActions } from '../../redux/entities/playerActions';

import leaderboard from '../Images/hello.jpg';

const Login = (props) => {
  const  { user, loading } = useSelector(s => s.auth);
	const reduxAction = useDispatch();
	const [login, setLogin] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [remember, setRemember] = React.useState(true);
	const navigate = useNavigate();

	// useEffect(() => {
	// 	let token = localStorage.getItem('candi-token');
	// 	console.log('token ' + token);
	// 	console.log(token);

	// 	if (token && token !== null && token !== undefined && props.login === false) {
	// 		console.log('Attempting to login!');
  //     reduxAction(authReceived({ token }));
  //     reduxAction(loginRequested());
  //     navigate('/home');
	// 	}
	// }, [props.login]);

	useEffect(() => {
		if (props.login) {
			reduxAction(loadAllActions(user));
			navigate('/home');
		}
	}, [props.login, user, navigate]);

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') reduxAction(loginUser({ user: login, password }));
	};

	const onSubmit = async () => {
		remember
			? localStorage.setItem('candi-token', login)
			: localStorage.removeItem('candi-token');
		reduxAction(loginUser({ user: login, password }));
	};

	let buttonText = loading ? 'Loading' : 'Login';

	return (
    <div className="styleCenter">
      <Card maxW='lg'>
      <img
        src={'/images/banner.png'}
        width={800}
        alt="Failed to load img"
      />
      <h5>Login with your Nexus account</h5>
          <p>
            Don't have a Nexus account?{" "}
            <Button
              colorScheme={'blue'}
              variant="link"
              onClick={() => {
                const win = window.open(
                  'https://nexus-central-portal.herokuapp.com/get-started',
                  '_blank'
                );
                win.focus();
              }}
            >
              Sign up
            </Button>
          </p>
          <FormControl>
            <FormLabel>Email / Username</FormLabel>
            <Input value={login} onKeyPress={handleKeyPress} onChange={(e)=> setLogin(e.target.value)}  />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type='password' onKeyPress={handleKeyPress} value={password} onChange={(e)=> setPassword(e.target.value)} />
          </FormControl>

          <Button
            disabled={!login || !password}
            // isLoading={loading.toString()}
            onClick={() => onSubmit()}
            variant="solid"
          >
            {buttonText}
          </Button>				
      </Card>      
    </div>
	);
};


export default (Login);
