import {	Box,	Button,	ButtonGroup,	Divider,	Flex,	Grid,	HStack,	IconButton,	Modal,	ModalBody,	ModalCloseButton,	ModalContent,	ModalFooter,	ModalHeader,	ModalOverlay,	Progress,	Spacer,	Tag,	Text,	Tooltip,	useDisclosure,	VStack} from '@chakra-ui/react';
import { Check, Close, Reload, Trash } from '@rsuite/icons';
import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { AiOutlineReload } from 'react-icons/ai';
import { getTeamAccount } from '../../redux/entities/accounts';
import { getFadedColor } from '../../scripts/frontend';
import socket from '../../socket';
import WordDivider from '../Common/WordDivider';
import ResourceNugget from '../Common/ResourceNugget';
import Worker from './Worker';
import { getTeamResearched } from '../../redux/entities/blueprints';
import TeamAvatar from '../Common/TeamAvatar';

const test = "padding: '5px', width: 150, height: 80, border: !isOver ? '1px solid white' : '2px solid white', borderRadius: '5px'";

const Target = ({ targ, index, facility, loading }) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'asset',
		drop: (item) => socket.emit('request', { route: 'asset', action: 'assign', data: { targ, index, facility: facility._id, worker: item.id } }),
		collect: (monitor) => ({
			isOver: !!monitor.isOver()
		})
	}));

	return (
		<div ref={loading ? undefined : drop} 
      style={{ padding: '5px', 
                width: 150, 
                height: (isOver || targ !== 'Empty') ? 80 : 55, 
                border: !isOver ? '1px solid white' : '2px solid white', 
                borderRadius: '5px' 
                }}>
			{targ !== 'Empty' && <Worker loading={loading} facility={facility._id} asset={targ} />}
      {targ === 'Empty' && <Text color="GrayText" >Slot Open</Text>}
      {targ !== 'Empty' && targ?._id}
		</div>
	);
};

const Factory = (props) => {
	const { facility } = props;
	const account = useSelector(getTeamAccount);
	const loading = false; // useSelector(state => state.gamestate.loading)
	// const blueprints = useSelector(getTeamResearched);
  const blueprints = useSelector(s => s.blueprints.list)
	const [renderTags, setRenderTags] = React.useState([]);
	const [producableBlueprints, setBlueprints] = React.useState([]);
	const [slots, setSlots] = React.useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();


	useEffect(() => {
		if (blueprints) {
			let uniqueChars = [];

			for (const asset of blueprints.filter((el) => facility.canProduce.some((can) => can === el.code))) {
				if (!uniqueChars.some((el) => el === asset.level)) uniqueChars.push(asset.level);
			}

			setBlueprints(blueprints.filter((el) => facility.canProduce.some((can) => can === el.code)));
			setRenderTags(uniqueChars.reverse());
		}

	}, [blueprints, facility]);

	useEffect(() => {
		const temp = [];
		for (const worker of props.workers) {
			temp.push(worker);
		}

		for (let i = 0; i < facility.capacity - props.workers.length; i++) {
			temp.push('Empty');
		}
		setSlots(temp);
	}, [props.workers, facility]);

	const handleSetProduction = (code) => {
		socket.emit('request', {
			route: 'asset',
			action: 'production',
			data: {
				blueprint: code,
				facility: facility._id
			}
		});
		onClose();
	};
  

	const isDisabled = (target) => {
		let good = true;
		for (const t of target) {
			const rawr = account !== undefined ? account.resources.find((el) => el.type === t.type) : undefined;
			const megabucks = rawr ? rawr.balance : 'Error w/ account';
			if (t.value > megabucks || typeof megabucks === 'string') good = false;
		}

		if (loading) good = false;

		return good;
	};

	const handleAuto = () => {
		socket.emit('request', {
			route: 'asset',
			action: 'auto',
			data: {
				facility: facility._id
			}
		});
	};

	return (
		<div
    
			style={{
				margin: '5px',
				border: `1px solid ${getFadedColor(facility.type, 0.5)}`,
				borderRadius: '5px',
				borderColor: getFadedColor(facility.type, 1),
				backgroundColor: getFadedColor(facility.type, 0.1),
				width: '99%',
        marginBottom: '5px',
			}}
		>
			{loading && <div center backdrop />}

			<br />
			<Flex>
        <Box marginBottom={'15px'} >
          <VStack minW={'300px'}>
            <ButtonGroup isAttached>
              <Tooltip delay={100} placement='top' label={<div>{facility.status.some((el) => el === 'auto') ? 'Auto Produce On' : 'Auto Produce Off'}</div>} trigger='hover'>
                <IconButton
                  variant={!loading && facility.status.some((el) => el === 'auto') ? 'solid' : 'outline'}
                  disabled={!facility.producing || facility.producing.subType === 'research' || facility.producing.tags.some(el => el === 'research')}
                  onClick={handleAuto}
                  icon={<AiOutlineReload />}
                  colorScheme={facility.status.some((el) => el === 'auto') ? 'green' : 'orange'}
                />
              </Tooltip>

              <Tooltip delay={100} placement='top' label={<div>{facility.producing ? `${facility.producing.name}:  ${facility.producing.description}` : 'Click to select Production'}</div>} trigger='hover'>
                <Button colorScheme="grey" isLoading={loading} onClick={() => onOpen()} variant={!loading && facility.producing ? 'primary' : 'outline'}>
                  {facility.producing ? facility.producing.name : 'Set Production'}
                </Button>
              </Tooltip>

              <Tooltip delay={100} placement='top' label={<div>{'Cancel'}</div>} trigger='hover'>
                <IconButton variant={'outline'} disabled={!facility.producing} onClick={() => handleSetProduction()} icon={<Trash />} colorScheme={'red'} />
              </Tooltip>
            </ButtonGroup>
            <HStack justify='space-around' align='middle' style={{ marginTop: '10px', marginBottom: '10px', opacity: loading ? 0.5 : 1 }}>
              <Flex justifyContent='center'>
                {facility.producing &&
                  facility.producing.target.map((g) => (
                    <ResourceNugget key={g._id} value={g.value} width={'50px'} type={g.type} description={facility.producing.description} height={'30'} />
                  ))}
                {facility.producing && facility.producing.target.length === 0 && (
                  <Tooltip hasArrow delay={100} placement='top' label={<div>{'This resource will not consume any resources to produce'}</div>} trigger='hover'>
                    <div style={{ border: `2px solid ${getFadedColor()}`, borderRadius: '10px', width: '60px', margin: '10px', textAlign: 'center', alignItems: 'middle' }}>
                      <b>None</b>
                    </div>                    
                  </Tooltip>

                )}
              </Flex>

              <div className={'container'}>
                <img className='reversed' src={`/images/arrow.png`} width='150px' alt='Failed to load img' />
                <div className='centerText' >{`${facility.progress} / ${facility.producing ? facility.producing.production : 0}`}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {facility.producing &&
                  facility.producing.rewards.filter(el => el.type !== 'unResearch').map((g) => (
                    <ResourceNugget key={g._id} value={g.value} width={'50px'} type={g.type} blueprint={g.blueprint} description={facility.producing.description} height={'30'} />
                  ))}
              </div>
            </HStack>
            <Progress
              status='active'
              value={facility.producing ? Math.floor((facility.progress * 100) / facility.producing.production) : 0}
              style={{ width: '100%', borderRadius: '5px', margin: '5px' }}
            ></Progress>
          </VStack>          
        </Box>


          <VStack style={{ width: '100%', marginLeft: '2em' }}>
            <h5>{<TeamAvatar account={facility.account} />}  {facility.name}</h5>
            <WordDivider word={facility.currentProdValue} />
            <Grid justify='space-around' align='middle' alignItems={"center"} templateColumns={`repeat(${slots.length}, 1fr)`} gap={1} style={{ width: '100%', height: '100%' }}>
              {slots.map((entry, index) => (
                <Target key={index} loading={loading} facility={facility} index={index} targ={entry} />
              ))}
            </Grid>
          </VStack>       


			</Flex>

			<Modal  size="2xl" isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent style={{ backgroundColor: '#2d3748', color: 'white' }}>
					<ModalHeader>Set production for {facility.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody >
            {facility.canProduce.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
						{producableBlueprints
							.filter((el) => facility.canProduce.some((can) => can === el.code))
							.map((blueprint) => (
								<div className='prod' 
                key={blueprint._id} 
                style={{ cursor: isDisabled(blueprint.target) ? 'pointer' : 'not-allowed', opacity: isDisabled(blueprint.target) ? 1 : .4, textAlign: 'center' }}
                onClick={() => (isDisabled(blueprint.target) ? handleSetProduction(blueprint._id) : console.log("Hey! I told you you don't have enough!"))}>
									<h5>{blueprint.name}</h5>
									<Flex justify='space-around' align='middle'>

                    <div  colSpan={12}>
											<b>Requirements</b>
											<div style={{ display: 'flex', justifyContent: 'center' }}>
												{blueprint.target.map((g) => (
													<ResourceNugget key={g._id} value={g.value} type={g.type} description={blueprint.description} height={45} width={80} />
												))}
												{blueprint.target.length === 0 && (
													<div style={{ border: `2px solid ${getFadedColor()}`, borderRadius: '10px', width: '90px', margin: '10px' }}>
														<b>None</b>
													</div>
												)}
											</div>
										</div>

											<div className={'container'} style={{ maxWidth: '10vw' }}>
												<img className='reversed' src={`/images/arrow.png`} height='60' alt='Failed to load img' />
												<div className='centerText'>{`${blueprint.production}-Hours`}</div>
											</div>

										<div style={{ minWidth: '10vw' }}>
											<b>Rewards</b>
											<div style={{ display: 'flex', justifyContent: 'center' }}>
												{blueprint.rewards.filter(el => el.type !== 'unResearch').map((g) => (
													<ResourceNugget key={g._id} value={g.value} type={g.type} description={blueprint.description} blueprint={blueprint.code} height={45} width={80} />
												))}
												{blueprint.rewards.length === 0 && (
													<div style={{ border: `2px solid ${getFadedColor()}`, borderRadius: '10px', width: '90px', margin: '10px' }}>
														<b>None</b>
													</div>
												)}
											</div>
										</div>

									</Flex>
                  <Divider />
								</div>
							))}
					</ModalBody>
					<ModalFooter>
						<Button colorScheme='red' onClick={() => onClose()} variant='outline'>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default Factory;
