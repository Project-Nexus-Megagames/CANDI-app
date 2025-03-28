import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getTextColor, getThisTeam } from '../../scripts/frontend';
import { Box, Button, ButtonGroup, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Tag, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import AthleteCard from '../Assets/AthleteCard';
import socket from '../../socket';
import { getTeamAccount } from '../../redux/entities/accounts';
import Contract from "../Common/Contract";
import CharacterNugget from '../Common/CharacterNugget';
import CountDownTag from '../Common/CountDownTag';
import TeamAvatar from '../Common/TeamAvatar';
import { CandiWarning } from '../Common/CandiWarning';

const Auction = (props) => {
    const { market, loading, size, altIconPath } = props;
    const assets = useSelector(s => s.assets.list);
    const myCharacter = useSelector(s => s.auth.character);
    const teams = useSelector(s => s.teams.list);
    const account = useSelector(getTeamAccount);
    const [mode, setMode] = React.useState(false);

    const rawr = account !== undefined ? account.resources.find((el) => el.type === market.currency) : undefined;
	const credits = rawr ? rawr.balance : 0;

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
                        <AthleteCard key={thingy._id} asset={asset} />
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

    return (
        <Box key={market._id} index={market._id}
            style={{
                border: `3px solid ${getFadedColor(getThisTeam(teams, market.creator._id))}`,
                borderRadius: '10px',
            }}>
            <Grid
                h='260px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={2}
            >
                <GridItem colSpan={5} bg={getFadedColor(getThisTeam(teams, market.creator._id))} color={getTextColor(getThisTeam(teams, market.creator._id))} className='styleSpaceAround' >
                    <div >
                        <Text noOfLines={1} as='u' style={{ color: 'black' }} fontSize='4xl' ><CharacterNugget character={market.creator} />Auction "{market.name}" ({market.stuff.length} Items)</Text >
                    </div>
                    <div>
                        <CountDownTag timeout={market.timeout} />
                    </div>

                </GridItem>

                <GridItem style={{ height: '150px' }} colSpan={1} className='styleDeadCenter' >
                    <div>
                        <Text fontSize='xs' >Highest Bidder</Text >

                        {/* <CharacterNugget size='lg' character={market.highestBidder} /> */}
                        <TeamAvatar character={market.highestBidder?._id} />
                        <ButtonGroup isAttached>
                            <Tooltip openDelay={200} hasArrow placement='top' label={"Current Bid"}>
                                <Button
                                    leftIcon={<img src={`/images/${market.currency}.png`} width={'30px'} alt={`${market.currency}!`} />}
                                    size={'md'}
                                    variant='outline'
                                    colorScheme="green"
                                >
                                    <b>{market.highestBid}</b>
                                </Button>
                            </Tooltip>

                            {!(market.creator._id === myCharacter._id || market.highestBidder._id === myCharacter._id) && <Tooltip openDelay={200} hasArrow placement='top' label={
                                market.highestBidder._id === myCharacter._id ? (
                                    <b>You are the highest bidder!</b>
                                ) : !credits ? (
                                    <b>Account is undefined</b>
                                ) : credits <= market.highestBid ? (
                                    <b>You do not have enough credits! ({credits})</b>
                                ) : market.creator._id === myCharacter._id ? (
                                    <b>Can't bid on your own Auction, silly </b>
                                ) : (
                                    <b>Click to place bid</b>
                                )}>
                                <Button
                                    size={'md'}
                                    colorScheme={market.highestBidder._id === myCharacter._id ? 'blue' : 'green'}
                                    variant={market.highestBidder._id === myCharacter._id ? 'outline' : 'solid'}
                                    disabled={
                                        market.creator._id === myCharacter._id ||
                                        market.highestBidder._id === myCharacter._id ||
                                        !credits ||
                                        credits <= market.highestBid
                                    }
                                    onClick={() => handleBid(market._id)}
                                >
                                    +5
                                </Button>
                            </Tooltip>}

                        </ButtonGroup>
                        {/* {market.autobuy && market.autobuy > 0 && <Button onClick={() => setMode('autobuy')} >Auto Buy</Button>} */}
                        <CandiWarning open={mode === 'autobuy'} title={`Auto Buy "${market.name}"?`} onClose={() => setMode(false)} handleAccept={() => handleAutobuy(market._id)}>
                            Are you sure you wish to purchase this Auction Lot? It will cost {market.autobuy} credits
                        </CandiWarning>
                    </div>

                </GridItem>

                <GridItem style={{ height: '95%' }} colSpan={4} bg='#343a40' className='styleCenter'>
                    <Grid
                        templateColumns='repeat(1, 1fr)'
                        gap={2}
                        style={{ overflow: 'scroll', maxHeight: '20vh', width: '100%', scrollbarWidth: 'thin' }}
                    >
                        {market.stuff.map((thingy) => getMarketObject(thingy))}
                    </Grid>

                </GridItem>

            </Grid>
        </Box>
    )
};

export default Auction;