import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const ResourceNugget = (props) => {
	const { value, amount, height, width } = props; 

	return (
		<div style={{	display: 'flex', backgroundColor: `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content'  }}>

				{value && <div >
					<p style={{ height: 'inherit', margin: '2px 8px 2px 8px', color: getTextColor(`${value}-text`), textTransform: 'capitalize' }}>{value}</p>
				</div>}

				{amount && <div >
					<p style={{ height: 'inherit', margin: '2px 8px 2px 8px',  }}>{amount}</p>
				</div>}
        
			

		</div>
	);
};

export default ResourceNugget;



