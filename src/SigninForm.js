import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {useDispatch} from 'react-redux';
import {setUser, setWeights} from './action';

const SigninForm = ({handleClose}) => {
    const { register, handleSubmit,setError, errors } = useForm();
    const dispatch = useDispatch();
    const onSubmit = async (data) => {
        try{
            const response = await axios.post('https://sca-auth.herokuapp.com/api/user/login',data);
            const {username, organization} = jwt.decode(response.data.token);
            const {weights} = response.data;
            dispatch(setUser({username,organization, token:response.data.token}));
            if(weights){
                dispatch(setWeights(JSON.parse(weights)));
            }
            
            handleClose();
        }catch(e){
            setError("username", {
                type: "manual",
                message: "Invalid username/password"
            });
        }
    }

	return (
        <Form onSubmit={handleSubmit(onSubmit)}>
			<Form.Group controlId="formUsername">
				<Form.Label>Username  <span className='text-danger'>*</span></Form.Label>
                <Form.Control type="text" placeholder="Enter username" name="username" ref={register({ required: {value: true , message:"Username is required!"} })}/>
                {errors.username && <Form.Text className="text-danger">{errors.username.message}</Form.Text>}
			</Form.Group>

			<Form.Group controlId="formPassword">
				<Form.Label>Password  <span className='text-danger'>*</span></Form.Label>
				<Form.Control type="password" placeholder="Password" name="password" ref={register({ required: {value: true , message:"Password is required!"} })}/>
                {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
			</Form.Group>

			<Button variant="dark" type="submit" className="btn-block">
				Sign in
			</Button>
		</Form>
	);
};

export default SigninForm;
