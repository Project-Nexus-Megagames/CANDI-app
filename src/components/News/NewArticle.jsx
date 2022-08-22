import React, { useState } from "react";
import { CandiDrawer } from '../Common/Drawer';
import { ArticleForm } from './ArticleForm';
import { Button, Icon } from 'rsuite';

const ArticleDrawer = (props) => (
  <CandiDrawer {...props}>
    <ArticleForm onCancel={() => props.onClose()} />
  </CandiDrawer>
)

const ArticleModal = (props) => (
  <ArticleModal {...props} >
    <ArticleForm onCancel={() => props.onClose()} />
  </ArticleModal>
)

export const NewArticle = ({ drawer }) => {
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      {/* FIXME: Please make the button component below look however you would like */}
      <Button style={{ color: 'black', borderRadius: '0px 5px 5px 0px' }} onClick={() => handleOpen()} color={isOpen ? 'red' : 'green'}>
				<Icon icon="plus" />
			</Button>
      { drawer ? <ArticleDrawer title="Submit Article" open={isOpen} onClose={handleClose} />
        : <ArticleModal title="New Article" open={isOpen} onClose={handleClose} />
      }
    </>
  )

};
