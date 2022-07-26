import React, { useState } from "react";

const Checkbox = ({ setHabitatLayer }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    if (!checked) setHabitatLayer("hab5");
    else setHabitatLayer("none");
  };

  return <input type="checkbox" checked={checked} onChange={handleChange} />;
};

export default Checkbox;
