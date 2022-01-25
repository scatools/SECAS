import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

const TimeoutError = ({ countdown }) => {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>TIMEOUT ERROR</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your Areas of Interest have taken too long to load. <br />
        The page will refresh in {countdown} seconds.
      </Modal.Body>
    </Modal>
  );
};
export default TimeoutError;
