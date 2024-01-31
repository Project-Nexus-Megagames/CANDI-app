import React, { useEffect, useState } from 'react';
const { city, premade, science, properName, verbs, mythGod, animal, adj, adjGob, food, physical, premadeGob } = require('./generatorSeeds.js');
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Box,
  Input,
  InputLeftElement,
  InputGroup,
  IconButton,
} from '@chakra-ui/react'
import { useSteps } from '@chakra-ui/stepper';
import axios from 'axios';
import { setCharacter } from '../../redux/entities/auth';
import { getMyCharacter } from '../../redux/entities/characters';
import { Random } from '@rsuite/icons';
import AssetCard from '../Common/AssetCard';
import { gameServer } from '../../config.js';

const CharacterCreation = (props) => {
  const blueprints = useSelector(s => s.blueprints.list);
  const teams = useSelector(s => s.teams.list);
  const characters = useSelector(s => s.characters.list);
  const { login, team, myCharacter } = useSelector(s => s.auth);
  const myChar = useSelector(getMyCharacter);

  const myTeam = myCharacter ? teams.find((el) => el.characters.some((user) => user._id == myCharacter._id)) : false

  let [occupations, setOccupations] = React.useState([]);
  let [occupation, setOccupation] = React.useState(false);
  let [name, setName] = React.useState('');
  let [bio, setBio] = React.useState('');
  const reduxAction = useDispatch();

  const steps = [
    { title: 'Welcome', description: 'Get Started' },
    { title: 'Occupation', description: 'What do you do for a living?' },
    { title: 'Inheritemce', description: 'Inheritemce' },
    { title: 'Character Details', description: 'Name, Species, and Goals' },
  ]

  const generateName = async () => {
    const coin = Math.floor(Math.random() * 6);
    let name = ''
    switch (coin) {
      case 0:
        name = (`${adjGob[(Math.floor(Math.random() * adjGob.length))]} ${food[(Math.floor(Math.random() * food.length))]}`);
        break;
      case 1:
        name = (`${food[(Math.floor(Math.random() * food.length))]} ${food[(Math.floor(Math.random() * food.length))]}`);
        break;
      case 2:
        name = (`${adjGob[(Math.floor(Math.random() * adjGob.length))]} ${physical[(Math.floor(Math.random() * physical.length))]}`);
        break;
      case 3:
        name = (`${physical[(Math.floor(Math.random() * physical.length))]} ${physical[(Math.floor(Math.random() * physical.length))]}`);
        break;
      case 4:
        name = (`${adjGob[(Math.floor(Math.random() * adjGob.length))]} ${adjGob[(Math.floor(Math.random() * adjGob.length))]}`);
        break;
      case 5:
        name = (`${adj[(Math.floor(Math.random() * adj.length))]} ${physical[(Math.floor(Math.random() * physical.length))]}`);
        break;
      default:
        name = (premadeGob[(Math.floor(Math.random() * premadeGob.length))]);
    }
    setName(name.charAt(0).toUpperCase() + name.slice(1))
  }

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  useEffect(() => {
    console.log(myTeam)
  }, [occupation]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data } = await axios.post(`${gameServer}/api/blueprints/characterCreation/`, { occupation: myCharacter.bio });
        setOccupations(data);
      }

      // if (occupations.length === 0) fetchData().catch(console.error);
    }
    catch (err) {
      console.log(err)
      // Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
    }
  }, [myCharacter]);

  const submitCreation = () => {
    reduxAction(setCharacter(characters[0]))
  }

  const disabledConditions = [
    {
      text: "Description is too short",
      disabled: bio.length < 10
    },
    {
      text: "Description is too long!",
      disabled: bio.length >= 1000
    },
    {
      text: "Name is too short",
      disabled: name.length < 10
    },
    {
      text: "Name is too long!",
      disabled: name.length >= 1000
    },
    {
      text: "Location required",
      disabled: false
    },
    // {
    //   text: "Not Enough Resources for this action",
    //   disabled: isResourceDisabled()
    // },
  ];
  const isDisabled = disabledConditions.some(el => el.disabled);

  // _Character_

  return (
    <Modal size="full" isCentered isOpen={myCharacter.characterName.includes("_Character")} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Character Creation: Step
          {myChar && myCharacter && myChar !== myCharacter && <Button onClick={() => reduxAction(setCharacter(myChar))}>Exit (Control Only)</Button>}
        </ModalHeader>
        <ModalBody>
          Name: {name}
          <InputGroup>
            <InputLeftElement >
              <IconButton onClick={generateName} icon={<Random />} />
            </InputLeftElement>
            <Input rows='1' value={name} className='textStyle' onChange={(event) => setName(event.target.value)}></Input>
          </InputGroup>

          {occupations.map(el => (
            <AssetCard handleSelect={() => setOccupation(el)} key={el._id} asset={el} />
          ))}

          {myTeam && myTeam.goals.map(goal => (
            <Box key={goal._id} > {goal.description} </Box>
          ))}

        </ModalBody>

        <ModalFooter bg={'blue.500'}>
          <Stepper width={"100vw"} size='lg' index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index} onClick={() => setActiveStep(index)}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          <Button onClick={() => submitCreation()} variant='ghost'>Create Character!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default (CharacterCreation);