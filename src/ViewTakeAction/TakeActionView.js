import React, { useState } from "react";
import ActionLocationSelect from "./ActionLocationSelect";
import ActionSelect from "./ActionSelect";

const TakeActionView = ({ aoiSelected, setHexIdInBlue }) => {
  const [actionView, setActionView] = useState("actionLocation");
  return (
    <>
      {actionView === "actionLocation" && (
        <ActionLocationSelect
          aoiSelected={aoiSelected}
          setHexIdInBlue={setHexIdInBlue}
          setActionView={setActionView}
        />
      )}

      {actionView === "actionSelect" && <ActionSelect />}
    </>
  );
};

export default TakeActionView;
