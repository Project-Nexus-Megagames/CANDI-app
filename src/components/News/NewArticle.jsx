import React, { useState } from 'react';
import { CandiDrawer } from '../Common/Drawer';
import { ArticleForm } from './ArticleForm';
import { CandiModal } from '../Common/CandiModal';
import { Button } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';

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
			<Button colorScheme={"green"} style={{ color: 'black', borderRadius: '0px 5px 5px 0px' }} onClick={() => handleOpen()} color={isOpen ? 'red' : 'green'}>
				<PlusSquareIcon icon="plus" />
			</Button>
			{drawer ? <ArticleDrawer title="Submit Article" open={isOpen} onClose={handleClose} /> : <ArticleModal title="Submit Article" open={isOpen} onClose={handleClose} />}
		</>
	);
};
