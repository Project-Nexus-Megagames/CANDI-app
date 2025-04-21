import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getTextColor, getThisTeam } from '../../scripts/frontend';
import { Box, Button, ButtonGroup, Center, Divider, Grid, GridItem, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, StackDivider, Tag, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
} from '@chakra-ui/react'
import AthleteCard from '../Assets/AthleteCard';
import socket from '../../socket';
import { getTeamAccount } from '../../redux/entities/accounts';
import Contract from "../Common/Contract";
import CharacterNugget from '../Common/CharacterNugget';
import CountDownTag from '../Common/CountDownTag';
import TeamAvatar from '../Common/TeamAvatar';
import { CandiWarning } from '../Common/CandiWarning';
import ResourceNugget from '../Common/ResourceNugget';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { BsArrowDown, BsPencil } from 'react-icons/bs';
import { IoCaretDownOutline } from 'react-icons/io5';
import NexusTag from '../Common/NexusTag';
import { CandiModal } from '../Common/CandiModal';
import AuctionForm from './AuctionForm';

const Auction = (props) => {
    const { market, loading, size, altIconPath } = props;
    const assets = useSelector(s => s.assets.list);
    const myCharacter = useSelector(s => s.auth.character);
    const { control } = useSelector(s => s.auth);
    const teams = useSelector(s => s.teams.list);
    const { resourceTypes } = useSelector(s => s.gameConfig);
    const account = useSelector(getTeamAccount);
    const [mode, setMode] = React.useState(false);
    const [selectedResource, setSelectedResource] = React.useState(market.currentResource);

    const rawr = account?.resources.find((el) => el.type === selectedResource);
    const credits = rawr ? rawr.balance : -999;

    const resourceMap = account.resources.reduce((acc, item) => {
        acc[item.type] = item.balance;
        return acc;
    }, {});

    const salaryTypes = [
        { name: "Shiny Rock", code: "shiny_rock", color: "#9b549f" },
        { name: "Excellent Moss", code: "excellent_moss", color: "#55f348" },
        { name: "Mushroom", code: "mushroom", color: "#f79b48" },
        { name: "Gold", code: "gold", color: "#dddd12", textColor: "black" }
    ]

    const getMarketObject = (thingy) => {
        switch (thingy.type) {
            case 'Asset':
                const asset = assets.find((el) => el._id === thingy._id);
                if (asset.tags.some((el) => el === 'contract'))
                    return (
                        <Box key={thingy._id} style={{ border: '2px solid #d4af37', margin: '5px' }}>
                            <Contract contract={asset} />
                        </Box>
                    );
                else
                    return (
                        // <AssetCard height="150px" key={thingy._id} asset={asset} />
                        <AthleteCard compact key={thingy._id} asset={asset} />
                    );
            case 'contract':
                const asset0 = assets.find((el) => el._id === thingy._id);
                return (
                    <Box key={thingy._id} style={{ border: '2px solid #d4af37', margin: '5px' }}>
                        <Contract contract={asset0} />
                    </Box>
                );
            default:
                return <b key={thingy._id}>Unable to render {thingy.type}</b>;
        }
    };

    const handleBid = (auction) => {
        const data = {
            auction,
            highestBidder: myCharacter._id,
            currentResource: selectedResource,
            bidAccount: account._id
        };
        socket.emit('request', { route: 'market', action: 'bid', data });
    };

    const handleAutobuy = (auction) => {
        const data = {
            auction,
            buyCharacter: myCharacter._id,
            bidAccount: account._id
        };
        socket.emit('request', { route: 'market', action: 'autobuy', data });
    };

    const handleEdit = ({asset, description, hours, acceptedResources, starting, autobuy}) => {
		const formattedAssets = [];

		const data = {
            ...market,
            id: market._id,
			name: description,
			stuff: asset,
			timeout: hours,
			acceptedResources,
			highestBid: starting,
			autobuy
		};
		socket.emit('request', { route: 'market', action: 'edit', data });
		// console.log('WHAT', data);
	};


    return (
        <Box key={market._id} index={market._id}
            style={{
                border: `3px solid ${getFadedColor(getThisTeam(teams, market.creator._id))}`,
                borderRadius: '10px',
            }}>


            <Grid
                templateAreas={`
                    "header header"
                    "left main"`}
                gridTemplateRows={'0.3fr 1fr'}
                gridTemplateColumns={'0.4fr 1fr'}
            // templateRows='repeat(2, 1fr)'
            // templateColumns='repeat(5, 1fr)'
            >
                <GridItem
                    area={'header'}
                    bg={getFadedColor(getThisTeam(teams, market.creator._id))}
                    color={getTextColor(getThisTeam(teams, market.creator._id))}
                    className='styleCenter'
                >
                    <Text noOfLines={1} as='u' style={{ color: 'black', }} fontSize='4xl' >
                        {market.name} ({market.stuff.length} Items)
                        {control && <IconButton icon={<BsPencil/>} onClick={() => setMode('edit')}  />}
                    </Text >

                </GridItem>

                <GridItem
                    area={'left'}
                    as={Stack}
                    align='stretch'
                >
                    <Box
                        bg={"rgb(42, 53, 71)"}
                        // bg={getFadedColor(getThisTeam(teams, market.highestBidder._id))}
                        padding={'2px'}
                    >
                        {market.status.some(el => el === 'finished') && <Text fontSize='xs' >Auction Winner</Text >}
                        {market.status.some(el => el === 'ongoing') && <Text fontSize='xs' >Highest Bidder </Text >}

                        {market.status.length > 0 && market.status?.filter(el => el !== 'used').map(el => (
                            <NexusTag key={el} value={el}></NexusTag>
                        ))}
                        <Center >
                            <TeamAvatar
                                character={market.highestBidder?._id}
                                margin={"15px"}
                                specialBadge={<CountDownTag timeout={market.timeout} />}
                            />
                            <ResourceNugget value={market.highestBid} type={market.currentResource} width={'70px'} />
                        </Center>
                    </Box>

                    {market.status.some(el => el === 'ongoing') && <Box>
                        {!(market.creator._id === myCharacter._id || market.highestBidder._id === myCharacter._id) && <Text fontSize='xs' >Your Bid</Text >}
                        {(market.creator._id === myCharacter._id || market.highestBidder._id === myCharacter._id) && <Text fontSize='lg' >You're the Highest Bidder!</Text >}
                        <Center >
                            <ButtonGroup isAttached>

                                {!(market.creator._id === myCharacter._id || market.highestBidder._id === myCharacter._id) && <Tooltip openDelay={200} hasArrow placement='top' label={
                                    market.highestBidder._id === myCharacter._id ? (
                                        <b>You are the highest bidder!</b>
                                    ) : !credits ? (
                                        <b>Account is undefined</b>
                                    ) : credits <= market.highestBid ? (
                                        <b>You do not have enough resources! ({credits})</b>
                                    ) : market.creator._id === myCharacter._id ? (
                                        <b>Can't bid on your own Auction, silly </b>
                                    ) : (
                                        <b>Click to place bid</b>
                                    )}>

                                    <Popover>
                                        {({ isOpen, onClose }) => (
                                            <>
                                                <PopoverTrigger>
                                                    <Button
                                                        borderRadius={'5px 0 0 5px'}
                                                        variant={'outline'}
                                                        colorScheme={selectedResource ? getFadedColor(selectedResource) : 'red'}
                                                        leftIcon={<img src={`/images/${selectedResource}.png`} width={'30px'}
                                                            alt={`${market.currency}!`} />}
                                                        rightIcon={market.acceptedResources.length > 1 ? <IoCaretDownOutline /> : ""}
                                                    >{selectedResource}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent backgroundColor={'black'}>
                                                    <PopoverArrow />
                                                    <PopoverCloseButton />
                                                    <PopoverHeader>Accepted Resources ({market.acceptedResources.length}) </PopoverHeader>
                                                    <PopoverBody  >
                                                        <Stack isAttached>
                                                            {salaryTypes
                                                                .filter(resource => market.acceptedResources.some(ar => ar == resource.code))
                                                                .map(resource => (
                                                                    <Button
                                                                        size={'xs'}
                                                                        isDisabled={!resourceMap[resource.code] || resourceMap[resource.code] <= 0}
                                                                        onClick={() => { onClose(); setSelectedResource(resource.code) }}
                                                                        variant={selectedResource === resource.code ? 'solid' : 'outline'}
                                                                        leftIcon={<img src={`/images/${resource.code}.png`} width={'25px'} alt={`${resource.code}!`} />}
                                                                    >{resource.name} {resourceMap[resource.code]}
                                                                    </Button>
                                                                ))}
                                                        </Stack>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </>
                                        )}

                                    </Popover>

                                    <Button
                                        borderRadius={'0 5px 5px 0'}
                                        size={'md'}
                                        colorScheme={market.highestBidder._id === myCharacter._id ? 'blue' : 'green'}
                                        variant={market.highestBidder._id === myCharacter._id ? 'outline' : 'solid'}
                                        isDisabled={
                                            market.creator._id === myCharacter._id ||
                                            market.highestBidder._id === myCharacter._id ||
                                            !credits ||
                                            credits <= market.highestBid ||
                                            !selectedResource
                                        }
                                        onClick={() => setMode("bid")}
                                    >
                                        +1
                                    </Button>
                                </Tooltip>}

                            </ButtonGroup>
                        </Center>
                    </Box>}


                    <CandiWarning
                        open={mode === 'bid'}
                        title={`Bid on "${market.name}"?`}
                        onClose={() => setMode(false)}
                        handleAccept={() => handleBid(market._id)}
                    >
                        This will cost {market.highestBid + 1} {selectedResource} (if you win)
                        <ResourceNugget value={market.highestBid + 1} type={selectedResource} />
                    </CandiWarning>

                    {/* {market.autobuy && market.autobuy > 0 && <Button onClick={() => setMode('autobuy')} >Auto Buy</Button>} */}
                    <CandiWarning open={mode === 'autobuy'} title={`Auto Buy "${market.name}"?`} onClose={() => setMode(false)} handleAccept={() => handleAutobuy(market._id)}>
                        Are you sure you wish to purchase this Auction Lot? It will cost {market.autobuy} credits
                    </CandiWarning>

                    {market && <CandiModal open={mode === 'edit'} onClose={() => setMode(false)}>
                        <AuctionForm auction={market} handleSubmit={(data) => handleEdit(data)} />
                    </CandiModal>}

                </GridItem>

                <GridItem area={'main'} bg='#00a0bd' >
                    <Grid
                        templateColumns={market.stuff.length === 1 ? "" : `repeat(2, 1fr)`}
                        overflow={'clip'}
                        height={'20vh'}
                        style={{ overflow: 'scroll', scrollbarWidth: 'thin' }}
                    >
                        {market.stuff.map((thingy) => getMarketObject(thingy))}
                    </Grid>

                </GridItem>

            </Grid>
        </Box>
    )
};

export default Auction;