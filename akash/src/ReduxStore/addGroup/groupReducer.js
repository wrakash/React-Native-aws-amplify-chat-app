import {ADD_FRIEND, REMOVE_FRIEND, REMOVE_ALL} from './groupType';



const groupReducer = (state = [], action) => {
  // console.log("reducer: " + state.users)
  switch (action.type) {
    case ADD_FRIEND:
      return [...state, action.data]
    
    case REMOVE_FRIEND:
      return state.filter(groupReducer => groupReducer.id !== action.data.id)

    case REMOVE_ALL:
     
     return state=[]

  }
  return state;
};

export default groupReducer;
