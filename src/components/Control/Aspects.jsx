import React from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Modal, SelectPicker, ButtonGroup, Button, Panel } from 'rsuite';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const Aspects = (props) => {
	const gameState = useSelector((state) => state.gamestate);
	// write selector to only get Happiness, etc

	const handleExit = () => {
		props.closeModal();
	};

	const chartData = {
		labels: ['Happiness', 'Health', 'Security', 'Politics', 'Diplomacy'],
		datasets: [
			{
				label: 'Standing',
				data: [gameState.gcHappiness, gameState.gcHealth, gameState.gcSecurity, gameState.gcPolitics, gameState.gcDiplomacy],
				backgroundColor: ['purple', '#ecf0f1', '#50AF95', '#f3ba2f', '#2a71d0']
			}
		]
	};

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
			<Bar data={chartData}></Bar>
		</Modal>
	);
};

export default Aspects;
