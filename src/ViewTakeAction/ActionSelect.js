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
  const actionDefinitions = {
    restore: "To restore (restoration) means utilizing human intervention (such as planting trees) to reverse degradation, under the influence of urbanization",
    protect: "To protect (protection) means reserving conservation values (such as fee title acquisition or conservation easement) for certain parcels, regardless of the chance of urbanization",
    maintain: "To maintain (maintenance) means sustaining management of natural resources (such as opening up existing pine) to prevent degredation, under the influence of urbanization",
    protectAndRestore: "A combination of protection and restoration will be based on restoration but exclude the impact of urbanization on the protected parcels",
    protectAndMaintain: "A combination of protection and maintenance will be based on maintenance but exclude the impact of urbanization on the protected parcels"
  };

  return (
    <>
      <h2>Which Action(s) to Take?</h2>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          marginTop: "30px"
        }}
      >
        {!maintainAction && (
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
        )}
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
        {!restoreAction && (
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
        )}
      </div>
      {(restoreAction || protectAction || maintainAction) && (
        <div 
          style={{
            width: "90%",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            margin: "20px"
          }}
        >
          {restoreAction && !protectAction && !maintainAction && (actionDefinitions.restore)}
          {!restoreAction && protectAction && !maintainAction && (actionDefinitions.protect)}
          {!restoreAction && !protectAction && maintainAction && (actionDefinitions.maintain)}
          {restoreAction && protectAction && !maintainAction && (actionDefinitions.protectAndRestore)}
          {!restoreAction && protectAction && maintainAction && (actionDefinitions.protectAndMaintain)}
        </div>
      )}
      <FutureWithActionTable />
    </>
  );
};

export default ActionSelect;
