import React, { useState } from 'react';
import { Button, Divider, Modal, Tag } from 'rsuite';
import { useSelector } from "react-redux";

function AssetInfo({asset, showInfo, closeInfo}) {
	const [arcane, setArcane] = useState(false);
	const assetList = useSelector(state => state.assets.list);

	const handleClose = () => {
		closeInfo();
		setArcane(false);
	};

	const handleShow = () => {
		if (asset.tags) {
			for (const el of asset.tags) {
				if (el === 'arcane') setArcane(true);
			}
		}
	};

	if (!asset) {
		return <></>
	}

	return (
		<Modal
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
						<Divider/>{' '}
						<div>
							<b>Uses: {asset.uses}</b>{' '}
							{arcane && <Tag color="violet">Arcane</Tag>}
						</div>
					</React.Fragment>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={() => handleClose()}
					color="red"
					appearance="ghost"
				>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AssetInfo;
