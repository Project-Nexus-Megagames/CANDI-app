import React, { useState } from "react";
import { Button, } from "@chakra-ui/react";
import { CandiDrawer } from '../Common/Drawer';
import { ArticleForm } from './ArticleForm';

const ArticleDrawer = (props) => (
  <CandiDrawer {...props}>
    <ArticleForm />
  </CandiDrawer>
)

const ArticleModal = (props) => (
  <ArticleModal {...props} >
    <ArticleForm />
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
      <Button onClick={() => handleOpen()} color={isOpen ? 'red' : 'green'}>Add Article</Button> 
      { drawer ? <ArticleDrawer open={isOpen} onClose={handleClose} />
        : <ArticleModal open={isOpen} onClose={handleClose} />
      }
    </>
  )

};
