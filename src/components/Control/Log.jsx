import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Modal, SelectPicker, Button, Panel } from 'rsuite';
import { getGameStateLog } from '../../redux/entities/log';
import socket from '../../socket';
import _ from 'lodash';

import NavigationBar from '../Navigation/NavigationBar';

const Log = (props) => {
	const [selectedCat, setSelectedCat] = useState('');
	const gameStateMessages = useSelector(getGameStateLog);
	console.log(gameStateMessages);

	const handleExit = () => {
		props.closeModal();
	};
	const handleCatChange = (event) => {
		if (event) {
			setSelectedCat(event);
		}
	};

	const renderCat = () => {
		//	if (!selectedCat) return <div>Please Select a category!</div>;

		return <div>{renderLogMessages()}</div>;
	};

	const renderEachMessage = (gameState) => {
		return gameState.logMessages.map((message, index) => {
			return <li>{message}</li>;
		});
	};

	const renderLogMessages = () => {
		//if (!cat) return <div>Please Select a category!</div>;
		return (
			<div>
				boop
				{gameStateMessages.map((gameState, index) => {
					return (
						<div>
							<li>{gameState.createdAt}</li>
							{renderEachMessage(gameState)}
						</div>
					);
				})}
			</div>
		);
	};

	const data = ['cat1', 'cat2'].map((item) => ({ label: item, value: item }));

	return (
		<div>
			<NavigationBar />
			<Panel header="Log Messages" collapsible bordered>
				{renderLogMessages()}
			</Panel>
		</div>
	);
};

export default Log;
