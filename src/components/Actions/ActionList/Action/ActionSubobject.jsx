import { Avatar, Box, Divider, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { getFadedColor, getTime } from "../../../../scripts/frontend";
import socket from "../../../../socket";
import NewResult from "../../Modals/NewResult";
import ActionButtons from "./ActionHeader/ActionButtons";
import ActionMarkdown from "./ActionMarkdown";


const ActionSubObject = (props) => {
  const { subObject, action } = props;
  const time = getTime(subObject.createdAt);
  const creator = subObject.resolver ? subObject.resolver :
                  subObject.effector ? subObject.effector :
                  subObject.creator ? subObject.creator :
                  subObject.commentor;
                  
  const [mode, setMode] = React.useState(false);

  const handleDelete = async () => {
    const data = {
			id: action._id,
			result: subObject._id
		};
		socket.emit('request', {
			route: 'action',
			action: 'deleteSubObject',
			data
		});
  };

  return ( 
    <div>
      <div key={subObject._id} style={{ border: `3px solid ${getFadedColor(subObject.model)}`, borderRadius: '5px', padding: '5px' }}>
        <Flex style={{ backgroundColor: getFadedColor(subObject.model), padding: '10px' }} >
          <Box
            display='flex'
            flex={1}
            alignItems='center'
          >
          <Avatar
            name={creator?.characterName}
            src={creator?.profilePicture}
            marginRight='auto'
          />
          </Box>
          <Flex flex={3}>
            <Box
              alignItems='center'
              justifyContent='center'
              width='100%'
            >
              <Heading
                  size={'md'}
                  textAlign={'center'}
              >
                  {subObject.status} - {subObject.model}
              </Heading>
              <Box
                  fontSize={'.9rem'}
                  fontWeight={'normal'}
              >
                  {creator.playerName} - {creator.characterName}
              </Box>
              <Box
                  fontSize={'.9rem'}
                  fontWeight={'normal'}
              >
                  {time}
              </Box>
            </Box>
          </Flex>
          <Flex flex={1}>
            <Box marginLeft='auto'>
              <ActionButtons
                action={subObject}
                toggleEdit={() => setMode('edit_result')}
                creator={creator}
                handleDelete={handleDelete}
              />
            </Box>
          </Flex>          
        </Flex>

        <Box>
          <ActionMarkdown
              markdown={subObject.description ? subObject.description : subObject.body}
          />
        </Box>
      </div>    
      <Divider orientation='vertical' />   

      <NewResult
        show={mode === 'edit_result'}
        mode={"updateSubObject"}
        result={subObject}
        closeNew={() => setMode(false)}
        selected={action}
      />
    </div>

   );
}
 
export default ActionSubObject;