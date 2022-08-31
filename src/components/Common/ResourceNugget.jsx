import React from 'react';
import { useSelector } from 'react-redux';
import { Popover, Whisper } from 'rsuite';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const ResourceNugget = (props) => {
	const { value, type, height, width } = props; 

	return (
		<div style={{	display: 'flex', backgroundColor: `${getFadedColor(value)}`, borderRadius: '8px', color: getTextColor(`${value}-text`), padding: '1px', margin: '3px' }}>

				{value && <div >
					<p style={{ height: 'inherit', margin: '2px 8px 2px 8px',  }}>{value}</p>
				</div>}
			

		</div>
	);
};

export default ResourceNugget;



