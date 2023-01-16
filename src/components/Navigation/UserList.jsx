import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon, PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
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
      <Popover>
        <PopoverTrigger>
          <IconButton icon={<SearchIcon />} circle size="md" />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Confirmation!</PopoverHeader>
          <PopoverBody>
            {uncredentialed > 0 ? (
                <span>{uncredentialed} not signed in</span>
              ) : null}
              {userList.length > 0 && socket !== null ? (
                <React.Fragment>
                  <ul>
                    {userList.map((user) => (
                      <li id={user.character} key={user.character}>
                        {user.character} | {user.clientVersion}{' '}
                      </li>
                    ))}
                  </ul>
                </React.Fragment>
              ) : null}
          </PopoverBody>
        </PopoverContent>
      </Popover>
		</div>
	);
};

export default UserList;
