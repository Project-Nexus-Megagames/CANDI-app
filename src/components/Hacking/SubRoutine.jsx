import { Box, Flex, Spacer, Tooltip, Icon } from '@chakra-ui/react';
import { CloseOutline, Funnel, Pin, RemindFill } from '@rsuite/icons';
import React from 'react';
import { getFadedColor } from '../../scripts/frontend';
import ResourceNugget from '../Common/ResourceNugget';

const SubRoutine = (props) => {
	const { subRotuine, loading, index=0, compact } = props;

  const stats = (assets, cost) => {
    const probs = [];
    
    let sum = 0;
    for (let asset of assets) {
      const relevantDice = asset?.dice?.filter(el => el.type === subRotuine.challengeCost.type)

      sum = 1;
      for (const die of relevantDice) {
        probs.push(1 - (die.amount+1 - cost) / die.amount)
      }

    }

    for (let prob of probs.filter(el => el > 0)) {
      sum = sum * prob
    }

    if (sum >= 1 || sum == 0) return (sum*100);
    return (Math.trunc((1 - sum)*100));
  };


	return  (
		<div style={{ opacity: loading ? .5 : 1, backgroundColor: getFadedColor('white', (0.25 * index)) }} >
      <Box>{stats(subRotuine.contributed, subRotuine.challengeCost.value)}% Chance of success</Box>
			<Flex >

				<Box marginLeft="15px" >
					{subRotuine.challengeCost && <div>
            <ResourceNugget fontSize={'1em'} value={subRotuine.challengeCost.value} type={subRotuine.challengeCost.type} />
				</div>}
				</Box>

				<Spacer />

				<Box marginRight="15px" >
					{subRotuine.consequence && <div>
						{subRotuine.consequence.map((value) => (
              
							<div key={value._id}>
                <ResourceNugget fontSize={'1em'} value={value.value} type={value.type} />
							</div>
						))}
				</div>}
				</Box>

			</Flex>
		</div>
	)
};

export default SubRoutine;