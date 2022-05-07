import React, { useState, useEffect } from 'react';
import { Button, Divider, Modal, Tag } from 'rsuite';

function AssetInfo({ asset, showInfo, closeInfo }) {
	const [arcane, setArcane] = useState(false);

	const handleClose = () => {
		closeInfo();
		setArcane(false);
	};

	const handleShow = () => {
		console.log(asset);
		if (asset.tags) {
			for (const el of asset.tags) {
				if (el === 'arcane') setArcane(true);
				console.log(el);
			}
		}
	};

	return (
		<Modal
			style={{ width: '90%' }}
			show={showInfo}
			onHide={() => handleClose()}
			onEnter={() => handleShow()}
		>
			<Modal.Header>
				<Modal.Title>{asset.name}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Dice: {asset.dice}</p>
				{asset.type === 'Bond' && <b>Level: {asset.level}</b>}
				<p>{asset.description}</p>
				{asset.uses !== 999 && (
					<React.Fragment>
						<Divider />{' '}
						<div>
							<b>Uses: {asset.uses}</b>{' '}
							{arcane && <Tag color="violet">Arcane</Tag>}
						</div>
					</React.Fragment>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={() => handleClose()} color="red" appearance="ghost">
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AssetInfo;
