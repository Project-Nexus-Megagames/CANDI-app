import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useDisclosure,
  Textarea,
  AlertDialog,
  AlertDialogOverlay,
  Image,
  Divider,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
  Drawer,
  DrawerBody,
  Button,
  ButtonGroup,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Center,
  Box,
  Avatar,
  HStack,
  Stack,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { getDateString } from "../../scripts/dateTime";
import { getMyCharacter } from "../../redux/entities/characters";
import socket from "../../socket";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoTrashBin } from "react-icons/io5";

const ViewArticle = (props) => {
  const [newComment, setNewComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const duck = useSelector((state) => state.gamestate.duck);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const myChar = useSelector(getMyCharacter);

  let article = props.selected;

  const getDuck = () => {
    if (duck)
      return {
        backgroundImage: `url("https://c.tenor.com/xXMKqzQrpJ0AAAAM/skeleton-trumpet.gif")`,
        color: "red",
        fontFamily: "Spook",
      };
  };

  const deleteComment = (commentId) => {
    const data = {
      id: props.selected.articleId,
      comment: commentId,
    };
    if (article.type === "newsArticle") {
      socket.emit("request", {
        route: "article",
        action: "deleteComment",
        data,
      });
    } else {
      socket.emit("request", {
        route: "action",
        action: "deleteSubObject",
        data,
      });
    }
    setCommentId("");
    onClose;
  };

  const handleComment = () => {
    const comment = { body: newComment, commentor: myChar._id };
    const data = { id: props.selected.articleId, comment };
    if (article.type === "newsArticle") {
      socket.emit("request", { route: "article", action: "comment", data });
    } else {
      socket.emit("request", { route: "action", action: "comment", data });
    }
    setNewComment("");
  };

  return (
    <Drawer
      isOpen={props.isOpen}
      placement='top'
      size='full'
      show={props.show}
      closeOnEsc='true'
      onClose={() => {
        props.closeDrawer();
      }}
    >
      <DrawerOverlay />
      <DrawerContent bgColor='#0f131a' style={getDuck()}>
        <DrawerCloseButton />
        <DrawerHeader align='center'></DrawerHeader>
        <DrawerBody>
          <Center maxW='960px' mx='auto'>
            <Stack fontSize='sm' px='4' spacing='4' margin='5px'>
              <Text fontSize='6xl'>{article?.title}</Text>
              <Stack direction='row' justify='space-between' spacing='4'>
                <HStack spacing='4'>
                  <Avatar src={article?.authorProfilePicture} boxSize='10' />
                  <Box>
                    <Text fontWeight='medium' color='emphasized'>
                      by {article?.author} - {getDateString(article?.date)}
                    </Text>
                  </Box>
                </HStack>
              </Stack>
              <Divider />
              <VStack>{article?.imageURL && <Image src={article?.imageURL} maxW='960px' />}</VStack>

              <ReactMarkdown children={article?.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>

              <Divider orientation='horizontal' />
              <Textarea value={newComment} componentClass='textarea' placeholder='Leave a Comment!' rows={3} onChange={(e) => setNewComment(e.target.value)} />
              <Button bg='black' onClick={() => handleComment()}>
                Send Comment
              </Button>
              <HStack hover>
                {article?.comments.map((comment, index) => (
                  <div key={index}>
                    <Stack align='left'>
                      <HStack align='left'>{/* <TeamAvatar size={'sm'} code={'none'} />  */}</HStack>
                      <VStack align='left'>
                        <Stack direction='row' justify='space-between' spacing='4'>
                          <HStack>
                            <Avatar src={comment.commentor.profilePicture} boxSize='10' />
                            <b>{comment.commentor.characterName}</b>
                          </HStack>
                          <HStack>
                            <ButtonGroup>
                              {comment.commentor._id === myChar._id && (
                                <IconButton
                                  size='xs'
                                  onClick={() => {
                                    onOpen(setCommentId(comment._id));
                                  }}
                                  color='red'
                                  icon={<IoTrashBin icon='trash2' />}
                                />
                              )}
                            </ButtonGroup>
                          </HStack>
                        </Stack>
                        <p>{comment.body}</p>
                      </VStack>
                    </Stack>
                  </div>
                ))}
              </HStack>
            </Stack>
          </Center>
        </DrawerBody>
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent bgColor='#0f131a'>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Comment
              </AlertDialogHeader>
              <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} bgColor='black'>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={() => onClose(deleteComment(commentId))} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewArticle;
