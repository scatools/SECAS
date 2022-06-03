import React, { useState } from 'react';
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { MdViewList, MdEdit, MdDelete } from 'react-icons/md';
import { HiDocumentReport } from 'react-icons/hi';
import { GiHexes } from 'react-icons/gi';
import { delete_aoi, edit_aoi } from './action';
import { normalization } from './helper/aggregateHex';
import axios from 'axios';
import area from "@turf/area";


const SidebarViewDetail = ({ aoiSelected, setActiveTable, setDrawingMode, editAOI, setEditAOI, featureList, setAlerttext, hexGrid, setHexGrid}) => {
	const aoi = Object.values(useSelector((state) => state.aoi)).filter(aoi=>aoi.id===aoiSelected);
	const dispatch = useDispatch();
	const [aoiName,setAoiName] = useState("");

	const calculateArea = (input) => {
		let totalArea = 0;
		if(input.length > 0){
		  totalArea= input.reduce((a,b)=>{return a+area(b)},0)/1000000
		}
		return totalArea;
	}

	const calculateScore = (aoiList) => {
		const hexScoreList = aoiList[0].hexagons.map((hex) => {
			let scoreList = normalization(hex);
			let scoreArray = Object.values(scoreList);
			let averageScore = scoreArray.reduce((a, b) => a + b, 0)/scoreArray.length;
			return averageScore;
		})
		const aoiScore = (hexScoreList.reduce((a, b) => a + b, 0)/hexScoreList.length).toFixed(2);
		return aoiScore;
	}

	const handleEdit = async()=>{
		if(!aoiName){
			setAlerttext('Name is required.');
		} else {
			setEditAOI(false);
			setAlerttext(false);
			const newList = featureList;
			const data = {
				type: 'MultiPolygon',
				coordinates: newList.map((feature) => feature.geometry.coordinates)
			};

			// For development on local server
			// const res = await axios.post('http://localhost:5000/data', { data });
			// For production on Heroku
			// const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });
			const planArea = calculateArea(newList);
			dispatch(
				edit_aoi(aoi[0].id, {
				name: aoiName,
				area: planArea,
				// geometry: newList.length ? newList: aoi[0].geometry,
				// hexagons: newList.length ? res.data.data: aoi[0].hexagons ,
				// rawScore: newList.length ? aggregate(res.data.data,planArea): aoi[0].rawScore,
				// scaleScore: newList.length ? getStatus(aggregate(res.data.data,planArea)): aoi[0].scaleScore,
				id: aoi[0].id})
			);
			setDrawingMode(false);
		}
	}

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
						<li>This area of interest has an area of {Math.round(aoi[0].area*100)/100} km<sup>2</sup></li>
						<li>This area of interest contains {aoi[0].hexagons.length} hexagons</li>
						<li>This area has an overall HFC Score of <b>{calculateScore(aoi)}</b> under current condition</li>
					</ul>
				<Button
					variant="dark"
					className="ml-2 mb-2"
					onClick={()=>{setActiveTable(aoiSelected)}}
				>
					<MdViewList /> &nbsp;
					View
				</Button>
				<Button
					variant="dark"
					className="ml-2 mb-2"
				  onClick={()=>{
						setEditAOI(true);
						setDrawingMode(true);
						setAoiName(aoi[0].name)
					}}
				>
					<MdEdit /> &nbsp;
					Edit
				</Button>
				<Button
					variant="dark"
					className="ml-2 mb-2" 
				  onClick={()=>{
						setActiveTable(false);
						dispatch(delete_aoi(aoi[0].id))
					}}
				>
					<MdDelete /> &nbsp;
					Delete
				</Button>
				<Button
					variant="dark"
					className="ml-2 mb-2" 
				  onClick={handleDownload}
				>
					<HiDocumentReport /> &nbsp;
					Report
				</Button>
				<Button
					variant="dark"
					className="ml-2 mb-2" 
				  onClick={() => {setHexGrid(!hexGrid)}}
				>
					<GiHexes /> &nbsp;
					{hexGrid ? "Hide Hexagon Grid" : "Show Hexagon Grid"}
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