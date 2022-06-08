// import "./Sidebar.css";
import React, { useState } from 'react';
import { Loader, Sidebar } from 'rsuite';

export const MySideBar = ({ width, height, children, onSelect, entered }) => {
	const [xPosition, setX] = useState(-width);
	//const [setInfo] = useState(false);
	//const [setAsset] = useState(null);

	const toggleMenu = () => {
		if (xPosition < 0) {
			setX(0);
		} else {
			setX(-width);
		}
	};

	//const listStyle = (item) => {
	//	if (
	//		entered.some((el) =>
	//			typeof el !== 'undefined' ? el._id === item._id : false
	//		)
	//	)
	//		return { cursor: 'not-allowed', color: 'rgb(155, 155, 155)' };
	//	else return;
	//};

	//const closeInfo = () => {
	//	setInfo(false);
	//};

	//const openInfo = (asset) => {
	//	setAsset(asset);
	//	setInfo(true);
	//};

	return (
		<React.Fragment>
			<Sidebar width={width + xPosition} style={{ transition: '0.8s ease' }}>
				<div
					className="side-bar"
					style={{
						transform: `translatex(${xPosition}px)`,
						width: width,
						minHeight: '100vh'
					}}
				>
					<button
						onClick={() => toggleMenu()}
						className="toggle-menu"
						style={{
							transform: `translate(${width}px, 20vh)`
						}}
					></button>

					{!children && <Loader />}
				</div>
			</Sidebar>
		</React.Fragment>
	);
};
