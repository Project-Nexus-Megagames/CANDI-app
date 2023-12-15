import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
} from '@chakra-ui/react'
import { useSteps } from '@chakra-ui/stepper';

const CharacterCreation = (props) => {
  const blueprints = useSelector(s => s.blueprints.list);
  const { login, team, myCharacter } = useSelector(s => s.auth);

  const steps = [
    { title: 'Zero', description: 'Get Started' },
    { title: 'Occupation', description: 'What do you do for a living?' },
    { title: 'Inheritemce', description: 'Inheritemce' },
    { title: 'Character Details', description: 'Name, Species, and Goals' },
  ]


  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  // _Character_

  return (
    <Modal size="full" isCentered isOpen={myCharacter.characterName.includes("_Character_")} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Character Creation: Step </ModalHeader>
        <ModalBody>
          hi
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

          <Button variant='ghost'>Create Character!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default (CharacterCreation);