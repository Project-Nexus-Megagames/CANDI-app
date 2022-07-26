import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Modal, SelectPicker, Button, Panel } from 'rsuite';
import socket from '../../socket';
import _ from 'lodash';

const Log = (props) => {
	const [selectedCat, setSelectedCat] = useState('');

	const handleExit = () => {
		props.closeModal();
	};
	const handleCatChange = (event) => {
		if (event) {
			setSelectedCat(event);
		}
	};

	const renderCat = () => {
		if (!selectedCat) return <div>Please Select a category!</div>;

		return <div>{renderLogMessages(selectedCat)}</div>;
	};

	const renderLogMessages = (cat) => {
		if (!cat) return <div>Please Select a category!</div>;
		return <div>{cat}</div>;
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
			<Panel>
				<SelectPicker block placeholder="Select a Category" onChange={(event) => handleCatChange(event)} data={data} />
			</Panel>
			<Panel>{renderCat()}</Panel>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default Log;
