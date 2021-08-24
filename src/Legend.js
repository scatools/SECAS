import React from 'react';

const Legend = ({legendInfo}) => {

	let color = ['#ACFFAD', '#71EFA3', '#50CB93', '#54436B'];
	let color_FW = ['#ACFFAD', '#71EFA3', '#50CB93', '#54436B'];
	let color_UHF = ['#CDD193', '#BACC81', '#478C5C', '#013A20'];
	let color_UHW = ['#E4D4C8', '#D0B49F', '#A47551', '#523A28'];
	let color_TM = ['#D4F1F4', '#75E6DA', '#189AB4', '#05445E'];

	let range = ["0~1", "1~2", "2~3", "3~4"];
	let range1 = ["0~1", "1~2", "2~3", "3~4"];
	let range2 = ["0%~25%", "25%~50%", "50~75%", "75%~100%"];
	
	if (legendInfo) {

		if (legendInfo[0] == "FW") {
			color = color_FW;
		}
		else if (legendInfo[0] == "UHF") {
			color = color_UHF;
		}
		else if (legendInfo[0] == "UHW") {
			color = color_UHW;
		}
		else if (legendInfo[0] == "TM") {
			color = color_TM;
		}
		
		if (legendInfo[1] == "AWMN") {
			range = range1;
		}
		else if (legendInfo[1] == "PROP") {
			range = range2;
		}
	}
	
	return (
		<div class="legend" style={legendInfo ? {display: "block"} : {display: "none"}}>
			<div class="legend-title">Legend</div>
			<div class="legend-scale">
				<ul class="legend-labels">
					<li>
						<span style={{background:color[0]}} />{range[0]}
					</li>
					<li>
						<span style={{background:color[1]}} />{range[1]}
					</li>
					<li>
						<span style={{background:color[2]}} />{range[2]}
					</li>
					<li>
						<span style={{background:color[3]}} />{range[3]}
					</li>
				</ul>
			</div>
		</div>
	);
};
export default Legend;
