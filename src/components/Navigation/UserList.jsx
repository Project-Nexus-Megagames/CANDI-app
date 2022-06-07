import React from 'react';
import { useSelector } from 'react-redux'
import { IconButton, Icon, Badge, Whisper, Popover, Tag } from 'rsuite'; // rsuite components



const UserList = () => {
    let users = useSelector(state => state.auth.users);
    let socket = useSelector(state => state.auth.socket);
    let userList = []
    let online = users.length;
    let uncredentialed = 0
    for (let el of users) {
        uncredentialed = 0
         if (el.username !== undefined) {
            userList.push(el)
        }
    };

    return (
        <div >
        <Whisper trigger="click" placement='bottomEnd' speaker={
            <Popover title="User List">
                {(uncredentialed > 0) ? <span>{uncredentialed} not signed in</span> : null }
                {userList.length > 0 && socket !== null ? 
                <React.Fragment>
                    <ul>
                        {userList.map(user => (
                            <li id={user.character}>{user.character} | {user.clientVersion}  </li>
                        ))}
                    </ul>
                </React.Fragment> : null }
            </Popover>} >
            <Badge content={online} >
                <IconButton icon={<Icon icon="user" />} circle size="md" />
            </Badge>
      </Whisper>
      </div>
    );
}
 
export default UserList;