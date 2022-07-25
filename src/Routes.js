import React from 'react';
import { Route, Routes as Switch, Navigate } from 'react-router-dom';
import Main from './Main';

const Routes = () =>{
    return (
        <Switch>
            <Route exact path="/" element={<Main/>} />
            <Route element={<Navigate to="/"/>} /> 
        </Switch>
    )
}

export default Routes