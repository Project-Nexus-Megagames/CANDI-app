import React from 'react';
import { useDrag } from 'react-dnd';
import { connect } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';

const Worker = (props) => {
	const { asset, facility } = props;
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: 'asset',
			item: { id: asset._id, facility },
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging()
			})
		}),
		[asset]
	);

	return (
		<div style={{ cursor: 'grab', opacity: props.loading ? 0.3 : 1 }} ref={drag}>
			<ResourceNugget value={asset.level} type={'blueprint'} blueprint={asset.code} fontSize={'40px'} />
			{/* <FlexboxGrid  justify="space-around" align='middle'>
			<FlexboxGrid.Item colSpan={4}>
				<div style={{padding: '5px', border: '2px solid white', textAlign: 'center', borderRadius: '5px', }}>
					<h5>{asset.level}</h5>
				</div>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item style={{ textTransform: 'capitalize', textOverflow: 'ellipsis',  }} colSpan={18}>
				<b>{asset.name}</b>
				<p>Worker</p>
			</FlexboxGrid.Item>

		</FlexboxGrid>			 */}
		</div>
	);
};

export default Worker;
