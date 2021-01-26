export const deleteChatRoomUser = /* GraphQL */ `
  mutation DeleteChatRoomUser(
    $input: ID!
  ) {
    deleteChatRoomUser(input: $input) {
      id
    }
  }
`;

export const deleteChatRoom = /* GraphQL */ `
  mutation DeleteChatRoom(
    $input: ID
  ) {
    deleteChatRoom(input: $input) {
      id
    }
  }
`;

export const deleteGroupRoomUser = /* GraphQL */ `
  mutation DeleteGroupRoomUser(
    $input: ID
  ) {
    deleteGroupRoomUser(input: $input) {
      id
    }
  }
`;

export const deleteGroupRoom = /* GraphQL */ `
  mutation DeleteGroupRoom(
    $input: ID
  ) {
    deleteGroupRoom(input: $input) {
      id
    }
  }
`;

export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: ID
  ) {
    deleteMessage(input: $input) {
      id
    }
  }
`;
