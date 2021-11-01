import React, { useRef, useState, useEffect } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';
import { useSelector } from 'react-redux';
import { getFeatureStyle, getEditHandleStyle } from './draw-style';
import { dataLayer, dataLayerHightLight } from './map-style';
import ControlPanel from './ControlPanel';
import Legend from './Legend';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA';

const Map = ({ drawingMode, setFeatureList, aoiSelected, editAOI, viewport, setViewport, habitatType }) => {
	const map = useRef(null);
	const [ fillColor, setFillColor ] = useState('#6E599F');
	const [ fillOpacity, setFillOpacity ] = useState(0.5);
	const [ filter, setFilter ] = useState([ 'in', 'OBJECTID', '' ]);
	const [ hoverInfo, setHoverInfo ] = useState(null);
	const [ legendInfo, setLegendInfo ] = useState(null);
	const aoi = Object.values(useSelector((state) => state.aoi)).filter((aoi) => aoi.id === aoiSelected);
	const [ mode, setMode ] = useState(null);
	const [ selectedFeatureIndex, setSelectedFeatureIndex ] = useState(null);

	var avmButton = document.getElementById("avmButton");
	// var selectHabitatType = document.getElementById("selectHabitatType");
	var selectedOption = document.getElementsByClassName("select__multi-value__label");

	const onSelect = (options) => {
		setSelectedFeatureIndex(options && options.selectedFeatureIndex);
	};
	
	const editorRef = useRef(null);
	const onDelete = () => {
		const selectedIndex = selectedFeatureIndex;
		if (selectedIndex !== null && selectedIndex >= 0) {
			editorRef.current.deleteFeatures(selectedIndex);
		}
	};

	const onUpdate = ({ editType }) => {
		if (editType === 'addFeature') {
			setMode(new EditingMode());
		}
	};
	
	useEffect(() => {
		if (editorRef.current) {
			const featureList = editorRef.current.getFeatures();
			setFeatureList(featureList);
		}
	});
	
	useEffect(
		() => {
			if (!drawingMode && editorRef.current) {
				const featureList = editorRef.current.getFeatures();
				const featureListIdx = featureList.map((feature, idx) => idx);
				setFeatureList([]);
				if (featureListIdx.length > 0) {
					editorRef.current.deleteFeatures(featureListIdx);
				}
			}
		},
		[ drawingMode, setFeatureList ]
	);

	useEffect(
		()=>{
			if(editAOI && aoiSelected && drawingMode && editorRef.current.getFeatures().length===0){
				editorRef.current.addFeatures(aoi[0].geometry);
			}
		},[editAOI,aoi,drawingMode,aoiSelected]
	)

	const renderDrawTools = () => {
		// Copy from mapbox
		return (
			<div className="mapboxgl-ctrl-top-right">
				<div className="mapboxgl-ctrl-group mapboxgl-ctrl">
					<button
						className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
						title="Polygon tool (p)"
						onClick={async () => {
							setMode(new DrawPolygonMode());
						}}
					/>

					<button
						className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
						title="Delete"
						onClick={onDelete}
					/>
				</div>
			</div>
		);
	};

	// const onViewStateChange = (e) => {
	// 	// console.log(e);
	// 	let windowContent = document.getElementById("floatingWindow");
	// 	// let popupWindow = document.getElementsByClassName("map.tooltip");
	// 	windowContent.style.display = 'block';
	// 	// console.log(popupWindow);
	// 	if (e.viewState.zoom >= 10) {
	// 		windowContent.innerHTML = "<p>Click to explore the details of a single hexagonal area.</p>"
	// 								+"<p>Current zoom level :"
	// 								+e.viewState.zoom.toFixed(1)+"</p>"
	// 	}
	// 	else {
	// 		windowContent.innerHTML = "<p>Please zoom in to level 10 to explore the details of a single hexagonal area.</p>"
	// 								+"<p>Current zoom level :"
	// 								+e.viewState.zoom.toFixed(1)+"</p>"
	// 	}
	// }

	return (
		<MapGL
			{...viewport}
			style={{ position: 'fixed', top: '5.7vh' }}
			width="100vw"
			height="94.3vh"
			// mapStyle="mapbox://styles/mapbox/dark-v9"
			mapStyle="mapbox://styles/mapbox/light-v9"
			// onViewportChange={(nextViewport) => setViewport(nextViewport)}
			onViewportChange={setViewport}
			// onViewStateChange={onViewStateChange}
			mapboxApiAccessToken={MAPBOX_TOKEN}
			ref={map}
		>
			{!habitatType && (				
				<Source type="vector" url="mapbox://chuck0520.4fzqbp42" maxzoom={22} minzoom={0}>
					<Layer
						{...dataLayer}
						// id = "SECASlayer"
						value = "SECASlayer"
						paint={{
							'fill-outline-color': '#484896',
							'fill-color': fillColor,
							'fill-opacity': 0.5
						}}
					/>
				</Source>				
			)}
			<Editor
				ref={editorRef}
				style={{ width: '100%', height: '100%' }}
				clickRadius={12}
				mode={mode}
				onSelect={onSelect}
				onUpdate={onUpdate}
				editHandleShape={'circle'}
				featureStyle={getFeatureStyle}
				editHandleStyle={getEditHandleStyle}
			/>
			{aoi.length > 0 && !editAOI && (
				<Source type="geojson" data={{
					type:'FeatureCollection',
					features: aoi[0].geometry
				}}>
					<Layer  id="data" type="fill" paint={{"fill-color":'#fee08b','fill-opacity': 0.8}}/>
				</Source>
			)}
			{drawingMode && renderDrawTools()}
			{habitatType === 'hab2' && (
				<>
					<Source type="raster" url="mapbox://chuck0520.3dbvy7bi" maxzoom={22} minzoom={0}>
						<Layer
							type='raster'
							id = "Forested_Wetland"
							value = "Forested_Wetland"
						/>
					</Source>
					<Legend legendInfo="FW"></Legend>
				</>
			)}
			{habitatType === 'hab3' && (
				<>
					<Source type="raster" url="mapbox://chuck0520.813oo4df" maxzoom={22} minzoom={0}>
						<Layer
							type='raster'
							id = "Upland_Hardwoods_Forest"
							value = "Upland_Hardwoods_Forest"
						/>
					</Source>
					<Legend legendInfo="UHF"></Legend>
				</>
			)}
			{habitatType === 'hab4' && (
				<>
					<Source type="raster" url="mapbox://chuck0520.6kkntksf" maxzoom={22} minzoom={0}>
						<Layer
							type='raster'
							id = "Upland_Hardwoods_Woodland"
							value = "Upland_Hardwoods_Woodland"
						/>
					</Source>
					<Legend legendInfo="UHW"></Legend>
				</>
			)}
			{habitatType === 'hab5' && (
				<>
					<Source type="raster" url="mapbox://chuck0520.c4pm2rl8" maxzoom={22} minzoom={0}>
						<Layer
							type='raster'
							id = "Mixed_Forest"
							value = "Mixed_Forest"
						/>
					</Source>
					<Legend legendInfo="MF"></Legend>
				</>
			)}
			{habitatType === 'hab6' && (
				<>
					<Source type="raster" url="mapbox://chuck0520.bwuspx5h" maxzoom={22} minzoom={0}>
						<Layer
							type='raster'
							id = "Grass"
							value = "Grass"
						/>
					</Source>
					<Legend legendInfo="G"></Legend>
				</>
			)}
		</MapGL>
	);
};

export default Map;
