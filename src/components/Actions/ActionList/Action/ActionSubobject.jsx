import { Avatar, Box, Button, Center, Divider, Flex, Heading, Spacer, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { getFadedColor, getTime } from "../../../../scripts/frontend";
import socket from "../../../../socket";
import NewResult from "../../Modals/NewResult";
import ActionButtons from "./ActionHeader/ActionButtons";
import ActionMarkdown from "./ActionMarkdown";
import CharacterNugget from "../../../Common/CharacterNugget";
import Contract from "../../../Common/Contract";
import Ice from "../../../Team/Ice";
import { RaidIce } from "../../../Hacking/RaidIce";
import { ActionIce } from "./ActionIce";
import { useSelector } from "react-redux";
import { getTeamDice,  } from "../../../../redux/entities/assets";
import ActionResources from "./ActionResources";


const ActionSubObject = (props) => {
  const { subObject, action } = props;
  const time = getTime(subObject.createdAt);
  const creator = subObject.resolver ? subObject.resolver :
                  subObject.effector ? subObject.effector :
                  subObject.commentor ? subObject.commentor : 
                  { playerName: "UNKNOWN!?!", characterName: "UNKNOWN!?!"  };
                  
  const [mode, setMode] = React.useState(false);
  const assets = useSelector(getTeamDice);
  const { gameConfig } = useSelector((state) => state);

  const handleDelete = async () => {
    let data;
    switch(subObject.model) {
      case 'Comment':
        data = {
          id: action._id,
          comment: subObject._id
        };
      break;
      case 'Result':
        data = {
          id: action._id,
          result: subObject._id
        };
      break;
      case 'Effect':
        data = {
          id: action._id,
          effect: subObject._id
        };
      break;
    }

    

		socket.emit('request', {
			route: 'action',
			action: 'deleteSubObject',
			data
		});
  };
  if (!creator) return <b>???</b>
  return ( 
    <div>
      <div key={subObject._id} style={{ border: `3px solid ${getFadedColor(subObject.model)}`, borderRadius: '5px', padding: '5px' }}>
        <Flex justify={'center'} style={{ backgroundColor: getFadedColor(subObject.model), padding: '10px' }} >

          <CharacterNugget character={creator} />

          <Spacer />

          <Box
              alignItems='center'
              justifyContent='center'
            >
              <Heading
                  size={'md'}
                  textAlign={'center'}
              >
                  {subObject.__t}
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

          <Spacer />
            
          <Box marginLeft='auto'>
            <ActionButtons
              action={subObject}
              toggleEdit={() => setMode('edit'+subObject.model)}
              creator={creator}
              handleDelete={handleDelete}
            />
          </Box>    

        </Flex>

        <Box>
          {subObject.__t !== "Contract" && <ActionMarkdown
              markdown={subObject.description ? subObject.description : subObject.body}
          />}
          {subObject.__t === "Contract" && 
            <Contract show contract={subObject} />
          }
          {subObject.model === "Ice" && 
            <div>                                 
              <Wrap justify="space-around">
               <Ice ice={subObject} width={500} />
               
               <WrapItem  >
                {subObject.options &&
                  subObject.options.map((subRotuine, index) => (
                    <Box
                      key={subRotuine._id}
                      colSpan={18 / subObject.options.length}
                    >
                      <Divider vertical />
                      {subRotuine.description && (
                        <p>{subRotuine.description}</p>
                      )}
                      <Divider vertical />
                      <ActionIce
                        show={mode === 'addDice'}
                        action={action}
                        ice={subObject}
                        assets={assets}
                        loading={props.loading}
                        subRotuine={subRotuine}
                        index={index}
                      />
                    </Box>
                  ))}                
               </WrapItem>

              </Wrap>
                     
              <Center>
                {mode !== 'addDice' && <Button variant={'solid'} colorScheme="green" onClick={() => setMode('addDice')} >Add Dice</Button>}
                {mode !== 'addDice' && <Button variant={'solid'} colorScheme="green" 
                                onClick={() =>     socket.emit("request", {
                                  route: "action",
                                  action: "roll",
                                  data: { id: action._id, ice: subObject._id },
                                })}>Roll</Button>}
                {mode === 'addDice' && <Button variant={'solid'} colorScheme="green" onClick={() => setMode(false)} >Finish</Button>}
              </Center>
            </div>
          }
          
          {subObject.assets && subObject.assets.length > 0 &&
              <ActionResources
              actionType={gameConfig.actionTypes.find(el => el.type === action.type )}
              assets={subObject.assets}
              toggleAssetInfo={(data) => console.log(data)}
            />
          }
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