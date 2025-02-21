import React, { useState } from "react";
import ActionLocationSelect from "./ActionLocationSelect";
import ActionSelect from "./ActionSelect";

const TakeActionView = ({
  aoiSelected,
  hexData,
  setActionHexData,
  hexIdInBlue,
  setHexIdInBlue,
  actionScores,
  setActionScores,
}) => {
  const [actionView, setActionView] = useState("actionSelect");
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
          setActionHexData={setActionHexData}
          hexIdInBlue={hexIdInBlue}
          actionScores={actionScores}
          setActionScores={setActionScores}
        />
      )}
    </>
  );
};

export default TakeActionView;
