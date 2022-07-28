import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Panel, FlexboxGrid, InputPicker } from 'rsuite';
import { getGameStateLog, getControlLog } from '../../redux/entities/log';

import NavigationBar from '../Navigation/NavigationBar';

const Log = () => {
	const [selectedCat, setSelectedCat] = useState('');

	const gameStateLog = useSelector(getGameStateLog);
	const nextRoundMessages = [...gameStateLog].reverse();

	const controlLog = useSelector(getControlLog);
	const controlMessages = [...controlLog].reverse();

	const logCategories = ['Next Round Log', 'Control Log'].map((item) => ({ label: item, value: item }));

	const handleCatChange = (event) => {
		if (event) {
			setSelectedCat(event);
		}
	};

	const renderCat = () => {
		switch (selectedCat) {
			case 'Next Round Log':
				return <div>{renderNextRoundMessages(nextRoundMessages)}</div>;
			case 'Control Log': //return <div>{renderLogMessages(controlMessages)}</div>;
				return <div>Boop</div>;
			default:
				return <div>Please Select a category!</div>;
		}
	};

	const renderEachMessage = (messages) => {
		return messages.logMessages.map((message, index) => {
			return (
				<li key={index} style={{ fontWeight: 'normal' }}>
					{message}
				</li>
			);
		});
	};

	const renderNextRoundMessages = (nextRoundLog) => {
		//if (!cat) return <div>Please Select a category!</div>;
		return (
			<div>
				{nextRoundLog.map((nextRound, index) => {
					const created = new Date(nextRound.createdAt).toDateString();
					const headerString = 'New Round ' + nextRound.round + ' Initiated by ' + nextRound.control + ' on ' + created;
					return (
						<Panel key={index} header={headerString} style={{ fontWeight: 'bold' }} collapsible bordered>
							{renderEachMessage(nextRound)}
						</Panel>
					);
				})}
			</div>
		);
	};

	return (
		<div>
			<NavigationBar />
			<Panel>
				<InputPicker block placeholder="Pick a Category" onChange={(event) => handleCatChange(event)} data={logCategories} />
			</Panel>
			<Panel>{renderCat()}</Panel>
		</div>
	);
};

export default Log;
