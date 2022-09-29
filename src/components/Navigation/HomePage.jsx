import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Icon, Loader, Dropdown, IconButton, FlexboxGrid, Col, Row, Badge, Toggle, SelectPicker } from "rsuite";
import { Select } from "@chakra-ui/react";
import { getMyCharacter, getCharacterById, getPlayerCharacters } from "../../redux/entities/characters";
import ImgPanel from "./ImgPanel";

// import aang from '../Images/aang.jpg'
import control2 from "../Images/control.png";
import other from "../Images/other.jpg";
import news from "../Images/News.jpg";
import actions from "../Images/actions.jpg";
import agendas from "../Images/agendas.webp";
import hello from "../Images/hello.jpg";

import socket from "../../socket";
import { toggleDuck } from "../../redux/entities/gamestate";
//import { Link } from 'react-router-dom';
import UserList from "./UserList";
import LoadingNew from "./LoadingNew";
import { getPublishedArticles } from "../../redux/entities/articles";
import { signOut, setCharacter } from "../../redux/entities/auth";

const HomePage = (props) => {
  const [loaded, setLoaded] = React.useState(false);
  const [clock, setClock] = React.useState({ hours: 0, minutes: 0, days: 0 });
  const [selectedChar, setSelectedChar] = React.useState("");
  const newsArticles = useSelector(getPublishedArticles);
  const newArticles = useSelector((state) => state.articles.new);
  const allCharacters = useSelector((state) => state.characters.list);
  const sortedArticles = [...newsArticles].sort((a, b) => {
    let da = new Date(a.createdAt),
      db = new Date(b.createdAt);
    return db - da;
  });
  const tempCharacter = useSelector(getCharacterById(selectedChar));

  useEffect(() => {
    if (
      !props.loading &&
      props.actionsLoaded &&
      props.gamestateLoaded &&
      props.charactersLoaded &&
      props.locationsLoaded &&
      //props.gameConfigLoaded &&
      props.assetsLoaded
    ) {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    renderTime(props.gamestate.endTime);
    setInterval(() => {
      renderTime(props.gamestate.endTime);
      //clearInterval(interval);
    }, 60000);
  }, [props.gamestate.endTime]);

  useEffect(() => {
    if (
      !props.loading &&
      props.actionsLoaded &&
      props.gamestateLoaded &&
      props.charactersLoaded &&
      props.locationsLoaded &&
      // props.gameConfigLoaded &&
      props.assetsLoaded
    ) {
      setTimeout(() => setLoaded(true), 2000);
    }
  }, [props]);

  useEffect(() => {
    if (tempCharacter) props.setCharacter(tempCharacter);
  }, [tempCharacter]);

  const handleLogOut = () => {
    props.logOut();
    socket.emit("logout");
    props.history.push("/login");
  };

  const renderTime = (endTime) => {
    let countDownDate = new Date(endTime).getTime();
    const now = new Date().getTime();
    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    setClock({ hours, minutes, days });
  };

  const openNexus = () => {
    const win = window.open("https://www.patreon.com/wcmprojectnexus", "_blank");
    win.focus();
  };

  const handleCharChange = (charId) => {
    if (charId) {
      setSelectedChar(charId);
    } else setSelectedChar(props.myCharacter._id);
  };

  if (!props.login && !props.loading) {
    props.history.push("/");
    return <Loader inverse center content='doot...' />;
  }
  if (!loaded) {
    return <LoadingNew />;
  } else if (props.login && !props.myCharacter) {
    props.history.push("/no-character");
    return <Loader inverse center content='doot...' />;
  } else if (props.gamestate.status === "Down") {
    props.history.push("/down");
    return <Loader inverse center content='doot...' />;
  }

  return (
    <React.Fragment>
      <FlexboxGrid
        justify='start'
        style={{
          height: "50px",
          fontSize: "0.966em",
          backgroundColor: "#746D75",
          color: "",
          borderBottom: "3px solid",
          borderRadius: 0,
          borderColor: "#d4af37",
        }}
        align='middle'
      >
        <FlexboxGrid.Item style={{ alignItems: "center" }} colspan={1}>
          <Dropdown
            renderTitle={() => {
              return <IconButton icon={<Icon icon='bars' size='4x' />} size='md' circle />;
            }}
          >
            <Dropdown.Item>Version: {props.version}</Dropdown.Item>
            <Dropdown.Item onSelect={() => window.open("https://github.com/Project-Nexus-Megagames/CANDI-issues/issues")}>Report Issues</Dropdown.Item>
            <Dropdown.Item onSelect={() => handleLogOut()}>Log Out</Dropdown.Item>
            <Dropdown.Item onSelect={() => props.toggleDuck()}>Spook</Dropdown.Item>
          </Dropdown>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item colspan={19}>
          <div>
            <p>Round: {props.gamestate.round} </p>
            {clock.days > 0 && (
              <p>
                Time Left: {clock.days} Days, {clock.hours} Hours{" "}
              </p>
            )}
            {clock.hours > 0 && clock.days <= 0 && (
              <p>
                Time Left: {clock.hours} Hours, {clock.minutes} Minutes
              </p>
            )}
            {clock.hours <= 0 && clock.minutes > 0 && clock.days <= 0 && <p>Time Left: {clock.minutes} Minutes</p>}
            {clock.days + clock.hours + clock.minutes <= 0 && <p>Game Status: {props.gamestate.status}</p>}
          </div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={3}>
          {props.currentCharacter.tags.some((el) => el.toLowerCase() === "control") && (
            <p>
              VIEW AS:
              <SelectPicker data={allCharacters} valueKey='_id' labelKey='characterName' onChange={(event) => handleCharChange(event)}></SelectPicker>
            </p>
          )}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={1}>{props.currentCharacter.tags.some((el) => el === "Control") && <UserList />}</FlexboxGrid.Item>
      </FlexboxGrid>

      <Row>
        <Col lg={12} md={24}>
          <ImgPanel new={newArticles.length > 0} img={news} to='news' title='~ News ~' body='What is happening in the world?' />
          {/* <Carousel height="45vh" to="news" data={sortedArticles.slice(0, 3)}></Carousel> */}
        </Col>

        <Col lg={6} md={12}>
          <ImgPanel img={actions} to='actions' title='~ Actions ~' body='Do the things' />
        </Col>

        <Col lg={6} md={12}>
          <ImgPanel img={agendas} to='agendas' title='~ Agendas ~' body='The Mootening awaits' />
        </Col>

        <Col lg={8} md={24}>
          <ImgPanel img={props.currentCharacter.profilePicture} to='character' title='~ My Character ~' body='My Assets and Traits' />
        </Col>

        {props.control && (
          <Col lg={8} md={24}>
            {props.user.username.toLowerCase() === "bobtheninjaman" && <ImgPanel img={hello} to='control' title={"~ Control Terminal ~"} body='"Now he gets it!"' />}
            {props.user.username.toLowerCase() !== "bobtheninjaman" && <ImgPanel img={control2} to='control' title={"~ Control Terminal ~"} body='"Now he gets it!"' />}
          </Col>
        )}

        {!props.control && (
          <Col onClick={() => openNexus()} lg={8} md={24}>
            {<ImgPanel img={control2} to='' title='~ Project Nexus ~' body='Support the Programmers' />}
          </Col>
        )}

        <Col lg={8} md={24}>
          <ImgPanel img={other} to='others' title={"~ Other Characters ~"} body='Character Details' />
        </Col>
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  control: state.auth.character ? state.auth.character.tags.some((el) => el.toLowerCase() === "control") : state.auth.control,
  login: state.auth.login,
  loading: state.auth.loading,
  gamestate: state.gamestate,
  gamestateLoaded: state.gamestate.loaded,
  actionsLoaded: state.actions.loaded,
  charactersLoaded: state.characters.loaded,
  assetsLoaded: state.assets.loaded,
  locationsLoaded: state.locations.loaded,
  version: state.gamestate.version,
  duck: state.gamestate.duck,
  myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
  currentCharacter: state.auth.character,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(signOut()),
  toggleDuck: (data) => dispatch(toggleDuck(data)),
  setCharacter: (payload) => dispatch(setCharacter(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>
