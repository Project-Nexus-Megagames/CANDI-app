import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getFadedColor } from '../../scripts/frontend';


const Dice = ({ entered, asset, alt }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "asset",
    item: { id: asset._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }),
	);

	if (asset.status && asset.status.some(el => el === 'working'))
		return (
			<div style={{ cursor: 'not-allowed' }} >
				<Flex  justify="space-around" align='middle'>		

					<Box colSpan={4} >
						<div style={{  textAlign: 'center' }} >
							{asset.level && <img style={{ maxHeight: '50px', backgroundColor: getFadedColor(asset.type), height: 'auto', borderRadius: '5px', opacity: .25, }} src={asset ? `/images/Icons/d${asset.level}.png` : '/images/unknown.png'} alt={asset.level} />}
							{asset.result && <img style={{ maxHeight: '50px', backgroundColor: getFadedColor(asset.type), height: 'auto', borderRadius: '5px' }} src={asset ? `/images/Icons/d${asset.result}.png` : '/images/unknown.png'} alt={asset.result} />}
						</div>
					</Box>

					{!alt	&& <Box colSpan={18}>
						<b>{asset.name}</b>
						<p>Disabled</p>
						<p>{new Date(asset.timeout).toDateString()} {new Date(asset.timeout).getHours()}:00</p>
					</Box>}

				</Flex>
			</div>
		)
	else return ( 
		<div ref={drag} style={{ cursor: 'pointer' }}>
			<Flex  justify="space-around" align='middle'>		

			<Box colSpan={4} >
				<div style={{  textAlign: 'center' }} >
					{asset.level && <img style={{ maxHeight: '50px', backgroundColor: getFadedColor(asset.type), height: 'auto', borderRadius: '5px' }} src={asset ? `/images/Icons/d${asset.level}.png` : '/images/unknown.png'} alt={asset.level} />}
					{asset.result && <img style={{ maxHeight: '50px', backgroundColor: getFadedColor(asset.type), height: 'auto', borderRadius: '5px' }} src={asset ? `/images/Icons/d${asset.result}.png` : '/images/unknown.png'} alt={asset.result} />}
				</div>
			</Box>

			{!alt	&& <Box colSpan={18}>
				<b>{asset.name}</b>
			</Box>}

			{asset.status && asset.status.map((status, index) => (
					<p index={index}>{status}</p>
				))}
		</Flex>			
		</div>
		);
}

export default (Dice);
