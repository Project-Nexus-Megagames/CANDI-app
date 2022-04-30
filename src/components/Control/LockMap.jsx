import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Redux store provider
import { Modal } from "rsuite";
import socket from "../../socket";

const LockMap = (props) => {
  const handleSubmit = () => {
    try {
    } catch (err) {}
  };

  return (
    <Modal
      overflow
      full
      size="lg"
      show={props.show}
      onHide={() => props.closeModal()}
    >
      <Modal.Header>
        <Modal.Title>Lock Map Tile for Character</Modal.Title>
      </Modal.Header>
    </Modal>
  );
};

export default LockMap;
