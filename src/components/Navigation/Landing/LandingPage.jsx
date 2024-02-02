import React, { useState } from 'react';
import { Box, Grid, GridItem, Wrap, useBreakpoint } from '@chakra-ui/react';
import NavBar from './NavBar';
import ImageTextPair from './ImageTextPair';
import backgroundImg from '../../Images/Old Images/agenda.jpg';
import WordDivider from '../../WordDivider';
import ImgPanel from '../ImgPanel';
import { openLink } from '../../../scripts/frontend';
import { useNavigate } from 'react-router-dom';

const LandingPage = (props) => {
  const [show, setShow] = useState('home');
  const [subTab, setSubTab] = useState(0);
  const navigate = useNavigate();

  const games = [
    {
      name: 'Afterlife',
    },
    {
      name: 'Tempest',
    },
    {
      name: "Gods' Wars",
    }
  ]

  return (
    <Box >

      {show === 'home' && <div>
        <h2>Welcome to CANDI!</h2>
        <ImageTextPair
          bg='#fefefc'
          title={'What is CANDI?'}
          description={'CANDI is a software platform to help run and facilitate online roleplaying games. Started as a way to run Play by Email Games, CANDI has evolved over it\'s existence to become a Megagame and roleplaying game engine'}
          imgUrl={backgroundImg}
          reversed
        />

        {/* <ImageTextPair
            title='Have confidence in your tile projects'
            description="At Walnut Creek Flooring and Tile, we specialize in creating stunning and functional tile installations for homes and businesses. Our team of skilled professionals install custom tile showers, tub surrounds, backsplashes, and more. We work closely with our clients to understand their vision and bring their ideas to life, paying close attention to every detail of the installation process. With a focus on exceptional craftsmanship and customer satisfaction, we are committed to delivering results that exceed your expectations. Whether you're looking to update your kitchen or bathroom, or want to add a unique touch to your commercial space, we can help you create a custom tile installation that will elevate the look and feel of the room. Contact us today to schedule a consultation and start planning your next tile project."
            imgUrl={backgroundImg}
          /> */}

        <WordDivider background size="xl" color="black" word={"Past Games"} />

        <Wrap  gap={1}>
          {games.map(el => (
            <Box key={el.name} w='33%' height={'200px'} onClick={() => openLink("https://kepler.moonpath.de/")}>
              <ImgPanel to="#" img={`/landing/${el.name}.png`} title={el.name} body={el.name} />
            </Box>
          ))}
        </Wrap>

      </div>}

    </Box>
  );
}

export default (LandingPage);