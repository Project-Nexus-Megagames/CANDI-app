import React, { Component } from 'react';
import { Button, Divider, FlexboxGrid, Modal } from 'rsuite';

function AssetInfo({ asset, showInfo, closeInfo }) {
	return (
		<Modal backdrop='static' show={showInfo} onHide={() => closeInfo()} >
		<Modal.Header>
					<Modal.Title>{asset.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
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