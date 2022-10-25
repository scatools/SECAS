import React, { useState } from "react";
import Switch from "react-switch";
import FutureWithActionTable from "./FutureWithActionTable";

const ActionSelect = ({
  restoreAction,
  setRestoreAction,
  protectAction,
  setProtectAction,
  maintainAction,
  setMaintainAction
}) => {

  return (
    <>
      <h2>Which Action(s) to Take?</h2>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          marginTop: "30px",
        }}
      >
        <label className="floating-toggle-switch">
          Restore
          <Switch
            checked={restoreAction}
            onChange={() => {
              setRestoreAction(!restoreAction);
            }}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={20}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={15}
            width={36}
          />
        </label>
        <label className="floating-toggle-switch">
          Protect
          <Switch
            checked={protectAction}
            onChange={() => {
              setProtectAction(!protectAction);
            }}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={20}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={15}
            width={36}
          />
        </label>
        <label className="floating-toggle-switch">
          Maintain
          <Switch
            checked={maintainAction}
            onChange={() => {
              setMaintainAction(!maintainAction);
            }}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={20}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={15}
            width={36}
          />
        </label>
      </div>
      <FutureWithActionTable />
    </>
  );
};

export default ActionSelect;
