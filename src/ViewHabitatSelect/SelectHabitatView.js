import React from "react";
import Select from "react-select";
import { Container, Button } from "react-bootstrap";

const SelectHabitatView = ({ setHabitatType, setView }) => {
  const handleNext = () => {
    setView("add");
  };

  return (
    <Container className="mt-3">
      <p>Select Habitat Type:</p>
      <div>
        <span>
          <em>Please select one habitat type from the list to visualize.</em>
        </span>
        <br></br>
        <br></br>
        <span>Habitat Type:</span>
        <br></br>
        <Select
          id="selectHabitatType"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9 }),
          }}
          menuPortalTarget={document.body}
          options={[
            // { value: 'hab1', label: 'Open Pine Woodland BDH' },
            // { value: 'hab2', label: 'Forested Wetland' },
            { value: "hab3", label: "Upland Hardwoods - Forest" },
            { value: "hab4", label: "Upland Hardwoods - Woodland" },
            { value: "hab5", label: "Mixed Forest" },
            { value: "hab6", label: "Grass" },
            // { value: 'hab7', label: 'Tidal Marsh' },
            // { value: 'hab8', label: 'Big Rivers' },
            // { value: 'hab9', label: 'Streams and Rivers' }
          ]}
          isMulti={false}
          isClearable={false}
          placeholder="Select Habitat..."
          name="selectHabitatType"
          onChange={(selectedOption) => {
            setHabitatType(selectedOption.value);
          }}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
      <Container className="button-cont">
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </Container>
    </Container>
  );
};

export default SelectHabitatView;
