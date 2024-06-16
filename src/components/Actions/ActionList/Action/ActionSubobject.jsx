import { Avatar, Box, Button, Center, Divider, Flex, Heading, Spacer, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { getFadedColor, getThisTeam, getThisTeamFromAccount, getTime } from "../../../../scripts/frontend";
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
import { getTeamDice, } from "../../../../redux/entities/assets";
import ActionResources from "./ActionResources";
import ActionForm from "../../Forms/ActionForm";
import usePermissions from "../../../../hooks/usePermissions";
import AssetCard from "../../../Common/AssetCard";
import NewComment from "../../Modals/NewComment";
import MDEditor from "@uiw/react-md-editor";


const ActionSubObject = (props) => {
  const { subObject, action } = props;
  const time = getTime(subObject.createdAt);
  const creator = subObject.resolver ? subObject.resolver :
    subObject.effector ? subObject.effector :
      subObject.commentor ? subObject.commentor :
        subObject.creator ? subObject.creator :
          { playerName: "UNKNOWN!?!", characterName: "UNKNOWN!?!" };

  const { isControl } = usePermissions();
  const [mode, setMode] = React.useState(false);
  const assets = useSelector(getTeamDice);
  const { gameConfig } = useSelector((state) => state);
  const teams = useSelector(s => s.teams.list);

  const handleDelete = async () => {
    let data;
    switch (subObject.model) {
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
      case 'Submission':
        data = {
          id: action._id,
          submission: subObject._id
        };
        break;
    }



    socket.emit('request', {
      route: 'action',
      action: 'deleteSubObject',
      data
    });
  };

  const handleSubmit = async (incoming) => {
    const { effort, assets, description, intent, name, actionType, myCharacter } = incoming;
    try {
      const data = {
        submission: {
          assets: assets.filter(el => el),
          description: description,
          intent: intent,
          id: subObject._id,
        },
        id: action._id,
        creator: myCharacter._id,
      };
      // 1) make a new action 
      socket.emit('request', { route: 'action', action: 'updateSubObject', data });
    }
    catch (err) {
      console.log(err)
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

  if (!creator) return <b>???</b>

  const team = getThisTeam(teams, creator._id);

  return (
    <Center>
      <div key={subObject._id}
        style={{
          // border: (subObject.model == "Comment" && team) ? `3px solid ${team?.color}` : `3px solid ${getFadedColor(subObject.model)}`,
          border: `3px solid ${getFadedColor(subObject.model)}`,
          borderRadius: '5px',
          padding: '5px',
          width: '85%'
        }}>
        <Flex justify={'center'}
          style={{
            backgroundColor: (subObject.model == "Comment" && team.color) ? `${team?.color}` : `${getFadedColor(subObject.model)}`,
            padding: '10px'
          }} >

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
              {isControl && <b>({subObject.status})</b>} {subObject.model}
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
              toggleEdit={() => setMode('edit' + subObject.model)}
              creator={creator}
              handleDelete={handleDelete}
            />
          </Box>

        </Flex>

        {(mode !== 'editSubmission' && mode !== 'editComment'&& mode !== 'editEffect') && <Box>
          {subObject.__t !== "Contract" && <MDEditor.Markdown
            style={{ textAlign: 'left', padding: '0.4rem', backgroundColor: '#283242' }}
            source={subObject.description ? subObject.description : subObject.body}
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
                  onClick={() => socket.emit("request", {
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
              actionType={gameConfig.actionTypes.find(el => el.type === action.type)}
              assets={subObject.assets}
              toggleAssetInfo={(data) => console.log(data)}
            />
          }

          {subObject.asset && <AssetCard asset={subObject.asset} />}
        </Box>}

        {(mode === 'editSubmission') && action.type &&
          <ActionForm
            collabMode
            defaultValue={subObject}
            tags={action.tags}
            actionType={action.type}
            handleSubmit={(data) => handleSubmit(data)}
            closeNew={() => setMode(false)}
            actionID={subObject._id}
          />}

        {mode === 'editComment' && <NewComment
          show={mode === 'editComment'}
          mode={"updateSubObject"}
          comment={subObject}
          closeNew={() => setMode(false)}
          selected={action}
        />}
        {mode === 'editEffect' && <NewComment
          show={mode === 'editEffect'}
          mode={"updateSubObject"}
          comment={subObject}
          closeNew={() => setMode(false)}
          selected={action}
        />}
      </div>
      {/* <Divider orientation='vertical' />    */}



      <NewResult
        show={mode === 'editResult'}
        mode={"updateSubObject"}
        result={subObject}
        closeNew={() => setMode(false)}
        selected={action}
      />

    </Center>

  );
}

export default ActionSubObject;