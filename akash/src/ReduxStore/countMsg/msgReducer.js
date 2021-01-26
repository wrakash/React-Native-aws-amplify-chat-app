import {FIND_CHATID, MSG_INCREMENT, MSG_REMOVE} from './msgType';

const initialState = {
  msg:0,
  chatRoomID:""
};

const groupReducer = (state = initialState, action) => {
   //console.log("reducer: " + state.msg)
  switch (action.type) {
    case MSG_INCREMENT:
      return {
        ...state,
        msg: state.msg+1,
      };

    case FIND_CHATID:
      return {
        ...state,
        chatRoomID: action.data
      }

    case MSG_REMOVE:
      return state.msg=0
  }
  return state;
};

export default groupReducer;
