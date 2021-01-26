export const messagesByChatRoom = /* GraphQL */ `
  query MessagesByChatRoom(
    $chatRoomID: ID
  
  ) {
    messagesByChatRoom( chatRoomID: $chatRoomID) {
      items {
        id
      }
    }
  }
`;

export const roomByGroupRoom = /* GraphQL */ `
  query roomByGroupRoom(
    $chatRoomID: ID
  
  ) {
    roomByGroupRoom( chatRoomID: $chatRoomID) {
      items {
        id
      }
    }
  }
`;

export const roomByChatRoom = /* GraphQL */ `
  query RoomByChatRoom(
    $chatRoomID: ID
  
  ) {
    roomByChatRoom( chatRoomID: $chatRoomID) {
      items {
        id
      }
    }
  }
`;

