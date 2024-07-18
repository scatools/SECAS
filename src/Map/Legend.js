import React from "react";

const Legend = ({ legendInfo, hexGrid=false, opacity=0.5 }) => {
  let legendTitles = {
    FW: ["Current Site Condition for \nForest Wetland"],
    UHF: ["Current Site Condition for \nUpland Hardwoods -- Forest"],
    UHW: ["Current Site Condition for \nUpland Hardwoods -- Woodland"],
    MF: ["Current Site Condition for \nMixed Forest"],
    G: ["Current Site Condition for \nGrass"],
  };

  let legendColors = {
    FW: ["#ACFFAD", "#71EFA3", "#50CB93", "#54436B"],
    UHF: ["#ffffcc", "#c2e699", "#78c679", "#238443"],
    UHW: ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"],
    MF: ["#a6611a", "#dfc27d", "#80cdc1", "#018571"],
    G: ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
  };

  let legendLabels = ["Low", "Medium", "High", "Very High"];

  return (
    <div
      className="legend"
      style={legendInfo || hexGrid ? { display: "block" } : { display: "none" }}
    >
      {legendInfo && (
        <>
          <div className="legend-title">{legendTitles[legendInfo]}</div>
          <div className="legend-scale">
            <ul className="legend-labels">
              <li>
                <span
                  style={{ background: legendColors[legendInfo][0], opacity: 0.5 }}
                />
                {legendLabels[0]}
              </li>
              <li>
                <span
                  style={{ background: legendColors[legendInfo][1], opacity: 0.5 }}
                />
                {legendLabels[1]}
              </li>
              <li>
                <span
                  style={{ background: legendColors[legendInfo][2], opacity: 0.5 }}
                />
                {legendLabels[2]}
              </li>
              <li>
                <span
                  style={{ background: legendColors[legendInfo][3], opacity: 0.5 }}
                />
                {legendLabels[3]}
              </li>
            </ul>
          </div>
        </>
      )}
      {hexGrid && (
        <>
          <div className="legend-title">HFC Score</div>
          <div className="legend-scale">
            <ul className="legend-labels">
              <li>
                <span
                  style={{ background: "#aefff0", opacity: opacity }}
                />
                0 ~ 0.1
              </li>
              <li>
                <span
                  style={{ background: "#00d8f2", opacity: opacity }}
                />
                0.1 ~ 0.3
              </li>
              <li>
                <span
                  style={{ background: "#00a7e4", opacity: opacity }}
                />
                0.3 ~ 0.5
              </li>
              <li>
                <span
                  style={{ background: "#007ad0", opacity: opacity }}
                />
                0.5 ~ 0.7
              </li>
              <li>
                <span
                  style={{ background: "#5d00d8", opacity: opacity }}
                />
                0.7 ~ 0.9
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
export default Legend;
