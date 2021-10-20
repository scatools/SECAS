import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

const SidebarMode = ({ mode, setMode }) => {
	return (
		<ButtonGroup toggle className="d-flex justify-content-center">
            <ToggleButton
				type="radio"
				variant="outline-secondary"
				name="visualize"
				value="visualize"
				checked={mode === 'visualize'}
				onChange={(e) => setMode(e.currentTarget.value)}
			>
				Visualize
			</ToggleButton>
			<ToggleButton
				type="radio"
				variant="outline-secondary"
				name="add"
				value="add"
				checked={mode === 'add'}
				onChange={(e) => setMode(e.currentTarget.value)}
			>
				Add AOI
			</ToggleButton>
			<ToggleButton
				type="radio"
				variant="outline-secondary"
				name="view"
				value="view"
				checked={mode === 'view'}
				onChange={(e) => setMode(e.currentTarget.value)}
			>
				View AOI
			</ToggleButton>
			<ToggleButton
				type="radio"
				variant="outline-secondary"
				name="assess"
				value="assess"
				checked={mode === 'assess'}
				onChange={(e) => setMode(e.currentTarget.value)}
			>
				Assess
			</ToggleButton>
		</ButtonGroup>
	);
};

export default SidebarMode;
