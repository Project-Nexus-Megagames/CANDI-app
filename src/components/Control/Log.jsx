import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Modal, SelectPicker, Button, Panel } from 'rsuite';
import { getGameStateLog } from '../../redux/entities/log';
import socket from '../../socket';
import _ from 'lodash';

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
		<Modal
			overflow
			full
			size="lg"
			show={props.show}
			onHide={() => {
				handleExit();
			}}
		>
			<Modal.Header>
				<Modal.Title>Logs</Modal.Title>
			</Modal.Header>
			{/*<Panel>
				<SelectPicker block placeholder="Select a Category" onChange={(event) => handleCatChange(event)} data={data} />
			</Panel>*/}
			<Panel>{renderLogMessages()}</Panel>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default Log;
