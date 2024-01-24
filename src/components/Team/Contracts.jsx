import React from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket';
import { getTeamContracts, } from '../../redux/entities/assets';
import { getTeamAccount } from '../../redux/entities/accounts';
import ResourceNugget from '../Common/ResourceNugget';
import Contract from '../Common/Contract';
import { Close, Plus } from '@rsuite/icons';
import { Box, Button, ButtonGroup, CloseButton, Divider, Flex, Grid, GridItem, HStack, IconButton, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, ModalOverlay, NumberInput, Spacer, useDisclosure, VStack } from '@chakra-ui/react';
import { CandiModal } from '../Common/CandiModal';
import InputNumber from '../Common/InputNumber';
import SelectPicker from '../Common/SelectPicker';
import NewContractForm from '../Common/NewContractForm';

const ContractDashboard = () => {
	const { control } = useSelector(s => s.auth);
	const assets = useSelector(s => s.assets.list);
	const teamContracts = useSelector(getTeamContracts);
	const account = useSelector(getTeamAccount);

	const {
		isOpen: newContract,
		onOpen: onOpenContract,
		onClose: onCloseContract,
	} = useDisclosure();

	const contracts = teamContracts;
	
	return ( 
		<React.Fragment>
			<Grid
          templateAreas={`"nav main"`}
          gridTemplateColumns={ '400px 1fr'}
          h='100vh'
          gap='1'
          fontWeight='bold'
        >
				<GridItem pl='2' bg='#0f131a' area={'main'} >
					<VStack divider={<Divider />} style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}>
						{contracts.filter(el => !el.status.some(tag => tag === 'completed')).map((contract) => (							
								<Contract key={contract._id} show contract={contract} />
						))}	
					</VStack>
				</GridItem>

				<GridItem pl='2' bg='#0f131a' area={'nav'} >
					{control && <Button onClick={()=> onOpenContract()} >New Contract</Button>}

					<div size="md" className='page-container' style={{ overflow: 'auto', borderRight: '1px solid rgba(255, 255, 255, 0.12)'}}>
						<h5>Past Contracts</h5>
						{contracts.filter(el => el.status.some(tag => tag === 'completed')).map((contract) => (
							<HStack style={{ cursor: 'pointer' }} key={contract._id} index={contract._id} >
								<Box >
									<Flex justify="center">
										<Box colSpan={24}>
											<h5>{contract.name}</h5>
											<h5>{contract.description}</h5>

											<HStack className='styleCenter' >
												{contract.rewards && contract.rewards.map(reward => (
													<ResourceNugget key={reward._id} blueprint={reward.blueprint} value={reward.value} type={reward.type} />
												))}												
											</HStack>
										</Box>
									</Flex>
								</Box>
							</HStack>
						))}
					</div>	
				</GridItem>
			</Grid>
      
      <CandiModal open={newContract} onClose={() => { onCloseContract(); } }  >
        <NewContractForm statusDefault={["tradable"]} onClose={() => { onCloseContract(); } } />
      </CandiModal>


		</React.Fragment>
	);
}


export default ContractDashboard;