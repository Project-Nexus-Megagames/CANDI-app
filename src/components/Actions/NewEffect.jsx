import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux"; // Redux store provider
import {
  Alert,
  Modal,
  SelectPicker,
  CheckPicker,
  Divider,
  Tag,
  Button,
  TagGroup,
  FlexboxGrid,
  List,
  ButtonGroup,
  Loader,
  Row,
  Col,
  Panel,
  InputPicker,
  Placeholder,
  InputNumber,
} from "rsuite";
import socket from "../../socket";

import {
  getGods,
  getNonPlayerCharacters,
} from "../../redux/entities/characters";

const NewEffects = (props) => {
  const [type, setType] = useState("");
  const [selected, setSelected] = useState(undefined);
  const [array, setArray] = useState([]);

  const assets = useSelector((state) => state.assets.list);
  const locations = useSelector((state) => state.locations.list);
  const gods = useSelector(getGods);
  const mortals = useSelector(getNonPlayerCharacters);

  useEffect(() => {
    switch (type) {
      case "bond":
        let bonds = [];

        for (const bond of assets.filter(
          (el) =>
            (el.type === "GodBond" || el.type === "MortalBond") &&
            el.ownerCharacter === props.selected.creator._id
        )) {
          const bondData = {
            name: `${bond.name} - ${bond.with.characterName} - ${bond.level}`,
            level: bond.level,
            type: bond.type,
            _id: bond._id,
          };
          bonds.push(bondData);
        }
        setArray(bonds);
        break;
      case "asset":
        let newAsset = [];
        for (const bond of assets.filter(
          (el) =>
            el.type !== "GodBond" &&
            el.type !== "MortalBond" &&
            el.ownerCharacter === props.selected.creator._id
        )) {
          console.log(bond.with);
          const bondData = {
            name: `${bond.type} '${bond.name}' - (${bond.dice})`,
            type: bond.type,
            _id: bond._id,
          };
          newAsset.push(bondData);
        }
        setArray(newAsset);
        break;
      case "new":
        setSelected({
          name: "",
          description: "",
          dice: "",
          level: "",
          ownerCharacter: props.selected.creator._id,
        });
        break;
      default:
        break;
    }
  }, [type]);

  const handleExit = () => {
    setType("");
    setSelected(undefined);
    props.hide();
  };

  const handleSelect = (selected) => {
    selected = assets.find((el) => el._id === selected);
    setSelected(selected);
  };

  const handleUnlockLoc = (selected) => {
    console.log(selected);
  };

  const handleType = (type) => {
    setType(type);
    setSelected(undefined);
  };

  const handleEdit = (type, change) => {
    let temp = { ...selected };
    temp[type] = change;
    setSelected(temp);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        type,
        action: props.action._id,
        document: selected,
      };
      socket.emit("actionRequest", "effect", data); // new Socket event
    } catch (err) {
      Alert.error(`Error: ${err.body} ${err.message}`, 5000);
    }
    handleExit();
  };

  const renderAss = () => {
    if (selected) {
      return (
        <Panel>
          Name: {selected.name}
          <textarea
            value={selected.name}
            className="textStyle"
            onChange={(event) => handleEdit("name", event.target.value)}
          ></textarea>
          Description:
          <textarea
            rows="4"
            value={selected.description}
            className="textStyle"
            onChange={(event) => handleEdit("description", event.target.value)}
          ></textarea>
          Dice
          <textarea
            value={selected.dice}
            className="textStyle"
            onChange={(event) => handleEdit("dice", event.target.value)}
          ></textarea>
          Uses
          <InputNumber
            value={selected.uses}
            onChange={(value) => handleEdit("uses", value)}
          />
          {selected.type === "GodBond" && (
            <div>
              Bond Level
              <InputPicker
                labelKey="label"
                valueKey="value"
                data={godPickerData}
                defaultValue={selected.level}
                style={{ width: "100%" }}
                onChange={(event) => handleEdit("level", event)}
              />
            </div>
          )}
          {selected.type === "MortalBond" && (
            <div>
              Bond Level
              <InputPicker
                labelKey="label"
                valueKey="value"
                data={mortalPickerData}
                defaultValue={selected.level}
                style={{ width: "100%" }}
                onChange={(event) => handleEdit("level", event)}
              />
            </div>
          )}
        </Panel>
      );
    } else {
      return (
        <Placeholder.Paragraph rows={5}>
          Awaiting Selection
        </Placeholder.Paragraph>
      );
    }
  };

  return (
    <Modal size="sm" placement="right" show={props.show} onHide={handleExit}>
      <Modal.Header></Modal.Header>
      {
        <Modal.Body>
          <ButtonGroup>
            <Button
              appearance={type !== "bond" ? "ghost" : "primary"}
              color={"cyan"}
              onClick={type !== "bond" ? () => handleType("bond") : undefined}
            >
              Edit Bond
            </Button>
            <Button
              appearance={type !== "asset" ? "ghost" : "primary"}
              color={"blue"}
              onClick={type !== "asset" ? () => handleType("asset") : undefined}
            >
              Edit Resource
            </Button>
            <Button
              appearance={type !== "map" ? "ghost" : "primary"}
              color={"orange"}
              onClick={type !== "map" ? () => handleType("map") : undefined}
            >
              Lock/Unlock Map Tile
            </Button>
            <Button
              appearance={type !== "new" ? "ghost" : "primary"}
              color={"green"}
              onClick={type !== "new" ? () => handleType("new") : undefined}
            >
              New Resource
            </Button>
          </ButtonGroup>
          <Divider />
          {type === "new" && selected && (
            <div>
              Type
              <InputPicker
                labelKey="label"
                valueKey="value"
                data={pickerData}
                defaultValue={selected.level}
                style={{ width: "100%" }}
                onChange={(event) => handleEdit("type", event)}
              />
              {selected.type === "GodBond" && (
                <SelectPicker
                  block
                  placeholder={`${selected.type} with...`}
                  onChange={(event) => handleEdit("with", event)}
                  data={gods}
                  valueKey="_id"
                  labelKey="characterName"
                />
              )}
              {selected.type === "MortalBond" && (
                <SelectPicker
                  block
                  placeholder={`${selected.type} with...`}
                  onChange={(event) => handleEdit("with", event)}
                  data={mortals}
                  valueKey="_id"
                  labelKey="characterName"
                />
              )}
              {renderAss()}
            </div>
          )}
          {(type === "bond" || type === "asset") && (
            <div>
              <SelectPicker
                block
                placeholder={`Edit ${type}`}
                onChange={(event) => handleSelect(event)}
                data={array}
                valueKey="_id"
                labelKey="name"
                groupBy="type"
              ></SelectPicker>
              {renderAss()}
            </div>
          )}
          {type === "map" && (
            <div>
              <CheckPicker
                placeholder="Select Location(s) to unlock..."
                onChange={(event) => handleUnlockLoc(event)}
                data={locations}
                valueKey="_id"
                labelKey="name"
              />
            </div>
            // 			1) In NewEffect.jsx , I listed a TO DO spot where I need a form for the map hex. This form should automatically know who the Character is from the Action, this comes from props.selected.creator._id

            // Control should be able to select any number of locations for the player to unlock

            // 2) Hook up the front end form to the back end logic
          )}
        </Modal.Body>
      }
      <Modal.Footer>
        <Button
          disabled={type === ""}
          onClick={handleSubmit}
          appearance="primary"
        >
          Confirm
        </Button>
        <Button onClick={handleExit} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const godPickerData = [
  {
    label: "Condemned",
    value: "Condemned",
  },
  {
    label: "Disfavoured",
    value: "Disfavoured",
  },
  {
    label: "Neutral",
    value: "Neutral",
  },
  {
    label: "Preferred",
    value: "Preferred",
  },
  {
    label: "Favoured",
    value: "Favoured",
  },
  {
    label: "Blessed",
    value: "Blessed",
  },
];

const mortalPickerData = [
  {
    label: "Loathing",
    value: "Loathing",
  },
  {
    label: "Unfriendly",
    value: "Unfriendly",
  },
  {
    label: "Neutral",
    value: "Neutral",
  },
  {
    label: "Warm",
    value: "Warm",
  },
  {
    label: "Friendly",
    value: "Friendly",
  },
  {
    label: "Bonded",
    value: "Bonded",
  },
];

let aspects = [
  "Justice",
  "Trickery",
  "Balance",
  "Hedonism",
  "Bonding",
  "Arts",
  "Sporting",
  "Fabrication",
  "Scholarship",
  "Pugilism",
  "Glory",
];

const pickerData = [
  {
    label: "Asset",
    value: "Asset",
  },
  {
    label: "Trait",
    value: "Trait",
  },
  {
    label: "Power",
    value: "Power",
  },
  {
    label: "GodBond",
    value: "GodBond",
  },
  {
    label: "MortalBond",
    value: "MortalBond",
  },
];

export default NewEffects;
