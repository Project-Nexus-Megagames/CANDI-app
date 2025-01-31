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

const CharacterCreation = (props) => {
  const blueprints = useSelector(s => s.blueprints.list);
  const { login, team, myCharacter } = useSelector(s => s.auth);

  const steps = [
    { title: 'Team & Goals', description: 'Get Started' },
    { title: 'Occupation', description: 'What do you do for a living?' },
    { title: 'Inheritemce', description: 'Inheritemce' },
    { title: 'Character Details', description: 'Name, Species, and Goals' },
  ]

  // _Character_

  return (
    <Modal size="full" isCentered isOpen={myCharacter.characterName.includes("Character_")} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Character Creation: Step </ModalHeader>
        <ModalBody>
          hi
        </ModalBody>

        <ModalFooter bg={'blue.500'}>

          <Button variant='ghost'>Create Character!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default (CharacterCreation);