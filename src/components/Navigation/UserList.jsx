import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon, PlusSquareIcon, ChatIcon, StarIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  IconButton,
  Badge,
  Button,
  Center,
} from '@chakra-ui/react'


const UserList = () => {
	let users = useSelector((state) => state.auth.users);
	let socket = useSelector((state) => state.auth.socket);
	let userList = [];
	let online = users.length;
	let uncredentialed = 0;
	for (let el of users) {
		uncredentialed = 0;
		if (el.username !== undefined) {
			userList.push(el);
		}
	}

	return (
		<div>
      <Popover >
        <PopoverTrigger>
          <Button variant={'outline'}  leftIcon={<StarIcon />} circle size="md"><Badge>{userList.length}</Badge></Button>
        </PopoverTrigger>
        <PopoverContent style={{ backgroundColor: '#0f131a' }}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Online Users: {online}</PopoverHeader>
          <PopoverBody  >
            {uncredentialed > 0 ? (
                <span>{uncredentialed} not signed in</span>
              ) : null}
              {userList.length > 0 && socket !== null ? (
                <React.Fragment>
                  <Center>
                    {userList.map((user, index) => (
                      <li id={user.username + index} key={user.character}>
                        {user.character} | {user.clientVersion}{' '}
                      </li>
                    ))}
                  </Center>
                </React.Fragment>
              ) : null}
          </PopoverBody>
        </PopoverContent>
      </Popover>
		</div>
	);
};

export default UserList;
