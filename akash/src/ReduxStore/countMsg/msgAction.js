import {FIND_CHATID, MSG_INCREMENT, MSG_REMOVE} from './msgType';

const incMsg = () => {
  //console.log("item: " )
  return {
    type: MSG_INCREMENT,
    chatRoomID: data,
  };
};

const findChatId = () => {
  return {
    type: FIND_CHATID,
    payload: 'Remove msg',
  };
};

const emptyMsg = () => {
  return {
    type: MSG_REMOVE,
  };
};

export default {
  incMsg,
  findChatId,
  emptyMsg,
};
