import React, { useState } from 'react';
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { MdViewList, MdEdit, MdDelete, MdFileDownload } from 'react-icons/md';
import { delete_aoi, edit_aoi } from './action';
// import { calculateArea, aggregate, getStatus } from './helper/aggregateHex';
import axios from 'axios';

const SidebarViewDetail = ({ aoiSelected, setActiveTable, setDrawingMode, editAOI, setEditAOI, featureList, setAlerttext}) => {
	// const aoi = Object.values(useSelector((state) => state.aoi)).filter(aoi=>aoi.id===aoiSelected);
    const aoi = null;
	const dispatch = useDispatch();
	const [aoiName,setAoiName] = useState("");
	// const handleEdit = async()=>{
	// 	if(!aoiName){
	// 		setAlerttext('Name is required.');
	// 	} else {
	// 		setEditAOI(false);
	// 		setAlerttext(false);
	// 		const newList = featureList;
	// 		const data = {
	// 			type: 'MultiPolygon',
	// 			coordinates: newList.map((feature) => feature.geometry.coordinates)
	// 		};

	// 		// For development on local server
	// 		// const res = await axios.post('http://localhost:5000/data', { data });
	// 		// For production on Heroku
	// 		const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });
	// 		const planArea = calculateArea(newList);
	// 		dispatch(
	// 			edit_aoi(aoi[0].id, {
	// 			name: aoiName,
	// 			geometry: newList.length ? newList: aoi[0].geometry,
	// 			hexagons: newList.length ? res.data.data: aoi[0].hexagons ,
	// 			rawScore: newList.length ? aggregate(res.data.data,planArea): aoi[0].rawScore,
	// 			scaleScore: newList.length ? getStatus(aggregate(res.data.data,planArea)): aoi[0].scaleScore,
	// 			id: aoi[0].id})
	// 		);
	// 		setDrawingMode(false);
	// 	}
	// }

	const handleDownload = () =>{		
		var pageHTMLObject = document.getElementsByClassName("AoiTable")[0];
		var pageHTML = pageHTMLObject.outerHTML;
		var tempElement = document.createElement('a');

		tempElement.href = 'data:text/html;charset=UTF-8,' + encodeURIComponent(pageHTML);
		tempElement.target = '_blank';
		tempElement.download = 'report.html';
		tempElement.click();
	}

	return (
		<>
		{aoi && aoi.length>0 &&
		<Card>
			<Card.Header>Area of Interest Details:</Card.Header>
			<Card.Body>
				<Card.Title>{aoi[0].name}</Card.Title>
					<ul>
						<li>This area of interest has an area of {Math.round(aoi[0].rawScore.hab0*100)/100} km<sup>2</sup></li>
						<li>This area of interest contains {aoi[0].hexagons.length} hexagons</li>
					</ul>
				<Button variant="dark" 
					onClick={()=>{setActiveTable(aoiSelected)}}
				>
					<MdViewList /> &nbsp;
					View
				</Button>
				<Button variant="dark" className="ml-1"
				        onClick={()=>{
							setEditAOI(true);
							setDrawingMode(true);
							setAoiName(aoi[0].name)
						}}
				>
					<MdEdit /> &nbsp;
					Edit
				</Button>
				<Button variant="dark" className="ml-1" 
				    onClick={()=>{
						setActiveTable(false);
						dispatch(delete_aoi(aoi[0].id))
					}}
				>
					<MdDelete /> &nbsp;
					Delete
				</Button>
				<Button variant="dark" className="ml-1" 
				    onClick={handleDownload}
				>
					<MdFileDownload /> &nbsp;
					Download Report
				</Button>
				{editAOI && 
				(
				<>
				<hr/>
				<InputGroup className="mb-3" style={{ width: '60%' }}>
					<InputGroup.Prepend>
						<InputGroup.Text id="basic-addon1">Plan Name:</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl name="planName" value={aoiName} onChange={(e)=>{setAoiName(e.target.value)}} placeholder="Name area of interest here..."/>
				</InputGroup>
				<Button variant="dark"
				        // onClick={handleEdit}
				>
					Finalize Changes
				</Button>
				</>
				)
				}								
			</Card.Body>
		</Card>
		}
		</>
		
	);
};

export default SidebarViewDetail;