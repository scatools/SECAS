import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { calculateScore } from './helper/aggregateHex';

const AoiDetailTable = ({ activeTable, setActiveTable }) => {
    let aoi;
	let currentState;
    let aoiList = useSelector((state) => state.aoi);
	
	if (activeTable) {
		aoi = Object.values(aoiList).filter((aoi) => aoi.id === activeTable);
		currentState = {
			labels: ['Health', 'Function', 'Connectivity'],
			datasets: [
			    {
					label: 'Score',
					backgroundColor: 'rgba(75,192,192,1)',
					borderColor: 'rgba(0,0,0,1)',
					borderWidth: 1,
					data: [
							(calculateScore(aoi).scoreH1 + calculateScore(aoi).scoreH2 + 
							calculateScore(aoi).scoreH3 + calculateScore(aoi).scoreH4)/4,
							(calculateScore(aoi).scoreF1 + calculateScore(aoi).scoreF2)/2,
							(calculateScore(aoi).scoreC1 + calculateScore(aoi).scoreC2)/2
					]
			    }
			]
		};
	}

	return (
		<div className={activeTable ? 'AoiTableContainer active' : 'AoiTableContainer'}>
			<div
				id="dismiss"
				onClick={() => {
					setActiveTable(false);
				}}
			>
				X
			</div>
			<div className="AoiTable" style={{padding:"20px", marginTop:"50px"}}>
				{aoi && (
					<>
					<Table striped bordered size="sm" variant="dark">
						<thead>
							<tr>
								<th>Measures</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan="2">
									<b>Health: </b>{' '}
								</td>
							</tr>
							<tr>
								<td>Open Pine Site Condition:</td>
								<td>{calculateScore(aoi).scoreH1}</td>
							</tr>
							<tr>
								<td>Open Pine Species:</td>
								<td>{calculateScore(aoi).scoreH2}</td>
							</tr>
							<tr>
								<td>Toby's Fire:</td>
								<td>{calculateScore(aoi).scoreH3}</td>
							</tr>
							<tr>
								<td>Conservation Management:</td>
								<td>{calculateScore(aoi).scoreH4}</td>
							</tr>
							<tr>
								<td colSpan="2">
									<b>Function: </b>{' '}
								</td>
							</tr>
							<tr>
								<td>Forest Carbon:</td>
								<td>{calculateScore(aoi).scoreF1}</td>
							</tr>
							<tr>
								<td>Working Lands:</td>
								<td>{calculateScore(aoi).scoreF2}</td>
							</tr>
							<tr>
								<td colSpan="2">
									<b>Connectivity:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>Open Pine Landscape Condition: </td>
								<td>{calculateScore(aoi).scoreC1}</td>
							</tr>
							<tr>
								<td>TNC Resilience:</td>
								<td>{calculateScore(aoi).scoreC2}</td>
							</tr>
						</tbody>
					</Table>
					<Bar
						data={currentState}
						options={{
							title:{
								display:true,
								text:'Overall Score',
								fontSize:20
							},
							legend:{
								display:true,
								position:'right'
							}
						}}
					/>
					</>
				)}
			</div>
		</div>
	);
};

export default AoiDetailTable;
