import React, { useState } from 'react';
import { Button} from 'react-bootstrap';
import Map from './Map';
import './main.css';
import Sidebar from './Sidebar';

const Main = () => {
	const [ activeSidebar, setActiveSidebar ] = useState(false);
	const [ activeTable, setActiveTable ] = useState(null);
	const [ drawingMode, setDrawingMode ] = useState(false);
	const [ featureList, setFeatureList ] = useState([]);
	const [ aoiSelected, setAoiSelected ] = useState(null);
	const [ editAOI, setEditAOI ] = useState(false);
	const [ viewport, setViewport ] = useState({latitude: 35, longitude: -95, zoom: 5});
	const [ habitatType, setHabitatType ] = useState(null);

	return (
		<div>
			<Sidebar activeSidebar={activeSidebar}
					setActiveSidebar={setActiveSidebar}
					setActiveTable={setActiveTable}
					setDrawingMode={setDrawingMode}
					featureList={featureList}
					aoiSelected={aoiSelected}
					setAoiSelected={setAoiSelected}
					editAOI={editAOI}
					setEditAOI={setEditAOI}
					setViewport={setViewport}
					setHabitatType={setHabitatType}
			/>
			<div style={{ height: '100%', position: 'relative' }} className="content">
				<Button
					style={{ position: 'absolute', top: '80px', left: '50px', zIndex: 1 }}
					variant="secondary"
					onClick={() => {
						setActiveSidebar(true);
					}}
				>
					Start
				</Button>
				{/* <div id="floatingWindow" className="window">
					<p>Please zoom in to level 10 to explore the details of a single hexagonal area.</p>
					<p>Current zoom level :</p>
				</div> */}
				<Map drawingMode={drawingMode}
					setFeatureList={setFeatureList}
					aoiSelected={aoiSelected}
					editAOI={editAOI}
					viewport={viewport}
					setViewport={setViewport}
					habitatType={habitatType}
				/>
			</div>
		</div>
	);
};

export default Main;
