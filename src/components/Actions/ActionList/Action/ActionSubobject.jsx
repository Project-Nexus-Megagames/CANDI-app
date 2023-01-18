import { Avatar, Box, Divider, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { getFadedColor, getTime } from "../../../../scripts/frontend";
import ActionButtons from "./ActionHeader/ActionButtons";
import ActionMarkdown from "./ActionMarkdown";


const ActionSubObject = (props) => {
  const { subObject, toggleEdit } = props;
  const time = getTime(subObject.createdAt);
  const creator = subObject.resolver ? subObject.resolver :
                  subObject.effector ? subObject.effector :
                  subObject.commentor;
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
                          name={creator.characterName}
                          src={creator.profilePicture}
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
                              {subObject.model}
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
                              toggleEdit={toggleEdit}
                              creator={creator}
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
    </div>

   );
}
 
export default ActionSubObject;