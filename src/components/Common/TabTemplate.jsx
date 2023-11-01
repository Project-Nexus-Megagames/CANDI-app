import React, { useEffect }  from 'react';
import { connect, useSelector } from 'react-redux';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

const Template = (props) => {
	const navigate = useNavigate();
	const { login, team, myCharacter } = useSelector(s => s.auth)

	const [tabIndex, setTab] = React.useState(0);

	useEffect(() => {
		if(!props.login)
			navigate('/');
	}, [props.login, navigate])

	return ( 
		<Tabs variant='enclosed' index={tabIndex} onChange={setTab}>
			<TabList>
				<Tab>DashBoard</Tab>
				<Tab>Tab_1</Tab>
				<Tab>Tab_2</Tab>
				<Tab>Tab_3</Tab>
			</TabList>

			<TabPanels>

				<TabPanel>
					Dashboard here
				</TabPanel>

				<TabPanel>
					Tab_1
				</TabPanel>		

				<TabPanel>
					Tab_2
				</TabPanel>

				<TabPanel>
					Tab_3
				</TabPanel>

			</TabPanels>
		</Tabs>
		);
}

export default (Template);