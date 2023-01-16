import { Box } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { getGameStateLog, getControlLog } from '../../redux/entities/log';
import { getDateTimeString } from '../../scripts/dateTime';

import NavigationBar from '../Navigation/NavigationBar';
import ControlLogEntry from './ControlLogEntry';

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
			case 'Control Log':
				return <div>{renderControlMessages(controlMessages)}</div>;
			default:
				return <div>Please Select a category!</div>;
		}
	};

	const renderEachNextRoundMessage = (messages) => {
		return messages.logMessages.map((message, index) => {
			return (
				<li key={index} style={{ fontWeight: 'normal' }} align="left">
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
					const created = getDateTimeString(nextRound.createdAt);
					const headerString = 'New Round ' + nextRound.round + ' Initiated by ' + nextRound.control + ' on ' + created;
					return (
						<Box key={index} header={headerString} style={{ fontWeight: 'bold' }} collapsible bordered>
							{renderEachNextRoundMessage(nextRound)}
						</Box>
					);
				})}
			</div>
		);
	};

	const renderControlMessages = (controlMessages) => {
		return (
      <div>TODO fix this</div>
			// <Timeline className="custom-timeline">
			// 	{controlMessages.map((message, index) => {
			// 		return <ControlLogEntry log={message} key={index}></ControlLogEntry>;
			// 	})}
			// </Timeline>
		);
	};

	return (
		<div>
			<NavigationBar />
			<Box>
				{/* <InputPicker block placeholder="Pick a Category" onChange={(event) => handleCatChange(event)} data={logCategories} /> */}
        Todo: Fix Logs
			</Box>
			<Box>{renderCat()}</Box>
		</div>
	);
};

export default Log;
