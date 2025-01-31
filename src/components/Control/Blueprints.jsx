import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, ButtonGroup, Divider, Flex, Grid, GridItem, Hide, IconButton, Input, InputGroup, InputLeftElement, Tooltip, VStack } from '@chakra-ui/react';
import socket from '../../socket';
import { AddIcon, CloseIcon, DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import AssetCard from '../Common/AssetCard';
import Factory from '../Team/Factory';
import ActionOptions from '../Actions/ActionList/Action/ActionOptions';
import Contract from '../Common/Contract';
import NewContractForm from '../Common/NewContractForm';
import DecisionForm from '../Common/DecisionForm';
import AssetForm from '../Common/AssetForm';
import FacilityForm from '../Common/FacilityForm';
import IceForm from '../Common/IceForm';
import ActionBlueprintForm from './ActionBlueprintForm';

const Blueprints = (props) => {
  const blueprints = useSelector(s => s.blueprints.list);
  const team = useSelector(s => s.auth.team);

  let [users, setUsers] = useState([]);
  let [filter, setFilter] = useState('');
  let [selected, setSelected] = useState(false);
  const [mode, setMode] = React.useState(false);
  const [blueprintType, setBlueprintType] = React.useState(false);
  const [renderTags, setRenderTags] = useState(["AssetBlueprint", "FacilityBlueprint", "IceBlueprint", "ContractBlueprint", "DecisionBlueprint", "ActionBlueprint"]);

  useEffect(() => {
    if (selected) {
      setSelected(blueprints.find(el=> el._id === selected._id))
    }
  }, [blueprints]);

  const handleEdit = async (formData) => {
    console.log(formData)
    const data = {
      ...formData,
      id: selected._id,
      __t: selected.__t
    }
    try {
      socket.emit('request', { route: 'blueprint', action: 'edit', data });
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleNew = async (formData) => {
    console.log(formData)
    const data = {
      ...formData
    }
    try {
      socket.emit('request', { route: 'blueprint', action: 'new', data });
    }
    catch (err) {
      console.log(err)
    }
  }

  function renderTagCategory(tag, index) {
    const filtered = blueprints
      .filter(user => user.name.toLowerCase().includes(filter.toLowerCase()) ||
        user.description.toLowerCase().includes(filter.toLowerCase())
      )
      .filter((el) => el.__t === tag);
    if (filtered.length === 0) return (<h5 style={{ backgroundColor: getFadedColor(tag), color: getTextColor(`${tag}-text`), textAlign: 'center', }} >{tag}</h5>)
    return (<Box key={index}>
      {<h5 style={{ backgroundColor: getFadedColor(tag), color: getTextColor(`${tag}-text`), textAlign: 'center', }} >{tag}</h5>}
      <VStack divider={<Divider style={{ margin:'0px'}} />} >
        {filtered
          .map((blue =>
            <div className='nav-item' onClick={() => {setSelected(blue); setMode(false)}} >{blue.name}</div>
          ))}
      </VStack>
    </Box>)
  }

  function renderSelected() {
    switch (selected?.__t) {
      case "AssetBlueprint":
        return (<Box>
          {!mode && <AssetCard asset={selected} />}
          {mode === 'edit' && <AssetForm asset={selected} handleSubmit={handleEdit}/>}
        </Box>)
      case "FacilityBlueprint":
        return (<Box>
          {!mode && <Factory facility={selected} />}
          {mode === 'edit' && <FacilityForm 
          facility={selected} 
          blueprintMode={true} 
          team={team} 
          handleSubmit={handleEdit}
          />}
        </Box>)
      case "DecisionBlueprint":
        return (<Box>
          {!mode && <ActionOptions decision={selected} />}
          {mode === 'edit' && <DecisionForm
            handleCreate={handleEdit}
            decision={selected}
            onClose={() => setMode(false)}
          />}
        </Box>)
      case "ContractBlueprint":
        return (<Box>
          {!mode && <Contract contract={selected} />}
          {mode === 'edit' && <NewContractForm
            contract={selected}
            statusDefault={["action"]}
            onClose={() => setMode(false)}
            handleCreate={handleEdit}
          />}
        </Box>)
      default:
        return <b>oops</b>
    }
  }

  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={'400px 1fr'}
      height={"5vh"}
      bg='blue'
      gap='1'
      fontWeight='bold'>

      <GridItem pl='2' bg='#0f131a' area={'nav'} style={{ height: 'calc(100vh - 9em)', overflow: 'auto', }} >
        <Flex>
          <InputGroup >
            <InputLeftElement
              pointerEvents='none'
            >
              <SearchIcon />
            </InputLeftElement>
            <Input
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              placeholder="Search"
              color='white'
              style={{ borderRadius: '5px 0px 0px 5px' }}
            />
          </InputGroup>

          <Tooltip
            label='Add New Action'
            aria-label='a tooltip'>
            <IconButton
              variant={'solid'}
              icon={<AddIcon />}
              onClick={() => {setMode('new'); setSelected(false)}}
              colorScheme={'green'}
              aria-label='Add New Action'
              style={{ borderRadius: '0px 5px 5px 0px' }}
            />
          </Tooltip>
        </Flex>


        {renderTags.map((tag, index) => (renderTagCategory(tag, index)))}

      </GridItem>

      <GridItem pl='2' bg='#0f131a' area={'main'} >
        <Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}>
          {selected && <Box
            marginLeft='1rem'
          >
            <ButtonGroup isAttached>
              {!mode && <Button
                onClick={() => setMode('delete')}
                leftIcon={<DeleteIcon />}
                colorScheme='red'
                variant='solid'
              >
                <Hide below='md'>Delete</Hide>
              </Button>}

              {!mode && <Button
                onClick={() => setMode('edit')}
                leftIcon={<EditIcon />}
                colorScheme='orange'
                variant='solid'
              >
                <Hide below='md'>Edit</Hide>
              </Button>}
              {mode && <Button
                onClick={() => setMode(false)}
                leftIcon={<CloseIcon/>}
                variant='solid'
              >
                <Hide below='md'>Cancel</Hide>
              </Button>}
            </ButtonGroup>
            {renderSelected()}
          </Box>}
          {mode === 'new' && <Box>
            <ButtonGroup isAttached>
              {renderTags.map((tag, index) => (
                <Button variant={blueprintType === tag ? 'solid' : 'ghost'} key={index} onClick={() => setBlueprintType(tag)} >{tag}</Button>
              ))}
            </ButtonGroup>

            {blueprintType && <div>

              {blueprintType === 'AssetBlueprint' && <AssetForm handleSubmit={handleNew} />}  
              {blueprintType === 'FacilityBlueprint' && <FacilityForm handleSubmit={handleNew} />}  
              {blueprintType === 'IceBlueprint' && <IceForm handleSubmit={handleNew} />} 
              {blueprintType === 'ContractBlueprint' && <NewContractForm handleSubmit={handleNew} />} 
              {blueprintType === 'DecisionBlueprint' && <DecisionForm handleSubmit={handleNew} />} 
              {blueprintType === 'ActionBlueprint' && <ActionBlueprintForm handleSubmit={handleNew} />} 
            </div>}
          </Box>}
        </Box>
      </GridItem>

    </Grid>
  );
}

export default (Blueprints);

