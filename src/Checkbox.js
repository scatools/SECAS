import React, { useState } from "react";

const Checkbox = ({ setMapOverlay }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    if (!checked) setMapOverlay("hab5");
    else setMapOverlay("none");
  };

  return <input type="checkbox" checked={checked} onChange={handleChange} />;
};

export default Checkbox;
