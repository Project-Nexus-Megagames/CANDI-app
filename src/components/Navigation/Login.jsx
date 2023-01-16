import React, { useEffect } from 'react'; // React imports
import { useNavigate } from 'react-router-dom';
import { Card } from '@chakra-ui/card';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';

const Login = (props) => {
	let { tokenLogin, loadAction, user } = props;
	const [login, setLogin] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [remember, setRemember] = React.useState(true);
	const navigate = useNavigate();

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
			navigate('/home');
		}
	}, [props.login, user, loadAction, navigate]);

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
    <div className="styleCenter">
      <Card maxW='lg'>
      <img
        src={'/images/Locations/Silicon District.jpg'}
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
