import React, { useState } from 'react';
import { CandiDrawer } from '../Common/Drawer';
import { ArticleForm } from './ArticleForm';
import { Button, Icon } from 'rsuite';
import { CandiModal } from '../Common/Modal';

const ArticleDrawer = (props) => (
	<CandiDrawer {...props}>
		<ArticleForm onCancel={() => props.onClose()} onSubmit={() => props.onClose()} onPublish={() => props.onClose()} />
	</CandiDrawer>
);

const ArticleModal = (props) => (
	<CandiModal {...props}>
		<ArticleForm onCancel={() => props.onClose()} onSubmit={() => props.onClose()} onPublish={() => props.onClose()} />
	</CandiModal>
);

export const NewArticle = ({ drawer }) => {
	const [isOpen, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			{/* FIXME: Please make the button component below look however you would like */}
			<Button style={{ color: 'black', borderRadius: '0px 5px 5px 0px' }} onClick={() => handleOpen()} color={isOpen ? 'red' : 'green'}>
				<Icon icon="plus" />
			</Button>
			{drawer ? <ArticleDrawer title="Submit Article" open={isOpen} onClose={handleClose} /> : <ArticleModal title="Submit Article" open={isOpen} onClose={handleClose} />}
		</>
	);
};
