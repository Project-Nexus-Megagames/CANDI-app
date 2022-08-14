import React from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Modal } from 'rsuite';
import { Bar } from 'react-chartjs-2';
// don't delete this even though it shows up as unused!
import { Chart as ChartJS } from 'chart.js/auto';

const Aspects = (props) => {
	const gameState = useSelector((state) => state.gamestate);

	const handleExit = () => {
		props.closeModal();
	};

	const chartData = {
		labels: ['Happiness', 'Health', 'Security', 'Politics', 'Diplomacy'],
		datasets: [
			{
				label: 'Standing',
				data: [gameState.gcHappiness, gameState.gcHealth, gameState.gcSecurity, gameState.gcPolitics, gameState.gcDiplomacy],
				backgroundColor: ['#ff1f78', '#059103', '#eb0505', 'purple', '#1717de']
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
