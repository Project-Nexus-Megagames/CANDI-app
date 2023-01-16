import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Redux store provider
import NavigationBar from "../Navigation/NavigationBar";
import NewCharacter from "../Control/NewCharacter";
import { getPublicCharacters, getPrivateCharacters, getMyUnlockedCharacters } from "./../../redux/entities/characters";
import { Tag } from "@chakra-ui/tag";

const OtherCharacters = (props) => {
  const publicCharacters = useSelector(getPublicCharacters);
  const privateCharacters = useSelector(getPrivateCharacters);
  const knownContacts = useSelector(getMyUnlockedCharacters);
  const [selected, setSelected] = useState(null);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [asset, setAsset] = useState(false);
  const [image, setImage] = useState("");

  const [showNew, setShowNew] = useState(false);
  const loggedInUser = useSelector((state) => state.auth.user);

  if (!props.login) {
    props.history.push("/");
    return <div />;
  }

  let characters = [...publicCharacters, ...knownContacts];
  characters = [...new Set(characters)];
  const [renderTags] = React.useState(["Frog", "Pig", "Spider", "Myconid", "Raccoon", "Drow", "Dwarves", "Whitewall", "The Overlord", "Other", "Control"]); // TODO: update with Faction tags

  useEffect(() => {
    filterThis("");
  }, [publicCharacters, privateCharacters, knownContacts]);

  const theBox = () => {
    const audio = new Audio("/candi1.mp3");
    audio.loop = true;
    audio.play();
    setImage("https://res.cloudinary.com/df8lwfbar/image/upload/v1664447183/goblinCity/kpj2mcukweiq3edjp4ww.jpg");
  };
  const copyToClipboard = (character) => {
    if (character.characterName === "The Box") {
      theBox();
    } else {
			// Build a transitive closure of all control affected.
			let board = `${character.email}`;

			// First get the control of the searched character and the current character
			let pending = [...character.control]
			let seen = [];
			for (const controller of props.myCharacter.control) {
				if (!pending.some((el) => el === controller)) {
					pending.push(controller);
				}
			}
			while (pending.length != 0)  {
				const cur = pending.shift()
				seen.push(cur)
				const character = props.characters.find((el) => el.characterName === cur)
				if(character) {
					// add their controllers to the list to be searched if we haven't already done them
					for (const controller of character.control) {
						if ((!seen.some((el) => el === controller)) && (!pending.some((el) => el === controller))) {
							pending.push(controller);
						}
					}
					board = board.concat(`; ${character.email}`);
				} else {
					console.log(`${character} could not be added to clipboard`);
					// Alert.error(`${character} could not be added to clipboard`, 6000);
				}
			}

      navigator.clipboard.writeText(board);
      // Alert.success("Email Copied!", 6000);
    }
  };

  const openAnvil = (character) => {
    if (character.characterName === "The Box") {
      const audio = new Audio("/candi1.mp3");
      audio.loop = true;
      audio.play();
    } else {
      if (character.wiki && character.wiki !== "") {
        let url = character.wiki;
        const win = window.open(url, "_blank");
        win.focus();
      } else if (character.tags.some((el) => el === "God" || el === "Gods")) {
        let url = `https://godswars.miraheze.org/wiki/Gods#${character.characterName}`;
        const win = window.open(url, "_blank");
        win.focus();
      } else {
        let url = "https://godswars.miraheze.org/wiki/";
        let temp = url.concat(character.characterName.split(" ").join("_"));
        const win = window.open(temp, "_blank");
        win.focus();
      }
    }
  };

  const tagStyle = (item, index) => {
    switch (item) {
      case "Control":
        return (
          <Tag key={index} style={{ color: "black" }} color='orange'>
            {item}
          </Tag>
        );
      case "God":
        return (
          <Tag key={index} color='green'>
            {item}
          </Tag>
        );
      case "NPC":
        return (
          <Tag key={index} color='blue'>
            {item}
          </Tag>
        );
      case "PC":
        return (
          <Tag key={index} color='cyan'>
            {item}
          </Tag>
        );
      case "Private":
        return (
          <Tag key={index} color='red'>
            {item}
          </Tag>
        );
      default:
        return <Tag key={index}>{item}</Tag>;
    }
  };

  const listStyle = (item) => {
    if (selected && item._id === selected._id) {
      return { cursor: "pointer", backgroundColor: "#212429" };
    } else return { cursor: "pointer", height: "100%" };
  };

  useEffect(() => {
    if (props.characters && selected) {
      const updated = props.characters.find((el) => el._id === selected._id);
      setSelected(updated);
      setImage(selected.profilePicture);
    }
  }, [props.characters, selected]);

  const filterThis = (fil) => {
    const filtered = characters.filter(
      (char) =>
        char.characterName.toLowerCase().includes(fil.toLowerCase()) ||
        char.email.toLowerCase().includes(fil.toLowerCase()) ||
        char.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
        char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
    );
    setFilteredCharacters(filtered);
  };

  // if (window.innerWidth < 768) {
  // 	return <MobileOtherCharacters />;
  // } else
  return (
    <React.Fragment>
      <NavigationBar />
        TODO fix this too
      <NewCharacter show={showNew} closeModal={() => setShowNew(false)} />
    </React.Fragment>
  );
};

export default (OtherCharacters);
