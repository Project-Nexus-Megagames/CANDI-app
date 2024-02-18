import { Divider, Tag, Text } from '@chakra-ui/react';
import React from 'react';
import ResourceNugget from '../Common/ResourceNugget';

const Ice = ({ ice, compact, width }) => {


  // const test = (ice) => {
  //   return (
  //     <div>
  //       {ice.options && ice.options.map((subRotuine, index) => (
  //         <div key={subRotuine._id} >
  //           <Text size={'xs'} >Subroutine {index+1}</Text>
  //           <SubRoutine compact={compact} subRotuine={subRotuine} index={index} />
  //           <Divider />
  //         </div>
  //       ))}        
  //     </div>

  //   )
  // }

  return (
    <div style={{ cursor: 'pointer', textAlign: 'center', }} >
      {/* {ice.code && ice.code !== "???" && <ResourceNugget width={width ? width : '100%'} compact={compact} fontSize={'2em'} blueprint={ice.code} type={"blueprint"} />} */}
      {ice.imageUrl &&
        <img
          src={`${ice.imageUrl}`}
          alt='Img could not be displayed'
          style={{ maxHeight: "20vh", width: '90%' }}
        />
      }
      {/* {ice.status && ice.status.map((tag, index) => (
				<Tag variant={'solid'} key={index}>{tag}</Tag>
			))} */}
    </div>
  );
}
export default Ice;