import React from 'react';

import { Timeline } from 'rsuite';

import { getDateTimeString } from '../../scripts/dateTime';

const ControlLogEntry = (props) => {
	const { log } = props;
	const control = log.control ? log.control : 'Someone';

	const getEnglish = (entry) => {
		switch (entry.controlAction) {
			case 'GameState':
				return `${control} changed the gameState.`;
			case 'ActionOverride':
				return `${control} overrid an action.`;
			default:
				return 'If you see this, something was logged without a category.';
		}
	};

	return (
		<Timeline.Item time={getDateTimeString(log.createdAt)}>
			<p>
				{getEnglish(log)} {log.message}
			</p>
		</Timeline.Item>
	);
};

export default ControlLogEntry;
