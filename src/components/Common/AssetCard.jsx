import React from 'react';
import { ButtonGroup, Card, CardBody, CardHeader, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from './CandiWarning';
import ResourceNugget from './ResourceNugget';
import AssetForm from './AssetForm';
import { useSelector } from 'react-redux';
import { CandiModal } from './CandiModal';

const AssetCard = (props) => {
  const { asset, character, disabled, marginTop } = props;
  const [mode, setMode] = useState(false);
  const control = useSelector(state => state.auth.control);

  const deleteAssert = async () => {
    socket.emit('request', {
        route: 'asset',
        action: 'delete',
        data: {id: asset._id}
    });
};

	return ( 
		<div>
      <Card marginTop={marginTop} key={asset._id} >
        <CardHeader>
          <h5>{asset.name} 
          {control && !disabled && <ButtonGroup isAttached>
           <IconButton variant={'ghost'} onClick={() => setMode("edit")} colorScheme="orange" size={'sm'} icon={<EditIcon />} />         
           <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<DeleteIcon />} />                  
          </ButtonGroup>}
          
          </h5>
          <Flex align={'center'} >
            <Spacer />
            <ResourceNugget value={asset.type} width={'60px'}></ResourceNugget>
            {asset.status?.map(el => (
              <ResourceNugget key={el} value={el}></ResourceNugget>
            ))}
            <Spacer />
          </Flex>
        </CardHeader>
        <CardBody>                    
          {asset.description}
          
        </CardBody>                
      </Card>

      {asset && <CandiWarning open={mode === 'delete'} title={`Delete "${asset.name}"?`} onClose={() => setMode(false)} handleAccept={() => deleteAssert()}>
        This can never be undone.
      </CandiWarning>}

      <CandiModal onClose={() => { setMode(false); }} open={mode === "edit"} title={`${mode} Asset`}>
        <AssetForm character={character} asset={asset} mode={mode}/>
      </CandiModal>
      
		</div>
	);
}

export default (AssetCard);