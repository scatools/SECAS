import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {useDispatch} from 'react-redux';
import {setUser} from './action';

const RegisterForm = ({handleClose}) => {
    const dispatch = useDispatch();
    const { register, handleSubmit,setError, errors } = useForm();
    const onSubmit = async (data) => {
        console.log(data);
        const {username,password, organization} = data;
        const dataReadyToSubmit = {
            username,
            password,
            organization: ''+organization
        }
        try{
            const response = await axios.post('https://sca-auth.herokuapp.com/api/user/register',dataReadyToSubmit);
            const {username, organization} = jwt.decode(response.data.token);
            dispatch(setUser({username,organization, token:response.data.token}));
            handleClose();
        }catch(e){
            setError("username", {
                type: "manual",
                message: "Username is already taken"
            });
        }
    }

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Form.Group controlId="formUsername">
				<Form.Label>Username  <span className='text-danger'>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter username" name="username" 
                    ref={register({ 
                        required: {value: true , message:"Username is required!"}, 
                        minLength: { value: 2, message: "Must be longer than 2 characters." }
                    })}/>
                {errors.username && <Form.Text className="text-danger">{errors.username.message}</Form.Text>}
			</Form.Group>

			<Form.Group controlId="formPassword">
				<Form.Label>Password  <span className='text-danger'>*</span></Form.Label>
				<Form.Control type="password" placeholder="Password" name="password" ref={register({ required: true })}/>
                {errors.password && <Form.Text className="text-danger">Password is required</Form.Text>}
			</Form.Group>

			<Form.Group controlId="formOrganization">
				<Form.Label>Organization</Form.Label>
				<Form.Control type="text" placeholder="Enter Organization Name" name="organization" ref={register}/>
			</Form.Group>

			<Button variant="dark" type="submit" className="btn-block">
				Join the Network
			</Button>
		</Form>
	);
};

export default RegisterForm;