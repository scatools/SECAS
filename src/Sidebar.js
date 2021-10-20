import React, { useState, useCallback } from 'react';
import { Accordion, Alert, Button, ButtonGroup, Card, Container, Form, FormControl, InputGroup, Modal, Table, ToggleButton } from 'react-bootstrap';
import './main.css';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { changeMeasures, changeMeasuresWeight, changeGoalWeights } from './action';
import { GoInfo } from 'react-icons/go';
import ReactTooltip from "react-tooltip";
import SidebarMode from './SidebarMode';
import SidebarViewGroup from './SidebarViewGroup';
import SidebarViewDetail from './SidebarViewDetail';
// import SidebarDismiss from './SidebarDismiss';
// import SidebarAssemble from './SidebarAssemble';
import axios from 'axios';
// import { calculateArea, aggregate, getStatus } from './helper/aggregateHex';
import { v4 as uuid } from 'uuid';
import { input_aoi } from './action';
import Dropzone from 'react-dropzone';
// import shp from 'shpjs';

const Sidebar = ({
	activeSidebar,
	setActiveSidebar,
	setActiveTable,
	setDrawingMode,
	featureList,
	aoiSelected,
	setAoiSelected,
	editAOI,
	setEditAOI,
	setViewport,
	hucBoundary,
	setHucBoundary,
  	hucIDSelected,
  	setHucIDSelected
	}) =>{
	
	const [ show, setShow ] = useState(false);	
	const [ mode, setMode ] = useState('visualize');
	const [ inputMode, setInputMode ] = useState('draw');
	const [ selectMode, setSelectMode ] = useState('health');
	const [ drawData, setDrawData ] = useState('');
	const [ alerttext, setAlerttext ] = useState(false);
	const [ retrievingOptions, setRetrievingOptions ] = useState('hucBoundary');
	const [ hucList, setHucList ] = useState([]);
	const [ hucNameList, setHucNameList ] = useState([]);
	const [ hucIDList, setHucIDList ] = useState([]);
	const [ hucNameSelected, setHucNameSelected ]= useState([]);
	// const [ hucIDSelected, setHucIDSelected ]= useState([]);
	const weights =  useSelector(state => state.weights);
	const dispatch = useDispatch();
	
	const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

	const handleChange = (value, name, label, type) => {	
		dispatch(changeMeasuresWeight(value,name, label, type))
	};

	const handleWeights = (value, goal) =>{
		const newValue = Number(value)> 100 ? 100 : Number(value);
		dispatch(changeGoalWeights(newValue, goal))
	}
	
	// const handleSubmit = async () => {
	// 	if (!drawData) {
	// 		setAlerttext('A name for this area of interest is required.');
	// 	} else if (featureList.length === 0) {
	// 		setAlerttext('At least one polygon is required.');
	// 	} else {
	// 		setAlerttext(false);
	// 		const newList = featureList;
	// 		// console.log(newList);
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
	// 			input_aoi({
	// 				name: drawData,
	// 				geometry: newList,
	// 				hexagons: res.data.data,
	// 				rawScore: aggregate(res.data.data, planArea),
	// 				scaleScore: getStatus(aggregate(res.data.data, planArea)),
	// 				id: uuid()
	// 			})
	// 		);
	// 		setDrawingMode(false);
	// 		setMode("view");
	// 	}
	// };

	// const handleNameChange = (e) => {
	// 	setDrawData(e.target.value);
	// };

	// const onDrop = useCallback(async (acceptedFiles) => {

	// 	const handleSubmitShapefile = async (geometry, geometryType, aoiNumber) => {
	// 		setAlerttext(false);
	// 		// Coordinates must be a single array for the area to be correctly calculated
	// 		const newList = geometry.coordinates.map((coordinates)=>({
	// 			type:"Feature",
	// 			properties: { },
	// 			geometry: {
	// 				type: geometryType,
	// 				coordinates: [coordinates],
	// 			}
	// 		}))
	// 		// console.log(newList);
	// 		const data = geometry;
			
	// 		// For development on local server
	// 		// const res = await axios.post('http://localhost:5000/data', { data });
	// 		// For production on Heroku
	// 		const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });
	// 		const planArea = calculateArea(newList);
	// 		dispatch(
	// 			input_aoi({
	// 				name: 'Area of Interest ' + aoiNumber,
	// 				geometry: newList,
	// 				hexagons: res.data.data,
	// 				rawScore: aggregate(res.data.data, planArea),
	// 				scaleScore: getStatus(aggregate(res.data.data, planArea)),
	// 				id: uuid()
	// 			})
	// 		);
	// 		setMode("view");
	// 	};

	// 	for(let file of acceptedFiles){
	// 		const reader = new FileReader();
	// 		reader.onload = async () => {
	// 			const result = await shp(reader.result);
	// 			if (result) {
	// 				// console.log(result.features);
	// 				// Features are stored as [0:{}, 1:{}, 2:{}, ...]
	// 				for (var num in result.features) {
	// 					// Add geometry type as a parameter to cater to both Polygon and MultiPolygon 
	// 					handleSubmitShapefile(result.features[num].geometry, result.features[num].geometry.type, parseInt(num)+1);
	// 				}
	// 			}
	// 		}
	// 		reader.readAsArrayBuffer(file);
	// 	}
		
	// }, [dispatch]);

	// const onLoad = () => {
	// 	// To successfully fetch the zip file, it needs to be in the /public folder
	// 	fetch('HUC12_SCA.zip').then(res => res.arrayBuffer()).then(arrayBuffer => {
	// 		shp(arrayBuffer).then(function(geojson){
	// 			console.log(geojson);
	// 			setHucList(geojson.features);
	// 			setHucNameList(geojson.features.map((feature) => ({
	// 				value: feature.properties.NAME, 
	// 				label: feature.properties.NAME 
	// 			})))
	// 			setHucIDList(geojson.features.map((feature) => ({ 
	// 				value: feature.properties.HUC12, 
	// 				label: feature.properties.HUC12 
	// 			})))
	// 		});
	// 	});
	// };

	// const handleSubmitBoundaryAsSingle = async () => {
	// 	if (hucBoundary) {
	// 		setHucBoundary(false);
	// 	} else if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
	// 		setAlerttext('At least one of the existing boundaries is required.');
	// 	} else {
	// 		setAlerttext(false);
	// 		const newList = hucList.filter((feature) => hucNameSelected.map((hucName) => hucName.value).includes(feature.properties.NAME) 
	// 													|| hucIDSelected.map((hucID) => hucID.value).includes(feature.properties.HUC12));
	// 		// console.log(newList);
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
	// 			input_aoi({
	// 				name: 'Watershed Area',
	// 				geometry: newList,
	// 				hexagons: res.data.data,
	// 				rawScore: aggregate(res.data.data, planArea),
	// 				scaleScore: getStatus(aggregate(res.data.data, planArea)),
	// 				id: uuid()
	// 			})
	// 		);
	// 		setMode("view");
	// 	}
	// };

	// const handleSubmitBoundaryAsMultiple = () => {
	// 	if (hucBoundary) {
	// 		setHucBoundary(false);
	// 	} else if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
	// 		setAlerttext('At least one of the existing boundaries is required.');
	// 	} else {
	// 		setAlerttext(false);
	// 		const newList = hucList.filter((feature) => hucNameSelected.map((hucName) => hucName.value).includes(feature.properties.NAME) 
	// 													|| hucIDSelected.map((hucID) => hucID.value).includes(feature.properties.HUC12));
	// 		// console.log(newList);
	// 		newList.forEach(async feature => {
	// 			const data = feature.geometry;
	// 			// For development on local server
	// 			// const res = await axios.post('http://localhost:5000/data', { data });
	// 			// For production on Heroku
	// 			const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });				
	// 			const planArea = calculateArea(newList);
	// 			// Geometry needs to be a list
	// 			dispatch(
	// 				input_aoi({
	// 					name: 'Watershed Area',
	// 					geometry: [feature],
	// 					hexagons: res.data.data,
	// 					rawScore: aggregate(res.data.data, planArea),
	// 					scaleScore: getStatus(aggregate(res.data.data, planArea)),
	// 					id: uuid()
	// 				})
	// 			);
	// 		});
	// 		setMode("view");
	// 	}
	// };

	const dropdownStyles = {
		option: (provided, state) => ({
			...provided,
			color: state.isSelected ? 'white' : 'black',
		}),
		singleValue: (provided, state) => {
			const opacity = state.isDisabled ? 0.5 : 1;		
			return { ...provided, opacity };
		}
	};

    return (
        <div id="sidebar" className={activeSidebar ? 'active' : ''}>
            	<div
					id="dismiss"
					onClick={() => {
						setActiveSidebar(false);
					}}
				>
				X
				</div>

				<div className="ControlWrapper">
					<p>Sample Area</p>
					<hr />
					<SidebarMode mode={mode} setMode={setMode} />
					<hr />
					{mode === 'visualize' && (
						<Accordion defaultActiveKey="0">
							<Card className="my-2">
								<Accordion.Toggle as={Card.Header} eventKey="2">
									Select Habitat Type:
								</Accordion.Toggle>
								<Accordion.Collapse eventKey="2">
									<Card.Body>
										<div>
											<span> 
											<em>Please select one habitat type from the list and visualize. </em> 
											</span>
											<br></br>
											<br></br>
											<span>Habitat Type:</span>
											<br></br>
											<Select
												id="selectHabitatType"
												styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
												menuPortalTarget={document.body}
												options={[
													// { value: 'hab1', label: 'Open Pine Woodland BDH' },
													{ value: 'hab2', label: 'Forested Wetland' },
													{ value: 'hab3', label: 'Upland Hardwoods - Forest' },
													{ value: 'hab4', label: 'Upland Hardwoods - Woodland' },
													{ value: 'hab5', label: 'Mixed Forest' },
													{ value: 'hab6', label: 'Grass' },
													{ value: 'hab7', label: 'Tidal Marsh' },
													// { value: 'hab8', label: 'Big Rivers' },
													// { value: 'hab9', label: 'Streams and Rivers' }
												]}
												isMulti
												isClearable={false}
												placeholder="Select Habitat..."
												name="colors"
												value={weights.hab.selected}
												onChange={(selectedOption) => {
													let state;
													if (selectedOption) {
														state = selectedOption.map((selected) => ({
															...selected,
															utility: selected['utility'] || '1',
															// weight: selected['weight'] || 'medium'
														}));
													}else{
														state = null;
														handleWeights(0,'hab');
													}
													dispatch(changeMeasures('hab', state))											
												}}    
												className="basic-multi-select"
												classNamePrefix="select"
											/>
										</div>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					)}

					{mode === 'add' && (
						<div>
							<Container className="d-flex">
								<ButtonGroup toggle className="m-auto">
									<ToggleButton
										type="radio"
										variant="outline-secondary"
										name="draw"
										value="draw"
										checked={inputMode === 'draw'}
										onChange={(e) => setInputMode(e.currentTarget.value)}
									>
										by Drawing
									</ToggleButton>
									<ToggleButton
										type="radio"
										variant="outline-secondary"
										name="shapefile"
										value="shapefile"
										checked={inputMode === 'shapefile'}
										onChange={(e) => setInputMode(e.currentTarget.value)}
									>
										by Zipped Shapefile
									</ToggleButton>
									<ToggleButton
										type="radio"
										variant="outline-secondary"
										name="boundary"
										value="boundary"
										checked={inputMode === 'boundary'}
										onChange={(e) => {
											setInputMode(e.currentTarget.value);
											// onLoad();
										}}
									>
										by Existing Boundary
									</ToggleButton>
								</ButtonGroup>
							</Container>						
							<hr />

							{inputMode === 'draw' && (
								<Container className="m-auto" style={{ width: '80%' }}>
									<InputGroup>
										<InputGroup.Prepend>
											<InputGroup.Text id="basic-addon1">Plan Name:</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl
											name="planName"
											value={drawData}
											// onChange={handleNameChange}
											placeholder="Name area of interest here..."
										/>
									</InputGroup>
									<hr />
									<Button
										variant="dark"
										style={{float: "left"}}
										onClick={() => {
											setDrawingMode(true);
											setAoiSelected(false);
										}}
									>
										Add a New Shape
									</Button>
									<Button variant="dark" style={{float: "right"}} 
										// onClick={handleSubmit}
									>
										Finalize Input
									</Button>
								</Container>
							)}

							{inputMode === 'shapefile' && (
								<Container className="m-auto file-drop">
									<Dropzone 
										// onDrop={onDrop}
										accept=".zip"
									>
										{({ getRootProps, getInputProps }) => (
											<div {...getRootProps()}>
												<input {...getInputProps()} />
												Click me to upload a file!
											</div>
										)}
									</Dropzone>
								</Container>
							)}

							{inputMode === 'boundary' && (
								<Container className="m-auto" style={{ width: '80%' }}>
									<div>
										<p style={{ fontSize: '110%' }}>Geographic Scale</p>
										<Select 
											placeholder="Select a scale"
											options = {[
												{ value: 'watershed', label: 'Watershed Coastal Zone' }
											]}
											theme={(theme) => ({
												...theme,
												colors: {
												...theme.colors,
													primary: 'gray',
													primary25: 'lightgray'
												},
											})}
											styles={dropdownStyles}
										/>
									</div>
									<br></br>
									<div>
										<p style={{ fontSize: '110%' }}>Retrieving Options</p>
										<Select 
											placeholder="Select an option"
											options = {[
												{ value: 'hucName', label: 'by HUC 12 Watershed Name' },
												{ value: 'hucID', label: 'by HUC 12 Watershed ID' },
												{ value: 'hucBoundary', label: 'by HUC 12 Watershed Boundary' }
											]}
											theme={(theme) => ({
												...theme,
												colors: {
												...theme.colors,
													primary: 'gray',
													primary25: 'lightgray'
												},
											})}
											styles={dropdownStyles}
											onChange={(e) => {
												setRetrievingOptions(e.value);
												if (e.value === 'hucBoundary') {
													setHucBoundary(true);
												} else {
													setHucBoundary(false);
												};
											}}
										/>
									</div>
									<br></br>
									{retrievingOptions === 'hucName' && (
										<div>
											<p style={{ fontSize: '110%' }}>Watershed Selection</p>
											<Select 
												// styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
												menuPortalTarget={document.body}										
												options = {hucNameList}
												isMulti
												isClearable={true}
												isSearchable={true}
												placeholder="Select watersheds from the list"
												theme={(theme) => ({
													...theme,
													colors: {
													...theme.colors,
														primary: 'gray',
														primary25: 'lightgray'
													},
												})}
												styles={dropdownStyles}
												value={hucNameSelected}
												onChange={(selectedOption) => {
													setHucNameSelected(selectedOption)
												}}
											/>
										</div>
									)}
									{retrievingOptions === 'hucID' && (
										<div>
											<p style={{ fontSize: '110%' }}>Watershed Selection</p>
											<Select 
												// styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
												menuPortalTarget={document.body}										
												options = {hucIDList}
												isMulti
												isClearable={true}
												isSearchable={true}
												placeholder="Select watersheds from the list"
												theme={(theme) => ({
													...theme,
													colors: {
													...theme.colors,
														primary: 'gray',
														primary25: 'lightgray'
													},
												})}
												styles={dropdownStyles}
												value={hucIDSelected}
												onChange={(selectedOption) => {
													setHucIDSelected(selectedOption)
												}}
											/>
										</div>
									)}
									<br />
									<Button variant="dark" style={{float: "left"}} 
										// onClick={handleSubmitBoundaryAsSingle}
									>
										Add as Single AOI
									</Button>
									<Button variant="dark" style={{float: "right"}} 
										// onClick={handleSubmitBoundaryAsMultiple}
									>
										Add as Multiple AOIs
									</Button>
								</Container>
							)}

							{alerttext && (
								<Alert
									className="mt-4"
									variant="light"
									onClose={() => setAlerttext(false)}
									dismissible
								>
									<p style={{ color: 'red' }}>{alerttext}</p>
								</Alert>
							)}
						</div>
					)}

					{mode === 'view' && (
						<Container>
							<SidebarViewGroup aoiSelected={aoiSelected} setAoiSelected={setAoiSelected} setViewport={setViewport}/>
							<SidebarViewDetail
								aoiSelected={aoiSelected}
								setActiveTable={setActiveTable}
								setDrawingMode={setDrawingMode}
								editAOI={editAOI}
								setEditAOI={setEditAOI}
								featureList={featureList}
								setAlerttext={setAlerttext}
							/>
						</Container>
					)}

					{mode === 'assess' && (
						<Accordion defaultActiveKey="0">
							<Card className="my-2">
								<Accordion.Toggle as={Card.Header} eventKey="2">
									Select Attribute:
								</Accordion.Toggle>
								<Accordion.Collapse eventKey="2">
									<Card.Body>
										<div>
											<span> 
											<em>Please select one attribute from the list and click next. </em> 
											</span>
											<br></br>
											<br></br>
											<span>Attribute:</span>
											<br></br>
											<Select
												id="selectAttribute"
												styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
												menuPortalTarget={document.body}
												options={[
													{ value: 'health', label: 'Health' },
													{ value: 'function', label: 'Function' },
													{ value: 'connectivity', label: 'Connectivity' },
												]}
												isClearable={false}
												placeholder="Select Attribute..."
												name="colors"
												onChange={(e) => {
													setSelectMode(e.value);
												}}
											/>
										</div>
									</Card.Body>
								</Accordion.Collapse>
								
								<Accordion.Toggle as={Card.Header} eventKey="2">
									Select Indicator:
								</Accordion.Toggle>
								<Accordion.Collapse eventKey="2">
									<Card.Body>
										<div>
											<span> 
											<em>Please select one indicator from the list and click the blue button to display the visualization. </em> 
											</span>
											<br></br>
											<br></br>
											<span>Indicator:</span>
											<br></br>
											{selectMode === 'health' && (
												<Select
													id="selectIndicator"
													styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
													menuPortalTarget={document.body}
													options={[
														{ value: 'hea1', label: 'Site Intergrity' },
														{ value: 'hea2', label: 'Biodiversity' },
														{ value: 'hea3', label: 'Disturbance' },
													]}
													isClearable={false}
													placeholder="Select Indicator..."
													name="attribute"
												/>
											)}

											{selectMode === 'function' && (
												<Select
													id="selectIndicator"
													styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
													menuPortalTarget={document.body}
													options={[
														{ value: 'fun1', label: 'Ecosystem Services' }
													]}
													isClearable={false}
													placeholder="Select Indicator..."
													name="attribute"
												/>
											)}

											{selectMode === 'connectivity' && (
												<Select
													id="selectIndicator"
													styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
													menuPortalTarget={document.body}
													options={[
														{ value: 'con1', label: 'Connectedness / Fragmentation' },
														{ value: 'con2', label: 'Permeability of Hubs' }
													]}
													isClearable={false}
													placeholder="Select Indicator..."
													name="attribute"
												/>
											)}										
										
											{weights.hab.selected &&
												weights.hab.selected.map((measure) => (
													<div className="m-2" key={measure.value}>
														<span style={{ display: 'block' }} className="my-1">
															{measure.label}
														</span>
														<ButtonGroup toggle className="ml-2">
															<ToggleButton
																id="lowButton"
																type="radio"
																variant="outline-secondary"
																name="weight"
																value="low"
																checked={measure.weight === 'low'}
																onChange={(e) =>
																	handleChange(
																		e.currentTarget.value,
																		e.currentTarget.name,
																		measure.value,
																		'hab'
																	)}
															>
																Proportion of Low ROI [0]
															</ToggleButton>
															<ToggleButton
																id="mediumButton"
																type="radio"
																variant="outline-secondary"
																name="weight"
																value="medium"
																checked={measure.weight === 'medium'}
																onChange={(e) =>
																	handleChange(
																		e.currentTarget.value,
																		e.currentTarget.name,
																		measure.value,
																		'hab'
																	)}
															>
																Proportion of Restore [1]
															</ToggleButton>
															<ToggleButton
																id="highButton"
																type="radio"
																variant="outline-secondary"
																name="weight"
																value="high"
																checked={measure.weight === 'high'}
																onChange={(e) =>
																	handleChange(
																		e.currentTarget.value,
																		e.currentTarget.name,
																		measure.value,
																		'hab'
																	)}
															>
																Proportion of Enhance [2]
															</ToggleButton>
															<ToggleButton
																id="maxButton"
																type="radio"
																variant="outline-secondary"
																name="weight"
																value="max"
																checked={measure.weight === 'max'}
																onChange={(e) =>
																	handleChange(
																		e.currentTarget.value,
																		e.currentTarget.name,
																		measure.value,
																		'hab'
																	)}
															>
																Proportion of Maintain [3]
															</ToggleButton>
														</ButtonGroup>
													</div>
											))}
										</div>
										<br />
										<Button id="avmButton">
											Show Map of Area Weighted Mean
										</Button>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					)}
				</div>
        </div>
    )
}

export default Sidebar;