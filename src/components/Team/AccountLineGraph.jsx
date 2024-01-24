import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getFadedColor } from '../../scripts/frontend';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AccountLineGraph = (props) => {
	const options = {
		maintainAspectRatio: false,
		plugins: {
			title: {
				display: false,
				text: 'Price History',
			},
		},
		scaleShowLabels : false
	};

	return <Line 
	height={'auto'} width={750} options={options} data={props.data}/>;
}
 
export default AccountLineGraph;