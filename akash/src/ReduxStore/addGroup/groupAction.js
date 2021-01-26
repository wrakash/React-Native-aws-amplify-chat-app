import {ADD_FRIEND, REMOVE_FRIEND, REMOVE_ALL} from './groupType'

const addFriend= (item) =>{
   // console.log("item: " + item.id)
    return{
        type:ADD_FRIEND,
        data:item
    }
}

const removeFriend= (item) =>{
    return{
        type:REMOVE_FRIEND,
        data:item
  
    }
}

const removeAll= (item) =>{
    return{
        type:REMOVE_ALL
    }
}

export default {
    addFriend,
    removeFriend,
    removeAll
}