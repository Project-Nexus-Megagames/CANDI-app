import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
	const [seconds, setSeconds] = useState(25);
	const [startBool, setStart] = useState(false);

	const start = () => {
		setStart((startBool) => (startBool = true));
		const audio = new Audio('/fanfare.mp3');
		audio.loop = false;
		audio.play();

		const interval = setInterval(() => {
			if (seconds > 1300) {
				clearInterval(interval);
			} else setSeconds((seconds) => seconds + 2);
		}, 50);
		return () => clearInterval(interval);
	};

	return (
		<React.Fragment>
			{!startBool && (
				<div
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)'
					}}
				>
					<Button appearance={'ghost'} onClick={() => start()}>
						404
					</Button>
					<Button color="white" appearance='text' size="lg" onClick={() => navigate('/')}>
							I'm scared take me back!
						</Button>
				</div>
			)}
			{startBool && (
				<Box
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)'
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xlink="http://www.w3.org/1999/xlink"
						preserveAspectRatio="xMidYMid"
						width={seconds > 1050 ? 1050 : seconds}
						viewBox="0 0 1211 495"
					>
						<defs></defs>
						<text
							transform="translate(605 487) scale(11.91)"
							style={{ fontSize: ' 60px' }}
						>
							<tspan
								x="0"
								style={{
									fontSize: ' 60px',
									fill: '#fff',
									textAnchor: 'middle',
									fontFamily: 'Franklin Gothic Medium'
								}}
							>
								404
							</tspan>
						</text>
					</svg>
					{seconds >= 1100 && (
						<div
							style={{
								fontSize: '34px',
								fontWeight: '500',
								color: '#fff',
								lineHeight: '1.4',
								margin: '0'
							}}
						>
							Looks like something went wrong.
						</div>
					)}
					{seconds >= 1200 && (
						<Button color="red" size="lg" onClick={() => navigate('/')}>
							Take me back!
						</Button>
					)}
					{seconds >= 1300 && <p>Also I really hope you had audio on...</p>}
				</Box>
			)}
		</React.Fragment>
	);
};

export default NotFound;
