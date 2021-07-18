import { SETUSER, REMOVEUSER } from "../actionType";

const INIT_STATE = {};

const userReducer = (state=INIT_STATE, action) =>{
    switch (action.type){
        case SETUSER:
            return action.data;
        case REMOVEUSER:
            return INIT_STATE;
        default:
            return state
    }
}

export default userReducer;