import React from 'react';
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
			case 'ActionEffect':
				return `${control} added an effect to the action ${entry.affectedAction}.`;
			case 'Character':
				return `${control} worked with characters.`;
			case 'Asset':
				return `${control} worked with assets.`;
			default:
				return 'If you see this, something was logged without a category.';
		}
	};

	return (
		<div>
      {getDateTimeString(log.createdAt)}
			<p>
				{getEnglish(log)} {log.message}
			</p>
		</div>
	);
};

export default ControlLogEntry;
