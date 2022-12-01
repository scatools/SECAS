import React, { useState } from "react";
import ActionLocationSelect from "./ActionLocationSelect";
import ActionSelect from "./ActionSelect";

const TakeActionView = ({
  aoiSelected,
  setHexIdInBlue,
  restoreAction,
  setRestoreAction,
  protectAction,
  setProtectAction,
  maintainAction,
  setMaintainAction
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
          restoreAction={restoreAction}
          setRestoreAction={setRestoreAction}
          protectAction={protectAction}
          setProtectAction={setProtectAction}
          maintainAction={maintainAction}
          setMaintainAction={setMaintainAction}
        />
      )}
    </>
  );
};

export default TakeActionView;
