import { Box, Divider, Flex, IconButton,  Button, InputGroup, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputStepper, Select, Tag, NumberInputField, Card, Grid, VStack, SimpleGrid, Icon, Tooltip } from '@chakra-ui/react';
import { Check, CheckOutline, Close, CloseOutline, Plus } from '@rsuite/icons';
import React, { useEffect, useState } from 'react'; // React import
import { BsPencilFill, BsSave } from 'react-icons/bs';
import SelectPicker from './SelectPicker';
import ResourceNugget from './ResourceNugget';
import { useSelector } from 'react-redux';
import { AddAsset } from './AddAsset';
import { getMyAssets, getTeamAssets } from '../../redux/entities/assets';
import AssetCard from './AssetCard';
import WordDivider from './WordDivider';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import TeamAvatar from './TeamAvatar';
import { CloseIcon, InfoIcon } from '@chakra-ui/icons';
import NexusTag from './NexusTag';

const SupportOffer = (props) => { //trade object
  const { actionType, onClose, onSubmit, option } = props;
	const [resources, setResources] = React.useState([]);
	const [assets, setAssets] = React.useState([]);
	const [comments, setComments] = useState('');
	const [mode, setMode] = useState('edit');
	const  myAssets = useSelector(getMyAssets);
	const disabled = mode === 'disabled';
	const readOnly = mode === 'readonly';

	useEffect(() => {
		setResources(props.offer?.resources)
}, [props.offer]);

useEffect(() => {
  setAssets(props.offer?.assets)
}, [props.offer]);

	function onEdit(){
		// props.onOfferEdit();
		setMode("normal");
	}

	const handleSubmit = async () => {
		onSubmit({ resources, assets, comments, actionType });
		//setMode("disabled")
	}

	const removeElement = (index, type) => {
		let temp;
		switch (type) {
			case 'resource':
				temp = [...resources];
				temp.splice(index, 1)
				setResources(temp);
				break;
      case 'asset':
        temp = [...assets];
        temp.splice(index, 1)
        setAssets(temp);
        break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

	const editState = (incoming, index, type) => {
    // console.log(incoming, index, type)
		let thing;
		let temp;
		switch (type) {
			case 'resource':
				thing = { ...resources[index] };
				temp = [...resources];

				if (typeof(incoming) === 'number') { 
					thing.value = parseInt(incoming) 
				}
				else {
					thing.type = (incoming);
					thing.value = 0;
				} 
				temp[index] = thing;
				setResources(temp);
				break;
      case 'add-asset':
        // thing = myAssets.find(el => el._id === incoming);
        setAssets([...assets, incoming]);
      break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

	const getMax = (res) => {
    // console.log(props.myAccount)
    // console.log(res)
		return props.myAccount.resources.find(el => el.type === res)?.balance;
	}
  
	return(
		<div className='trade' style={{ width: "100%", padding: '8px', height: 'calc(100vh - 190px)', overflow: 'auto', borderColor: 'inherit', border: '2px solid', textAlign: 'center'}}>
      <h3>
        Resources {" "}
        <Tooltip openDelay={200} hasArrow placement='top' background={"gray.500"} label={<div>
            Allowed Resources
            {option.acceptedResources.map(rt => (
              <ResourceNugget fontSize={'1em'} height="25px" key={rt._id} value={rt.rewards} type={rt.type} />
            ))}
          </div>}>
          <Icon icon={<InfoIcon />}/>
        </Tooltip>
        
      </h3>


        <VStack divider={<Divider style={{ width: '80%' }} />} >
          {!disabled && resources.map((resource, index) => (
            <InputGroup key={index} className='styleCenter'>
              {getMax(resource.type)}

              <SelectPicker 
                value={resource.type} 
                label={'type'} 
                valueKey={'type'} 
                placeholder='Select Resource' 
                data={props.myAccount.resources.filter(el => el.balance > 0 && option.acceptedResources.some(rt => rt.type == el.type) )} 
                onChange={(event)=> { editState(event, index, 'resource'); }}/> 
              
              <NumberInput 
                style={{ width: '50%' }} 
                size='lg'
                prefix='value' 
                defaultValue={resource.value}
                value={resource.value} 
                max={getMax(resource.type)} 
                min={0} 
                onChange={(event)=> editState(parseInt(event), index, 'resource')}>
                <NumberInputField  />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <IconButton onClick={() => removeElement(index, 'resource')} variant="outline"  colorScheme='red' size="sm" icon={<Close/>} />   
            </InputGroup>	
          ))}	          
        </VStack>
        
	
        {!disabled && <IconButton onClick={() => setResources([...resources, { value: 1, type: 'agenda_effort'} ])} variant="solid"  colorScheme='green' size="sm" icon={<Plus/>} />  }		
				{disabled && <Flex style={{ minHeight: '20vh' }} justify="space-around" align={'center'} >

					{disabled && resources.map((resource, index) => (
            <Box key={resource._id}>
              <ResourceNugget width='20px' fontSize={'2em'} height="150px" index={index} value={`${resource.value}`} type={resource.type} />	
            </Box>												
					))}	
					{/* {!disabled && 
						<ResourceNugget type='plus' amount={'Add'}/>} */}						
				</Flex>}

				<WordDivider word={'Assets'}></WordDivider>

        Allowed:
        <br/>
        {option.acceptedAssets.map(tag => (
				  	<Tag margin={'3px'} key={tag} textTransform='capitalize'  backgroundColor={getFadedColor(tag)} color={getTextColor(tag)} variant={'solid'}>
            {tag}
          </Tag>
        ))}

        {<SimpleGrid style={{ minHeight: '20vh' }} minChildWidth='200px' spacing='20px'  align={'center'}>
          {assets && disabled && assets.length === 0 && <h5>No Assets Offered</h5>}
          {assets && assets.map((asset, index) => (
            <Box key={assets._id} >
              <AssetCard showRemove={!disabled} removeAsset={() => removeElement(index, 'asset')} height="150px" index={index} asset={asset} />
            </Box>												
					))}	

          {!disabled && 
            <AddAsset assets={myAssets.filter(el => el.tags.some(s => actionType.assetTypes.some(at => at === s)) || actionType.assetTypes.some(at => at === el.type) )} handleSelect={(asset) => editState(asset, 0, 'add-asset' )}/>}		
				</SimpleGrid >}

        <Divider/>
        Comment
				<textarea disabled={disabled}	readOnly={readOnly} className='textStyle' rows='5' value={comments} onChange={(event)=> setComments(event.target.value)}></textarea>	

				{<Flex >
					<Box  >
							{<Button 
              isLoading={props.loading} 
              colorScheme={'green'}  
              variant="solid" 
              isDisabled={mode === 'normal' || props.loading}  
              size='sm' leftIcon={<BsSave/>} 
              onClick={() => handleSubmit()}>Submit</Button>}
              <IconButton size='sm' variant="solid" colorScheme={"red"}  icon={<CloseIcon/>} onClick={() => onClose()}>Cancel</IconButton>
					</Box>
				</Flex>}

		</div>
	)
}

export default (SupportOffer);