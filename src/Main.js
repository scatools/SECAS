import React, { useState } from 'react';
import { Button} from 'react-bootstrap';
import Map from './Map';
import './main.css';
import Sidebar from './Sidebar';

const Main = () => {
	const [ activeSidebar, setActiveSidebar ] = useState(false);
	const [data, setData] = useState(null);

	// const [weightsDone, setWeightsDone]=useState(false);

	return (
		<div>
			<Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} 
			// setWeightsDone={setWeightsDone} 
			setData={setData} />
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
				<Map 
				// weightsDone={weightsDone} 
				data={data}/>
			</div>
		</div>
	);
};

export default Main;
