import React, { useState } from 'react';
import { CandiModal } from '../Common/CandiModal';

function AssetInfo({asset, showInfo, closeInfo}) {
	const [arcane, setArcane] = useState(false);

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

    if (!showInfo) {
        return <></>;
    }

    return (
      <CandiModal>
        				<p>Dice: {asset.dice}</p>
				{asset.type === 'Bond' && <b>Level: {asset.level}</b>}
				<p>{asset.description}</p>
				{asset.uses !== 999 && (
					<React.Fragment>
						<div>
							<b>Uses: {asset.uses}</b>{' '}
						</div>
					</React.Fragment>
				)}
      </CandiModal>
	);
}

export default AssetInfo;
