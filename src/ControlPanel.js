import React from 'react';
import {Table} from 'react-bootstrap'

const ControlPanel = ({hoverInfo})=> {
    
    return (
      <div className={hoverInfo.hexagon && hoverInfo.hexagon.hasOwnProperty("OBJECTID") ? "control-panel active": "control-panel"}>
          { hoverInfo.hexagon && (
	 			<div>
	 				<div>
	 					<Table striped bordered size="sm" variant="dark">
	 						<tbody>
	 							<tr>
	 								<td colSpan="2">
	 									<b>Habitat: </b>{' '}
	 								</td>
	 							</tr>
	 							<tr>
	 								<td>Padus:</td>
	 								<td>{hoverInfo.hexagon.hab1}</td>
	 							</tr>
	 							<tr>
	 								<td>Structural Connectivity:</td>
	 								<td>{hoverInfo.hexagon.hab2}</td>
	 							</tr>
	 							<tr>
	 								<td>Threat of Urbanization:</td>
	 								<td>{hoverInfo.hexagon.hab3}</td>
	 							</tr>
	 							<tr>
	 								<td>Composition of Natural Lands:</td>
	 								<td>{hoverInfo.hexagon.hab4}</td>
	 							</tr>
	 							<tr>
	 								<td colSpan="2">
	 									<b>Water Quality: </b>{' '}
	 								</td>
	 							</tr>
	 							<tr>
	 								<td>Impaired Watershed Area:</td>
	 								<td>{hoverInfo.hexagon.wq1}</td>
	 							</tr>
	 							<tr>
	 								<td>Stream Abundance:</td>
	 								<td>{hoverInfo.hexagon.wq2}</td>
	 							</tr>
	 							<tr>
	 								<td>Hydrologic Response to Land-use:</td>
	 								<td>{hoverInfo.hexagon.wq3}</td>
	 							</tr>
	 							<tr>
	 								<td colSpan="2">
	 									<b>LCMR:</b>{' '}
	 								</td>
	 							</tr>
	 							<tr>
	 								<td>Biodiversity Index: </td>
	 								<td>{hoverInfo.hexagon.lcmr1}</td>
	 							</tr>
	 							<tr>
	 								<td>T&E Area:</td>
	 								<td>{hoverInfo.hexagon.lcmr2}</td>
	 							</tr>
	 							<tr>
	 								<td>T&E Count:</td>
	 								<td>{hoverInfo.hexagon.lcmr3}</td>
	 							</tr>
	 							<tr>
	 								<td>Light Pollution Index:</td>
	 								<td>{hoverInfo.hexagon.lcmr4}</td>
	 							</tr>
	 							<tr>
	 								<td colSpan="2">
	 									<b>Community Resilience:</b>{' '}
	 								</td>
	 							</tr>
	 							<tr>
	 								<td>National Register of Historic Places: </td>
	 								<td>{hoverInfo.hexagon.cl1}</td>
	 							</tr>
	 							<tr>
	 								<td>National Heritage Area:</td>
	 								<td>{hoverInfo.hexagon.cl2}</td>
	 							</tr>
	 							<tr>
	 								<td>Social Vulnerability Index:</td>
	 								<td>{hoverInfo.hexagon.cl3}</td>
	 							</tr>
	 							<tr>
	 								<td>Community Threat Index:</td>
	 								<td>{hoverInfo.hexagon.cl4}</td>
	 							</tr>
	 							<tr>
	 								<td colSpan="2">
	 									<b>Economy:</b>{' '}
	 								</td>
	 							</tr>
	 							<tr>
	 								<td>Working Lands: </td>
	 								<td>{hoverInfo.hexagon.eco1}</td>
	 							</tr>
	 							<tr>
	 								<td>Commercial Fishery Index:</td>
	 								<td>{hoverInfo.hexagon.eco2}</td>
	 							</tr>
	 							<tr>
	 								<td>Recreational Fishery Index:</td>
	 								<td>{hoverInfo.hexagon.eco3}</td>
	 							</tr>
	 							<tr>
	 								<td>Access & Recreation:</td>
	 								<td>{hoverInfo.hexagon.eco4}</td>
	 							</tr>
	 						</tbody>
	 					</Table>
	 				</div>
	 			</div>
          )
        }
      </div>
    );
}

export default ControlPanel;