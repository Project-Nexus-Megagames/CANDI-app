import React from 'react';
import { ButtonGroup, Card, CardBody, CardHeader, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from './CandiWarning';
import ResourceNugget from './ResourceNugget';
import NewAsset from './NewAsset';

const AssetCard = (props) => {
  const { asset, character } = props;
  const [mode, setMode] = useState(false);

  const deleteAssert = async () => {
    socket.emit('request', {
        route: 'asset',
        action: 'delete',
        data: {id: asset._id}
    });
};

	return ( 
		<div>
      <Card key={asset._id} >
        <CardHeader>
                  <h5>{asset.name} 
                  <ButtonGroup isAttached>
                   <IconButton variant={'ghost'} onClick={() => setMode("edit")} colorScheme="orange" size={'sm'} icon={<EditIcon />} />         
                   <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<DeleteIcon />} />                  
                  </ButtonGroup>
                  
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
      <NewAsset show={mode === "edit"} closeModal={() => setMode(false)} character={character} asset={asset} mode={mode}/>
		</div>
	);
}

export default (AssetCard);