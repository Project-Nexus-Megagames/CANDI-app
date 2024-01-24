import { Divider, Tag, Text } from '@chakra-ui/react';
import React from 'react';
import ResourceNugget from '../Common/ResourceNugget';
const { useDrag } = require("react-dnd");
const { default: SubRoutine } = require("../Hacking/SubRoutine");

const Ice = ({ ice, facility, compact, width }) => {

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ice",
    item: { id: ice._id, facility, index: ice.index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [ice]);

  const test = (ice) => {
    return (
      <div>
        {ice.options && ice.options.map((subRotuine, index) => (
          <div key={subRotuine._id} >
            <Text size={'xs'} >Subroutine {index+1}</Text>
            <SubRoutine compact={compact} subRotuine={subRotuine} index={index} />
            <Divider />
          </div>
        ))}        
      </div>

    )
  }

	return ( 
		<div style={{ cursor: 'pointer', textAlign: 'center',  }} ref={drag}>	      
      <ResourceNugget width={width ? width : '100%'} compact={compact} fontSize={'2em'}  blueprint={ice.code} type={"blueprint"}/>	
			{/* {ice.status && ice.status.map((tag, index) => (
				<Tag variant={'solid'} key={index}>{tag}</Tag>
			))} */}
		</div>
		);
}
export default Ice;