import React, { useState } from "react";
import ActionLocationSelect from "./ActionLocationSelect";
import ActionSelect from "./ActionSelect";

const TakeActionView = ({
  aoiSelected,
  hexData,
  setHexIdInBlue,
  actionScores,
  setActionScores,
}) => {
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

      {actionView === "actionSelect" && (
        <ActionSelect
          hexData={hexData}
          actionScores={actionScores}
          setActionScores={setActionScores}
        />
      )}
    </>
  );
};

export default TakeActionView;
