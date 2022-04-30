import React, { useEffect, useState } from "react";
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
import RenderCharName from "./RenderCharName";

const LockMap = (props) => {
  const locations = useSelector((state) => state.locations.list);
  const [selectedLoc, setSelectedLoc] = useState("");
  const loc = useSelector(getLocationById(selectedLoc));

  const handleSubmit = () => {
    try {
    } catch (err) {}
  };

  //   assetModify = async () => {
  //     this.props.assetDispatched();
  //     const data = {
  //         _id: this.state.selected,
  //         name: this.state.name,
  //         description: this.state.description,
  //         dice: this.state.dice,
  //         uses: this.state.uses,
  //         owner: this.state.owner,
  //         used: this.state.used,
  //         level: this.state.level,
  //         lendable: this.state.lendable,
  //         hidden: this.state.hidden
  //     }
  //     socket.emit('assetRequest', 'modify',  data ); // new Socket event
  //     this.setState({ selected: null, });
  //     this.props.closeModal()
  // }

  const handleChange = (event) => {
    if (event) {
      setSelectedLoc(event);
    }
  };

  const renderUnlockedCharacters = (loc) => {
    const data = loc.unlockedBy;
    if (data.length === 0)
      return <div>No character has unlocked this location yet!</div>;
    return (
      <CheckboxGroup>
        {data.map((item) => (
          <Checkbox key={data.indexOf(item)}>
            <RenderCharName userId={item} />{" "}
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
        props.closeModal();
        setSelectedLoc("");
      }}
    >
      <Modal.Header>
        <Modal.Title>Lock Map Tile for Character</Modal.Title>
      </Modal.Header>
      <Panel>
        <SelectPicker
          block
          placeholder="Lock a MapTile"
          onChange={(event) => handleChange(event)}
          data={locations}
          valueKey="_id"
          labelKey="name"
        />
      </Panel>
      <Panel>{renderLocation()}</Panel>
      {/* //             <Modal.Footer>
//                 {this.state.selected &&
//                 <ButtonGroup>
//                     <Button loading={this.props.assetLoading} onClick={() => this.assetModify()} color="blue">Edit</Button>
//                     <Button loading={this.props.assetLoading} onClick={() => this.handleDelete()} color="red">Delete</Button>
//                 </ButtonGroup>}
//             </Modal.Footer> */}
    </Modal>
  );
};

export default LockMap;
