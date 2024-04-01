import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Grid, GridItem, Input, VStack } from '@chakra-ui/react';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import AssetCard from '../Common/AssetCard';

const AssetTab = (props) => {
  const assets = useSelector(s => s.assets.list);
  const { login, team, character } = useSelector(s => s.auth);
  const loading = useSelector(s => s.gamestate.loading);
  const [renderTags, setRenderTags] = useState([]); // TODO: update with Faction tags
  const [selected, setSelected] = useState(undefined);
  const [fil, setFilter] = useState('');

  // dynamically creat tags based on the assets that exis
  useEffect(() => {
    if (assets) {
      let uniqueChars = [];
      for (const char of assets) {
        uniqueChars = uniqueChars.concat(char.tags);
      }
      uniqueChars = [...new Set(uniqueChars)];
      setRenderTags(uniqueChars);
    }
  }, [assets]);


  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={'400px 1fr'}
      height={"5vh"}
      bg='blue'
      gap='1'
      fontWeight='bold'>

      <GridItem pl='2' bg='#0f131a' area={'nav'} style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }} >
        <Input style={{ width: '100%' }} placeholder="Search" onChange={(e) => setFilter(e.target.value)}></Input>
        {renderTags.map((tag, index) => {
          const filteredAssets = assets.filter((el) => el.type === tag)
            .filter(user => user.name.toLowerCase().includes(fil.toLowerCase()) ||
              user.description.toLowerCase().includes(fil.toLowerCase()
              ));
          if (filteredAssets.length > 0) return (
            <Box key={index}>
              <Box
                marginTop='2rem'
              />
              <h5 style={{ backgroundColor: getFadedColor(tag), color: getTextColor(`${tag}-text`), textAlign: 'center', }} >{tag}</h5>
              <Box
                marginBottom='1rem'
              />
              <VStack divider={<Divider />} >
                {filteredAssets
                  .map(asset => (
                    <Box key={asset._id} onClick={() => setSelected(asset)}>
                      <p>{asset.name}</p>

                      {asset._id}
                    </Box>
                  ))
                }
              </VStack>
            </Box>
          )
          return (false)
        })}
      </GridItem>
      <GridItem pl='2' bg='#0f131a' area={'main'} >

        <Box style={{ height: '50vh', overflow: 'auto', width: '100%' }}>
          {selected && <AssetCard asset={selected} showButtons handleSelect={(asset) => setSelected(asset)} />}
        </Box>
      </GridItem>
    </Grid>
  );
}

export default (AssetTab);