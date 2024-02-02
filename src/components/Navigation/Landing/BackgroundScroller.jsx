import React from 'react';
import styled from 'styled-components';

const MotivationalText = styled.h1`
	font-size: 34px;
	font-weight: 500;
	color: #fff;
	line-height: 1.4;
	margin: 0;
`;

const BackgroundFilter = styled.div`
	width: 100%;
	height: 100%;
	background-color: #725e54;
	display: flex;
	flex-direction: column;
`;

const BackgroundScroller = (props) => {
	return ( 
		<BackgroundFilter>
			<div style={{ background: `url(${props.backgroundImg}) no-repeat center center fixed`, height: '100vh', textAlign: 'center', justifyContent: 'center', alignItems: ' center', flexDirection: 'column', display: 'flex'}}>
				<MotivationalText>{props.text}</MotivationalText>	
			</div>
		</BackgroundFilter>
	);
}
export default BackgroundScroller;