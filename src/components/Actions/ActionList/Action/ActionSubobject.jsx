import { Avatar, Box, Divider, Flex, Heading, Tag, Wrap } from "@chakra-ui/react";
import React from "react";
import { getFadedColor, getTime } from "../../../../scripts/frontend";
import socket from "../../../../socket";
import NewResult from "../../Modals/NewResult";
import ActionButtons from "./ActionHeader/ActionButtons";
import ActionMarkdown from "./ActionMarkdown";
import CharacterNugget from "../../../Common/CharacterNugget";
import ActionForm from "../../Forms/ActionForm";
import ActionResources from "./ActionResources";
import ActionEffort from "./ActionEffort";


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
			result: subObject._id,
      model: subObject.model
		};
		socket.emit('request', {
			route: 'action',
			action: 'deleteSubObject',
			data
		});
  };

  const handleSubmit = async (incoming) => {
    const { effort, assets, description, intent, name, actionType, myCharacter, collaborators } = incoming;
    try {
      const data = {
        submission: {
          effort: effort,
          assets: assets.filter(el => el),
          description: description,
          intent: intent,
          id: subObject._id,
        },
        name: name,
        type: actionType.type,
        id: action._id,
        creator: myCharacter._id,
        numberOfInjuries: myCharacter.injuries.length,
      };
      // 1) make a new action 
      socket.emit('request', { route: 'action', action: 'updateSubObject', data });
    }
    catch (err) {
      // toast({
      //   position: "top-right",
      //   isClosable: true,
      //   status: 'error',
      //   duration: 5000,
      //   id: err,
      //   title: err,
      // });
    }
  };

  const borderColor = subObject.diceResult ? subObject?.description : subObject.model;

  return ( 
    <div>
      <div key={subObject._id} style={{ 
        border: subObject.status === 'Public' ? `3px solid ${getFadedColor(borderColor)}` : `3px dotted ${getFadedColor(borderColor)}`, 
        borderRadius: '5px', padding: '5px' }}>
        <Flex style={{ backgroundColor: getFadedColor(subObject.model), padding: '10px' }} >
          <Box
            display='flex'
            flex={1}
            alignItems='center'
          >
          <CharacterNugget character={creator} />
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
              </Box>
              <Box
                  fontSize={'.9rem'}
                  fontWeight={'normal'}
              >
                  {time}
              </Box>
              <Tag variant={'solid'} colorScheme="teal" >{subObject.status}</Tag>
            </Box>
          </Flex>
          <Flex flex={1}>
            <Box marginLeft='auto'>
              <ActionButtons
                action={subObject}
                toggleEdit={() => setMode(subObject.model)}
                creator={creator}
                handleDelete={handleDelete}
              />
            </Box>
          </Flex>          
        </Flex>
        {mode}

        {mode !== 'Submission' && <Box>
          {subObject.description && <ActionMarkdown
            header={'Description'}
            markdown={subObject.description}
          />}
          {subObject.intent && <ActionMarkdown
            header={'Intent'}
            markdown={subObject.intent}
          />}
          {subObject.body && <ActionMarkdown
            header={'Body'}
            markdown={subObject.body}
          />}
          {subObject.effort && <ActionEffort 
            submission={subObject}
          />}
          {subObject.assets && <ActionResources
            assets={subObject.assets}
          />}

          {subObject.diceResult && <Wrap justify='center'>
            {subObject.diceResult.map(die => (
                <div key={die._id} style={{  textAlign: 'center', padding: '5px', border: die.amount< action.submission.difficulty ? '' :`2px solid ${getFadedColor(action.type)}` }} >
                  {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/d${die.sides}.png` : '/images/unknown.png'} alt={die.sides} />}
                  <b>{die.amount}</b>
                </div>
            ))}
          </Wrap>}

        </Box>}

        {mode === 'Submission' && <ActionForm collabMode defaultValue={subObject} actionType={action.type} handleSubmit={(data) =>handleSubmit(data)} closeNew={() => setMode(false)} />}
      </div>    
      <Divider orientation='vertical' />   

      <NewResult
        show={mode === 'Result'}
        mode={"updateSubObject"}
        result={subObject}
        closeNew={() => setMode(false)}
        selected={action}
      />
    </div>

   );
}
 
export default ActionSubObject;