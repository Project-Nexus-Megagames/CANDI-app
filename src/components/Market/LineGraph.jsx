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

const LineGraph = (props) => {
	const labels = [];
	const dataS = [];
	for (const log of props.data) {
		labels.push(` `)
		dataS.push(log);
	}

	const data = {
		labels,
		datasets: [
			{
				label: props.selected.name,
				fill: false,
				lineTension: 0.1,
				backgroundColor: getFadedColor(props.selected.resource),
				borderColor: getFadedColor(props.selected.resource),
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: props.data
			}
		]
	};

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
	height={'auto'} width={750} options={options} data={data}/>;
}
 
export default LineGraph;