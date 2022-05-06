import React from 'react';
import { Button, Divider,  Modal } from 'rsuite';

function AssetInfo({ asset, showInfo, closeInfo }) {
	return (
		<Modal
		style={{ width: '90%' }}

		 show={showInfo} onHide={() => closeInfo()} >
		<Modal.Header>
					<Modal.Title>{asset.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Dice: {asset.dice}</p>
					{asset.type === 'Bond' && <b>Level: {asset.level}</b>}
					<p>{asset.description}</p>
          {asset.uses !== 999 && <React.Fragment>
          <Divider/> <b>Uses: {asset.uses}</b>
          </React.Fragment>}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => closeInfo()} color='red' appearance="ghost">
						Close
					</Button>
				</Modal.Footer>
		</Modal>
	);
}

export default AssetInfo;