import React from 'react';

import { Panel, FlexboxGrid, InputPicker, Timeline, Icon } from 'rsuite';

const LogEntry = (props) => {
	const { log } = props;
	const control = log.control ? log.control : 'Someone';
	console.log(log);

	const getEnglish = (entry) => {
		switch (entry.controlAction) {
			case 'GameState':
				return `${control} changed the gameState. ${entry.message}`;
			default:
				return <div>If you see this, some logging went wrong</div>;
		}
	};

	return <div>{getEnglish(log)}</div>;
	//	return <div>BOOP</div>;
};

export default LogEntry;
