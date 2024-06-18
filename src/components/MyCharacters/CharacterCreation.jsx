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
  Flex,
  Text,
  Center,
  Stack,
  Grid,
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

  let [loading, setLoading] = React.useState(false);
  let [occupations, setOccupations] = React.useState([]);
  let [inheritences, setInheritences] = React.useState([]);
  let [occupation, setOccupation] = React.useState(false);
  let [inheritence, setInheritence] = React.useState(false);
  let [name, setName] = React.useState('Enter Name (Press the Shuffle Button for a random name!)');
  let [bio, setBio] = React.useState('');
  const reduxAction = useDispatch();

  const steps = [
    { title: 'Getting Started', description: 'Get Started' },
    { title: 'Team & Goals', description: 'What are your goals?' },
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
    index: 0,
    count: steps.length,
  })

  useEffect(() => {
    console.log(occupation)

  }, [occupation]);

  const submitCreation = async () => {
    if (!loading) {
      setLoading(true)
      const { data } = await axios.post(`${gameServer}api/blueprints/characterCreation/`,
        {
          occupation: occupation._id,
          inheritence: inheritence._id,
          name,
          bio,
          id: myCharacter._id
        });
      console.log(data)
      setLoading(false)
    }

  }

  const fetchData = async () => {
    setLoading(true)
    const { data } = await axios.post(`${gameServer}api/blueprints/getInfo/`, { occupation: myCharacter.bio });
    console.log(data)
    setOccupations(data.occupations);
    setInheritences(data.inheritences);
    setActiveStep(1)
    setLoading(false)
  }


  const disabledConditions = [
    {
      text: "Bio is too long!",
      disabled: bio.length >= 1000
    },
    {
      text: "Pick a name!",
      disabled: name == 'Enter Name (Press the Shuffle Button for a random name!)'
    },
    {
      text: "Cody you mongrul caveman. You pedestrian philistine of taste. STOP TRYING TO BEE MOVIE SCRIPT ME!",
      disabled: bio.includes("at Honex Industries!") || name.includes("Vanessa stabs her hand with a fork to test whether she's dreaming or not")
    },
    {
      text: "Name is too short",
      disabled: name.length < 3
    },
    {
      text: "Name is too long!",
      disabled: name.length >= 1000
    },
  ];
  const isDisabled = disabledConditions.some(el => el.disabled);
  const activeStepText = steps[activeStep].description

  // _Character_

  return (
    <Modal size="full" isCentered isOpen={myCharacter.characterName.includes("_Character")} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Character Creation: Step
          {myChar && myCharacter && myChar !== myCharacter && <Button onClick={() => reduxAction(setCharacter(myChar))}>Exit (Control Only)</Button>}
        </ModalHeader>
        <ModalBody className='styleCenterTop'>
          <Stack style={{ width: '80%', height: '100%' }} overflow={'auto'}  >


            {activeStep === 0 && <Box>
              <h3>Hello, and welcome to Goblin City!</h3>
              <b>The first thing you will be doing is creating a character, deciding their name, occupation, and inheritence. This will determine what your starting assets are.</b>
              <Button loading={loading} loadingText="Getting data..." onClick={() => fetchData()} >Let's get Started!</Button>
            </Box>}

            {activeStep === 1 && <Box>
              <p>You are a....</p>
              {myTeam &&
                <Box>
                  <h4>{myTeam.name}</h4>
                  <Text>{myTeam.description}</Text>
                  <Flex>
                    {<img src={`/images/team/${myTeam.name}.png`} width={'160px'} alt={myTeam.name} />}
                    <div style={{ marginLeft: '18px' }} >
                      {myTeam.goals.map(goal => (
                        <p key={goal._id} > {goal.description} </p>
                      ))}
                    </div>
                  </Flex>
                  <Button onClick={() => setActiveStep(activeStep - 1)} >Prev</Button>
                  <Button onClick={() => setActiveStep(activeStep + 1)} >Next</Button>
                </Box>
              }
            </Box>}

            {activeStep === 2 && <Box>
              What is your Occupation?
              <Grid templateColumns='repeat(3, 1fr)' gap={2} overflow={'auto'} maxHeight={'60vh'}>
                {occupations.map(el => (
                  <AssetCard selected={el === occupation} handleSelect={() => setOccupation(el)} key={el._id} asset={el} />
                ))}
              </Grid>
              <Button onClick={() => setActiveStep(activeStep - 1)} >Prev</Button>
              <Button isDisabled={!occupation} onClick={() => setActiveStep(activeStep + 1)} >Next</Button>
            </Box>}

            {activeStep === 3 && <Box>
              Your ancestors left you with something... what did they bequeath you?
              <Grid templateColumns='repeat(3, 1fr)' gap={2} overflow={'auto'} maxHeight={'60vh'} >
                {inheritences.map(el => (
                  <AssetCard selected={el === inheritence} handleSelect={() => setInheritence(el)} key={el._id} asset={el} />
                ))}
              </Grid>
              <Button onClick={() => setActiveStep(activeStep - 1)} >Prev</Button>
              <Button isDisabled={!inheritence} onClick={() => setActiveStep(activeStep + 1)} >Next</Button>
            </Box>}

            {activeStep === 4 && <Box>
              <Box overflow={'auto'} maxHeight={'60vh'}>
                Finally, What is your name?
                <InputGroup>
                  <InputLeftElement >
                    <IconButton onClick={generateName} icon={<Random />} />
                  </InputLeftElement>
                  <Input rows='1' value={name} className='textStyle' onChange={(event) => setName(event.target.value)}></Input>
                </InputGroup>
                Bio (optional):
                <textarea rows='6' value={bio} className='textStyle' onChange={(event) => setBio(event.target.value)} />

                Occupation:
                <AssetCard asset={occupation} />

                Inheritence:
                <AssetCard asset={inheritence} />`
              </Box>


              <Stack>
                {disabledConditions.filter(el => el.disabled).map((opt, index) =>
                  <Text color='red' key={index}>{opt.text}</Text>
                )}
              </Stack>
              <Button onClick={() => setActiveStep(activeStep - 1)} >Prev</Button>
              <Button isDisabled={isDisabled} onClick={submitCreation} variant='solid' colorScheme='green' >Create Character!</Button>
            </Box>}
          </Stack>

        </ModalBody>

        {occupations.length > 0 && <ModalFooter borderTop={'3px solid gold'} >
          <Stack>
            <Stepper width={"95vw"} size='lg' index={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            <Text>
              Step {activeStep + 1}: <b>{activeStepText}</b>
            </Text>
          </Stack>
        </ModalFooter>}
      </ModalContent>
    </Modal>
  );
}

export default (CharacterCreation);