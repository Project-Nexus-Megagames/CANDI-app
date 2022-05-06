import React, { useState } from "react";
import { useSelector } from "react-redux"; // Redux store provider
import {
  Modal,
  SelectPicker,
  ButtonGroup,
  Button,
  CheckboxGroup,
  Checkbox,
  Panel,
} from "rsuite";
import socket from "../../socket";
import { getLocationById } from "../../redux/entities/locations";
import _ from "lodash";

const LockMap = (props) => {
  const locations = useSelector((state) => state.locations.list);
  const characters = useSelector((state) => state.characters.list);
  const sortedLocations = _.sortBy(locations, "name");
  const [selectedLoc, setSelectedLoc] = useState("");
  const [charsToRemove, setCharsToRemove] = useState("");
  const loc = useSelector(getLocationById(selectedLoc));

  const handleExit = () => {
    setCharsToRemove("");
    setSelectedLoc("");
    props.closeModal();
  };

  const handleSubmit = () => {
    const data = { loc, charsToRemove };
    try {
      socket.emit("request", {
        route: "location",
        action: "lockLocation",
        data,
      });
    } catch (err) {}
    handleExit();
  };

  const handleLocChange = (event) => {
    if (event) {
      setSelectedLoc(event);
    }
  };

  const handleCharChange = (charIds) => {
    setCharsToRemove(charIds);
  };

  const filterForUnlockedCharacters = (charIds) => {
    let chars = [];
    for (const el of charIds) {
      chars.push(characters.find((char) => char._id === el));
    }
    chars = _.sortBy(chars, "characterName");
    return chars;
  };

  const renderUnlockedCharacters = (loc) => {
    const data = loc.unlockedBy;
    console.log(data);
    if (data.length === 0)
      return <div>No character has unlocked this location yet!</div>;
    const chars = filterForUnlockedCharacters(data);
    console.log(chars);
    return (
      <CheckboxGroup onChange={(value) => handleCharChange(value)}>
        {data.map((item) => (
          <Checkbox value={item._id} key={item._id}>
            {item.characterName}
          </Checkbox>
        ))}
      </CheckboxGroup>
    );
  };

  const renderLocation = () => {
    if (!loc) return <div>Please Select a location!</div>;

    return (
      <div>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>{loc.name}</div>
        {renderUnlockedCharacters(loc)}
      </div>
    );
  };

  return (
    <Modal
      overflow
      full
      size="lg"
      show={props.show}
      onHide={() => {
        handleExit();
      }}
    >
      <Modal.Header>
        <Modal.Title>Lock Map Tile for Character</Modal.Title>
      </Modal.Header>
      <Panel>
        <SelectPicker
          block
          placeholder="Lock a MapTile"
          onChange={(event) => handleLocChange(event)}
          data={sortedLocations}
          valueKey="_id"
          labelKey="name"
        />
      </Panel>
      <Panel>{renderLocation()}</Panel>
      <Modal.Footer>
        <ButtonGroup>
          <Button onClick={() => handleSubmit()} color="red">
            Lock Map
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};

export default LockMap;
