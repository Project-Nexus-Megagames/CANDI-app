import { Button, Card, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react"; // React imports
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authReceived, loginRequested, authRequestFailed, loginUser } from "../../redux/entities/auth";
import { ErrorAlert } from "../Common/ErrorAlert";

const Login = (props) => {
	const reduxAction = useDispatch();
	const { loading, error } = useSelector(s => s.auth);
	const [login, setLogin] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [remember, setRemember] = React.useState(true);
	const navigate = useNavigate();
  const toast = useToast();

	const loginToken = localStorage.getItem("underground-token");
  useEffect(() => {
		if (loginToken && loginToken !== null && loginToken !== undefined && loginToken !== 'undefined' && props.login === false) {
			console.log('Attempting to token login!');
      reduxAction(authReceived({ token: loginToken }));
      reduxAction(loginRequested());
      navigate('/loading');
		}
	}, [props.login]);

	useEffect(() => {
		if (props.login) {
			navigate('/home');
		}
	}, [props.login, navigate]);

  useEffect(() => {
		if (error) {
      console.log(error);
      toast({
        position: "top-right",
        isClosable: true,
        duration: 5000,
        render: () => <ErrorAlert error={error} />,
      });
		}
	}, [error]);

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') reduxAction(loginUser({ user: login, password }));
	};

	const onSubmit = async () => {
		// remember ? localStorage.setItem('kepler-token', login) : localStorage.removeItem('kepler-token');

		reduxAction(loginUser({ user: login, password }));
	};

	let buttonText = props.loading ? 'Loading' : 'Login';

  return (
    <div className="styleCenter">
      <Card maxW='lg'>
      <img
        src={'https://cdn.discordapp.com/attachments/1161172411190874205/1214397506880933950/Screenshot_2024-03-04_at_9.21.55_PM.png?ex=65f8f6d0&is=65e681d0&hm=ae74989ebcc98ef392cf2e93975e260068a2c58bbfe7a9325582c368988ba0a9&'}
        width={600}
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
                  'https://nexus-portal.onrender.com/registration/user',
                  '_blank'
                );
                win.focus();
              }}
            >
              Sign up
            </Button>
          </p>

          {error && <ErrorAlert error={error}></ErrorAlert>}

          <FormControl style={{ color: '#d4af37', marginBottom: '10px' }}>
            <FormLabel>Email / Username</FormLabel>
            <Input value={login} onKeyPress={handleKeyPress} onChange={(e)=> setLogin(e.target.value)}  />
          </FormControl>

          <FormControl style={{  color: "#8a0674"}}>
            <FormLabel>Password</FormLabel>
            <Input type='password' onKeyPress={handleKeyPress} value={password} onChange={(e)=> setPassword(e.target.value)} />
          </FormControl>
          

          <Button
            style={{ marginLeft: '0px', marginRight: '0px', marginTop: '35px' }}
            disabled={!login || !password}
            isLoading={loading}
            onClick={() => onSubmit()}
            variant="solid"
            colorScheme={'blue'}
          >
            {buttonText}
          </Button>				
      </Card>      
    </div>

  );
};

export default (Login);
