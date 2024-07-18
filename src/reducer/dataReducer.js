import {LOAD_DATA,CALCULATE_VALUE} from '../actionType';


const dataReducer = (state=null, action) =>{
    switch (action.type){
        case LOAD_DATA:
            return {...action.data}
        case CALCULATE_VALUE:
            return {
                ...state,
                features: state.features.map(feature=>{
                    const newFeature = {...feature};
                    const weightsArray = Object.values(action.weights);
                    let value=0;
                    for(let goal of weightsArray){
                        if(goal.weight!==0){
                            let goalValue = 0;
                            goal.selected.forEach(measure=>{
                                if(measure.weight==='high'){
                                    goalValue += Number(measure.utility)*newFeature['properties'][measure.value]
                                }else if(measure.weight==='medium'){
                                    goalValue += Number(measure.utility)*newFeature['properties'][measure.value]*0.67
                                }else{
                                    goalValue += Number(measure.utility)*newFeature['properties'][measure.value]*0.34
                                }
                            })
                            value+=goalValue*goal.weight/100
                        }
                    }
                    newFeature['properties']['value']=value;
                    return newFeature;
                })
            } 
        default:
            return state;
    }
}

export default dataReducer;