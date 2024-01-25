import React from 'react';
import styled from 'styled-components';
// import { useHistory } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Select, Menu, MenuButton, MenuList, MenuItem, Button, useDisclosure, Text, Hide } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';


const NavbarContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: #393c3e;
	justify-content: right;
	color: #ffffff;
  height: 100%;
`;


const NavBar = (props) => {
	const { setShow, setSubTab, width } = props;
	const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();

	return ( 
		<NavbarContainer style={{ width: width }} >
      <Button onClick={ () => navigate('/login') } margin={'50px'} variant={'link'} >Login</Button>
		</NavbarContainer>

	);
}
export default NavBar;