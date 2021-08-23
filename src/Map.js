import React, { useRef, useState } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import { dataLayer, dataLayerHightLight } from './map-style';
import ControlPanel from './ControlPanel';
import Legend from './Legend';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA';

const Map = ({ 
	//weightsDone, 
	data }) => {
	const map = useRef(null);
	const [ viewport, setViewport ] = useState({
		latitude: 35,
		longitude: -95,
		zoom: 5,
		bearing: 0,
		pitch: 0
	});
	const [fillColor, setFillColor] = useState({
		property: 'FWAWMN',
		stops: [
		  [1, '#ACFFAD'],
		  [2, '#71EFA3'],
		  [3, '#50CB93'],
		  [4, '#54436B'],
		]
	  });
	const [ filter, setFilter ] = useState([ 'in', 'OBJECTID', '' ]);
	const [ hoverInfo, setHoverInfo ] = useState(null);
	var avmButton = document.getElementById("avmButton");
	var selectHabitatType = document.getElementById("selectHabitatType");
	var selectedOption = document.getElementsByClassName("select__multi-value__label");

	function averageWeightedMean() {
		if (selectedOption.length > 0) {
			let selectedLabel = selectedOption[0].innerText;
			if (selectedLabel == 'Open Pine Woodland BDH') {

			}
			else if (selectedLabel == 'Forested Wetland BDH') {
				setFillColor({
					property: 'FWAWMN',
					stops: [
					[1, '#ACFFAD'],
					[2, '#71EFA3'],
					[3, '#50CB93'],
					[4, '#54436B'],
					]
				});
				if (avmButton) {
					avmButton.addEventListener("click", averageWeightedMean, false);
				}
			}
			else if (selectedLabel == 'Upland Hardwoods - Forest') {
				setFillColor({
					property: 'UHF_AWMN',
					stops: [
					[1, '#CDD193'],
					[2, '#BACC81'],
					[3, '#478C5C'],
					[4, '#013A20'],
					]
				})
			}
			else if (selectedLabel == 'Upland Hardwoods - Woodland') {
				setFillColor({
					property: 'UHW_AWMN',
					stops: [
					[1, '#E4D4C8'],
					[2, '#D0B49F'],
					[3, '#A47551'],
					[4, '#523A28'],
					]
				})
			}
			else if (selectedLabel == 'Tidal Marsh BDH') {
				setFillColor({
					property: 'TM_AWMN',
					stops: [
					[1, '#D4F1F4'],
					[2, '#75E6DA'],
					[3, '#189AB4'],
					[4, '#05445E'],
					]
				})
			}
			else if (selectedLabel == 'Big Rivers') {

			}
			else if (selectedLabel == 'Streams and Rivers') {

			}
		}
	}

	if (avmButton) {
		avmButton.addEventListener("click", averageWeightedMean, false);
	}

	var lowButton = document.getElementById("lowButton");
	var mediumButton = document.getElementById("mediumButton");
	var highButton = document.getElementById("highButton");
	var maxButton = document.getElementById("maxButton");
	
	function modifySelection1() {
		// console.log(selectedOption);

		let toggleValue = 1
		// if (toggleLabel == "low") {
		// 	toggleValue = 1
		// }
		// else if (toggleLabel == "medium") {
		// 	toggleValue = 2
		// }
		// else if (toggleLabel == "high") {
		// 	toggleValue = 3
		// }
		// else if (toggleLabel == "max") {
		// 	toggleValue = 4
		// }
		
		if (selectedOption.length > 0) {
			let selectedLabel = selectedOption[0].innerText;
			// console.log(selectedLabel);
			if (selectedLabel == 'Open Pine Woodland BDH') {

			}
			else if (selectedLabel == 'Forested Wetland BDH') {
				setFillColor({
					// property: 'FWV2PROP',
					property: 'FWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#ACFFAD'],
					  [0.50, '#71EFA3'],
					  [0.75, '#50CB93'],
					  [1.00, '#54436B'],
					]
				});
			}
			else if (selectedLabel == 'Upland Hardwoods - Forest') {
				setFillColor({
					// property: 'UHFV2PROP',
					property: 'UHFV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#CDD193'],
					  [0.50, '#BACC81'],
					  [0.75, '#478C5C'],
					  [1.00, '#013A20'],
					]
				})
			}
			else if (selectedLabel == 'Upland Hardwoods - Woodland') {
				setFillColor({
					// property: 'UHWV2PROP',
					property: 'UHWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#E4D4C8'],
					  [0.50, '#D0B49F'],
					  [0.75, '#A47551'],
					  [1.00, '#523A28'],
					]
				})
			}
			else if (selectedLabel == 'Tidal Marsh BDH') {
				setFillColor({
					// property: 'TMV2PROP',
					property: 'TMV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#D4F1F4'],
					  [0.50, '#75E6DA'],
					  [0.75, '#189AB4'],
					  [1.00, '#05445E'],
					]
				})
			}
			else if (selectedLabel == 'Big Rivers') {

			}
			else if (selectedLabel == 'Streams and Rivers') {

			}
			
		}
	};

	function modifySelection2() {
		// console.log(selectedOption);
		let toggleValue = 2

		if (selectedOption.length > 0) {
			let selectedLabel = selectedOption[0].innerText;
			// console.log(selectedLabel);
			if (selectedLabel == 'Open Pine Woodland BDH') {

			}
			else if (selectedLabel == 'Forested Wetland BDH') {
				setFillColor({
					// property: 'FWV2PROP',
					property: 'FWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#ACFFAD'],
					  [0.50, '#71EFA3'],
					  [0.75, '#50CB93'],
					  [1.00, '#54436B'],
					]
				});
			}
			else if (selectedLabel == 'Upland Hardwoods - Forest') {
				setFillColor({
					// property: 'UHFV2PROP',
					property: 'UHFV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#CDD193'],
					  [0.50, '#BACC81'],
					  [0.75, '#478C5C'],
					  [1.00, '#013A20'],
					]
				})
			}
			else if (selectedLabel == 'Upland Hardwoods - Woodland') {
				setFillColor({
					// property: 'UHWV2PROP',
					property: 'UHWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#E4D4C8'],
					  [0.50, '#D0B49F'],
					  [0.75, '#A47551'],
					  [1.00, '#523A28'],
					]
				})
			}
			else if (selectedLabel == 'Tidal Marsh BDH') {
				setFillColor({
					// property: 'TMV2PROP',
					property: 'TMV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#D4F1F4'],
					  [0.50, '#75E6DA'],
					  [0.75, '#189AB4'],
					  [1.00, '#05445E'],
					]
				})
			}
			else if (selectedLabel == 'Big Rivers') {

			}
			else if (selectedLabel == 'Streams and Rivers') {

			}
			
		}
	};

	function modifySelection3() {
		// console.log(selectedOption);
		let toggleValue = 3

		if (selectedOption.length > 0) {
			let selectedLabel = selectedOption[0].innerText;
			// console.log(selectedLabel);
			if (selectedLabel == 'Open Pine Woodland BDH') {

			}
			else if (selectedLabel == 'Forested Wetland BDH') {
				setFillColor({
					// property: 'FWV2PROP',
					property: 'FWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#ACFFAD'],
					  [0.50, '#71EFA3'],
					  [0.75, '#50CB93'],
					  [1.00, '#54436B'],
					]
				});
			}
			else if (selectedLabel == 'Upland Hardwoods - Forest') {
				setFillColor({
					// property: 'UHFV2PROP',
					property: 'UHFV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#CDD193'],
					  [0.50, '#BACC81'],
					  [0.75, '#478C5C'],
					  [1.00, '#013A20'],
					]
				})
			}
			else if (selectedLabel == 'Upland Hardwoods - Woodland') {
				setFillColor({
					// property: 'UHWV2PROP',
					property: 'UHWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#E4D4C8'],
					  [0.50, '#D0B49F'],
					  [0.75, '#A47551'],
					  [1.00, '#523A28'],
					]
				})
			}
			else if (selectedLabel == 'Tidal Marsh BDH') {
				setFillColor({
					// property: 'TMV2PROP',
					property: 'TMV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#D4F1F4'],
					  [0.50, '#75E6DA'],
					  [0.75, '#189AB4'],
					  [1.00, '#05445E'],
					]
				})
			}
			else if (selectedLabel == 'Big Rivers') {

			}
			else if (selectedLabel == 'Streams and Rivers') {

			}
			
		}
	};

	function modifySelection4() {
		// console.log(selectedOption);
		let toggleValue = 4

		if (selectedOption.length > 0) {
			let selectedLabel = selectedOption[0].innerText;
			// console.log(selectedLabel);
			if (selectedLabel == 'Open Pine Woodland BDH') {

			}
			else if (selectedLabel == 'Forested Wetland BDH') {
				setFillColor({
					// property: 'FWV2PROP',
					property: 'FWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#ACFFAD'],
					  [0.50, '#71EFA3'],
					  [0.75, '#50CB93'],
					  [1.00, '#54436B'],
					]
				});
			}
			else if (selectedLabel == 'Upland Hardwoods - Forest') {
				setFillColor({
					// property: 'UHFV2PROP',
					property: 'UHFV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#CDD193'],
					  [0.50, '#BACC81'],
					  [0.75, '#478C5C'],
					  [1.00, '#013A20'],
					]
				})
			}
			else if (selectedLabel == 'Upland Hardwoods - Woodland') {
				setFillColor({
					// property: 'UHWV2PROP',
					property: 'UHWV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#E4D4C8'],
					  [0.50, '#D0B49F'],
					  [0.75, '#A47551'],
					  [1.00, '#523A28'],
					]
				})
			}
			else if (selectedLabel == 'Tidal Marsh BDH') {
				setFillColor({
					// property: 'TMV2PROP',
					property: 'TMV'+toggleValue+'PROP',
					stops: [
					  [0.25, '#D4F1F4'],
					  [0.50, '#75E6DA'],
					  [0.75, '#189AB4'],
					  [1.00, '#05445E'],
					]
				})
			}
			else if (selectedLabel == 'Big Rivers') {

			}
			else if (selectedLabel == 'Streams and Rivers') {

			}
			
		}
	};

	// This won't work
	// Return: Too many re-renders. React limits the number of renders to prevent an infinite loop
	
	// if (selectHabitatType) {
	// 	selectHabitatType.addEventListener("click", modifySelection, false);
	// }

	// if (lowButton) {
	// 	lowButton.addEventListener("click", modifySelection("low"), false);
	// }
	// if (mediumButton) {
	// 	mediumButton.addEventListener("click", modifySelection("medium"), false);
	// }
	// if (highButton) {
	// 	highButton.addEventListener("click", modifySelection("high"), false);
	// }
	// if (maxButton) {
	// 	maxButton.addEventListener("click", modifySelection("max"), false);
	// }

	if (lowButton) {
		lowButton.addEventListener("click", modifySelection1, false);
	}
	if (mediumButton) {
		mediumButton.addEventListener("click", modifySelection2, false);
	}
	if (highButton) {
		highButton.addEventListener("click", modifySelection3, false);
	}
	if (maxButton) {
		maxButton.addEventListener("click", modifySelection4, false);
	}
	
	const onHover = (e) => {
		let objectId = '';
		let hoveredInfo = null;
		if (e.features) {
			
				const hexagonHovered = e.features[0];
				if (hexagonHovered) {
					hoveredInfo = {
						hexagon: hexagonHovered.properties
					};
					objectId = hexagonHovered.properties.OBJECTID;
				}
				
		}
		setHoverInfo(hoveredInfo);
		setFilter([ 'in', 'OBJECTID', objectId ? objectId:"" ]);
	};

	const onViewStateChange = (e) => {
		// console.log(e);
		let windowContent = document.getElementById("floatingWindow");
		// let popupWindow = document.getElementsByClassName("map.tooltip");
		windowContent.style.display = 'block';
		// console.log(popupWindow);
		if (e.viewState.zoom >= 10) {
			windowContent.innerHTML = "<p>Click to explore the details of a single hexagonal area.</p>"
									+"<p>Current zoom level :"
									+e.viewState.zoom.toFixed(1)+"</p>"
		}
		else {
			windowContent.innerHTML = "<p>Please zoom in to level 10 to explore the details of a single hexagonal area.</p>"
									+"<p>Current zoom level :"
									+e.viewState.zoom.toFixed(1)+"</p>"
		}
	}

	return (
		<MapGL
			{...viewport}
			style={{ position: 'fixed' }}
			width="100vw"
			height="100vh"
			mapStyle="mapbox://styles/mapbox/dark-v9"
			// onViewportChange={(nextViewport) => setViewport(nextViewport)}
			onViewportChange={setViewport}
			onViewStateChange={onViewStateChange}
			mapboxApiAccessToken={MAPBOX_TOKEN}
			onClick={onHover}
			ref={map}
		>
			{
			// weightsDone && 
			(
				<>
				<Source type="vector" url="mapbox://chuck0520.6jl5wnun" maxzoom={22} minzoom={0}>
					<Layer
						{...dataLayer}
						id = "SECASlayer"
						value = "SECASlayer"
						// paint={{
						// 	'fill-color': data,
						// 	'fill-opacity': [ 'case', [ 'boolean', [ 'feature-state', 'hover' ], false ], 1, 0.5 ]
						// }}
						paint={{
							'fill-color': fillColor,
							'fill-opacity': 0.75
						}}
					/>
					<Layer {...dataLayerHightLight} filter={filter} />
				</Source>
				<ControlPanel hoverInfo={hoverInfo?hoverInfo:{hexagon:{}}}></ControlPanel>
				<Legend></Legend>
				</>
			)}
		</MapGL>
	);
};

export default Map;
