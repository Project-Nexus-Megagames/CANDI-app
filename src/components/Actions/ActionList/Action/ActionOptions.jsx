import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Center, Flex, Heading, Icon, IconButton, Progress, SimpleGrid, Tag, Tooltip, Wrap, useBreakpointValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import { CloseIcon } from "@chakra-ui/icons";
import WordDivider from "../../../Common/WordDivider";
import AssetCard from "../../../Common/AssetCard";
import ActionMarkdown from "./ActionMarkdown";
import { getFadedColor, getThisTeamFromAccount } from "../../../../scripts/frontend";
import SupportOffer from "../../../Common/SupportOffer";
import socket from "../../../../socket";
import ResourceNugget from "../../../Common/ResourceNugget";
import { getCharAccount, getTeamAccount } from "../../../../redux/entities/accounts";
import TeamAvatar from "../../../Common/TeamAvatar";
import CharacterTag from "../../../Common/CharacterTag";
import { ArrowLeft } from "@rsuite/icons";
import { FaRecycle } from "react-icons/fa";

function ActionOptions({ options, actionType, action }) {
  const assetList = useSelector(state => state.assets.list);
  const { isControl } = usePermissions();
  const [description, setDescription] = useState(options.description);
  const [mode, setMode] = React.useState(false);
  const [slots, setSlots] = React.useState([]);

  const teamAccount = useSelector(getTeamAccount);
  const charAccount = useSelector(getCharAccount);

  const myTeam = useSelector(s => s.auth.team);
  const account = useSelector(s => s.accounts.list[0]);
  const accounts = useSelector(s => s.accounts.list);
  const teams = useSelector(s => s.teams.list);
  const myCharacter = useSelector(state => state.auth.myCharacter);

  const breakpoints = useBreakpointValue({
    base: { columns: 0, rows: 4, width: '15rem', bottom: '1.75rem', left: '7.5rem' },
    md: { columns: 4, rows: 0, width: '10rem', bottom: '1.75rem', left: '5rem' },
    lg: { columns: 4, rows: 0, width: '15rem', bottom: '1.75rem', left: '7.5rem' }
  })

  useEffect(() => {
    newMap(options.length);
  }, [options])

  function getAsset(assetID) {
    return assetID ? assetList.find((el) => el._id === assetID) : null;
  }

  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(undefined);
    }
    setSlots(arr);
  }

  const submitSupport = async (data) => {
    socket.emit('request', {
      route: 'action', action: 'support',
      data: { ...data, optionId: mode, actionId: action._id, contributor: charAccount._id, commentor: myCharacter._id, character: myCharacter._id }
    }
    );
    setMode(false)
  }

  // change this to add value to resources on an Agenda
  const agendaValue = (resource, value) => {
    switch (resource) {
      // case 'agenda_effort': return 20 * value;
      default: return 1 * value;
    }
  }

  const getResourceValue = (resources) => {
    let progress = 0;
    for (let resource of resources) {
      progress += agendaValue(resource.type, resource.amount)
    }
    return progress;
  }


  const calculateProgress = () => {
    let forProg = 0;
    for (let resource of options[0].resources) {
      forProg += agendaValue(resource.type, resource.amount)
    }

    for (let asset of options[0].assets) {
      for (const die of asset.dice) {
        forProg += die.amount;
      }
    }

    let agProg = 0;
    for (let resource of options[1].resources) {
      agProg += agendaValue(resource.type, resource.amount)
    }

    for (let asset of options[1].assets) {
      for (const die of asset.dice) {
        agProg += die.amount;
      }
    }

    return forProg - agProg;
  }

  const assetProgress = (option) => {
    let agProg = 0;

    for (let asset of option.assets) {
      for (const die of asset.dice) {
        agProg += die.amount;
      }
    }
    return agProg;
  }

  const removeResource = (resource, index) => {
    socket.emit('request', {
      route: 'action', action: 'removeContribution',
      data: { resource: resource._id, action: action._id, option: options[index]?._id }
    }
    );
    setMode(false)
  }

  return (
    <Box>
      <WordDivider word='Options' />
      <Center>{calculateProgress()}</Center>

      <Progress
        hasStripe

        borderRadius={'20px'}
        colorScheme={calculateProgress() > 0 ? 'green' : 'red'}
        size='lg'
        marginBottom={'15px'}
        marginLeft={'5px'}
        marginRight={'5px'}
        marginTop={'15px'} value={Math.abs(calculateProgress())} />
      <Flex
        justifyContent={'space-around'}
      >
        {slots.map((slot, index) => (
          <Box key={index} style={{ border: `2px solid ${getFadedColor(options[index]?.name)}`, width: '100%', margin: '3px', padding: '5px' }} >
            <ActionMarkdown
              header={`${options[index]?.name} (${getResourceValue(options[index]?.resources) + assetProgress(options[index])})`}
              tooltip={`You are '${options[index]?.name}' this agemda passing`}
              markdown={options[index]?.description}
              data={description}
              edit={false}
            />
            {!mode && <div style={{ textAlign: 'center' }} >
              {options[index]?.resources?.length === 0 && <h5>No Resources Supporting</h5>}
              {options[index]?.resources?.length > 0 && <h5>Resources Supporting: +{getResourceValue(options[index]?.resources)} </h5>}
              <Wrap justify="space-around" align={'center'} >
                {options[index]?.resources?.map((resource, jndex) => (
                  <Box key={resource._id} >
                    <ResourceNugget
                      label={resource.contributor &&
                        <div
                          style={{
                            padding: '5px',
                            border: `2px solid ${getFadedColor(getThisTeamFromAccount(accounts, teams, resource.contributor)).name}`,
                            textAlign:'center'
                          }} >
                          <h5>
                            <TeamAvatar account={resource.contributor} />
                            {getThisTeamFromAccount(accounts, teams, resource.contributor).name}
                          </h5>
                          {resource.character && isControl && <CharacterTag character={resource.character} />}
                        </div>}
                      fontSize={'2em'}
                      height="150px"
                      index={jndex}
                      value={`${resource.amount}`}
                      type={resource.type} />

                      {isControl && <ButtonGroup>
                      <Tooltip
                        label='Return Resource to contributor'
                        aria-label='a tooltip'>
                        <IconButton isDisabled icon={<Icon as={FaRecycle} />} colorScheme="blue" onClick={removeResource} variant='solid' />
                      </Tooltip>

                        <Tooltip
                          label='Remove Resource'
                          aria-label='a tooltip'>
                          <IconButton icon={<Icon as={CloseIcon} />} colorScheme="red" onClick={()=> removeResource(resource, index)} variant='outline' />
                        </Tooltip>

                      </ButtonGroup>}
                    </Box>
                ))}
                  </Wrap>

              { options[index]?.assets?.length === 0 && <h5>No Assets Supporting</h5> }
              { options[index]?.assets?.length > 0 && <h5>Assets Supporting: + {assetProgress(options[index])}</h5> }
              {/* <Flex justify="space-around" align={'center'} >
                          {options[index]?.assets?.map((asset, index) => (
                            <Box key={asset._id}>
                              <AssetCard asset={asset} />
                            </Box>												
                          ))}	
                        </Flex> */}
                  < SimpleGrid columns = { [2]} spacing = '40px' >
                  {
                    options[index]?.assets?.map((asset, index) => (
                      <Box key={asset._id}>
                        <AssetCard asset={asset} />
                      </Box>
                    ))
                  }
              </SimpleGrid>
            </div>}


            <Box className="styleCenter">
              {/* todo resource/asset map */}
              {mode !== options[index]?._id && <Button
                variant={'solid'}
                onClick={() => setMode(options[index]?._id)}
                colorScheme='green'>
                Support
              </Button>}

              {mode === options[index]?._id && <SupportOffer
                myAccount={charAccount}
                account={account}
                actionType={actionType}
                option={options[index]}
                status={[]}
                offer={{ resources: [], assets: [] }}
                onClose={() => setMode(false)}
                onSubmit={(data) => submitSupport(data)}
              />}
            </Box>


          </Box>

        ))}
      </Flex>
    </Box>
  );
}

export default ActionOptions;