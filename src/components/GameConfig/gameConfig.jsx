import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import {
	Modal,
	SelectPicker,
	ButtonGroup,
	Button,
	CheckboxGroup,
	Checkbox,
	Panel
} from 'rsuite';
import socket from '../../socket';

const GameConfig = () => {
	const handleSubmit = () => {
		const data = {};
		try {
			socket.emit('request', {
				route: 'character',
				action: 'healInjury',
				data
			});
			// eslint-disable-next-line no-empty
		} catch (err) {}
	};

	return <div>Boop</div>;
};

export default GameConfig;
