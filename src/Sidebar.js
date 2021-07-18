import React, { useState } from 'react';
import { Button, Accordion, Card, Form, Row, Col, ButtonGroup, ToggleButton, Table, Modal } from 'react-bootstrap';
import './main.css';
import Select from 'react-select';
import {useDispatch,useSelector} from 'react-redux';
import {changeMeasures,changeMeasuresWeight,changeGoalWeights} from './action';
import { GoInfo } from 'react-icons/go';
import ReactTooltip from "react-tooltip";

const Sidebar = ({activeSidebar,setActiveSidebar,setWeightsDone, setData}) =>{
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
	const [ mode, setMode ] = useState('add');

    const weights =  useSelector(state => state.weights)

	const handleChange = (value, name, label, type) => {	
		dispatch(changeMeasuresWeight(value,name, label, type))
	};	  
	const handleWeights = (value, goal) =>{
		const newValue = Number(value)> 100 ? 100 : Number(value);
		dispatch(changeGoalWeights(newValue, goal))
	}
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
					<Accordion defaultActiveKey="0">
						<Card className="my-2">
							<Accordion.Toggle as={Card.Header} eventKey="2">
								Select System:
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="2">
								<Card.Body>
									<div>
									<span>Habitat Type:</span>
									<Select
										styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
										menuPortalTarget={document.body}
										options={[
											{ value: 'hab1', label: 'Open Pine Woodland BDH' },
											{ value: 'hab2', label: 'Forested Wetland BDH' },
											{ value: 'hab3', label: 'Upland Hardwoods - Forest' },
											{ value: 'hab4', label: 'Upland Hardwoods - Woodland' },
											{ value: 'hab5', label: 'Upland Hardwoods - Woodland' },
											{ value: 'hab6', label: 'Tidal Marsh BDH' },
											{ value: 'hab7', label: 'Big Rivers' },
											{ value: 'hab8', label: 'Streams and Rivers' }
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
											    	weight: selected['weight'] || 'medium'
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
									
									{weights.hab.selected &&
										weights.hab.selected.map((measure) => (
											<div className="m-2" key={measure.value}>
												<span style={{ display: 'block' }} className="my-1">
													{measure.label}
												</span>
												<ButtonGroup toggle className="ml-2">
													<ToggleButton
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
														Low ROI [0]
													</ToggleButton>
													<ToggleButton
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
														Restore [1]
													</ToggleButton>
													<ToggleButton
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
														Enhance [2]
													</ToggleButton>
													<ToggleButton
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
														Maintain [3]
													</ToggleButton>
												</ButtonGroup>
											</div>
										))}
										</div>
									<br />
									
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
				</div>
        </div>
    )
}

export default Sidebar;