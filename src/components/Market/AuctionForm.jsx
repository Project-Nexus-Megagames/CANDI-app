import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, ButtonGroup, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from '@chakra-ui/react';
import CheckerPick from '../Common/CheckerPick';
import { getTeamAthletes, getTeamAssets } from '../../redux/entities/assets';

const AuctionForm = ({ auction, handleSubmit }) => {
    const blueprints = useSelector(s => s.blueprints.list);
    const { login, team, character } = useSelector(s => s.auth);
    const loading = useSelector(s => s.gamestate.loading);
    const assets = useSelector(getTeamAssets);
    const athletes = useSelector(getTeamAthletes);
    const resourceTypes = useSelector(s => s.gameConfig.resourceTypes);

    const [hours, setHours] = React.useState(auction?.timeout || 0);
    const [starting, setStarting] = React.useState(auction?.highestBid || 0);
    const [autobuy, setAutobuy] = React.useState(auction?.autobuy || 0);
    const [asset, setAsset] = React.useState(auction?.stuff || []);
    const [description, setDescription] = React.useState(auction?.name || '');
    const [acceptedResources, setResources] = React.useState(auction?.acceptedResources || resourceTypes.map(el => el.type));

    const [levels, setLevels] = React.useState([]);

    return (
        <Box>
            <div>
                <Input placeholder='Name' value={description} onChange={(e) => setDescription(e.target.value)}></Input>
                <CheckerPick
                    label='name'
                    placeholder={`${[...assets].length} Eligible assets`}
                    onChange={(event) => setAsset(event)}
                    data={[...assets]}
                    value={asset}
                />

                <CheckerPick
                    label='type'
                    valueKey="type"
                    placeholder={`${resourceTypes.length} Eligible Resorces`}
                    onChange={(event) => setResources(event)}
                    data={resourceTypes}
                    value={acceptedResources}
                />
            </div>

            <br />

            Game hours until auction expires
            <NumberInput value={hours} min={0} onChange={(valueAsNumber) => setHours(valueAsNumber)} keepWithinRange>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <br />

            Starting Bid
            <NumberInput value={starting} min={0} onChange={(valueAsNumber) => setStarting(valueAsNumber)} keepWithinRange>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <br />

            AutoBuy (disabled when 0)
            <NumberInput value={autobuy} min={0} onChange={(valueAsNumber) => setAutobuy(valueAsNumber)} keepWithinRange>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <ButtonGroup>
                <Button
                    disabled={asset.length <= 0 || hours <= 0 || description === ''}
                    onClick={() => handleSubmit({asset, hours, description, autobuy, acceptedResources, starting})}
                    color='green'
                    variant={'solid'}
                >
                    Submit
                </Button>
            </ButtonGroup>
        </Box>
    );
}

export default (AuctionForm);