export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      status
      ChatRoomGroup {
        items {
          id
          userID
          chatRoomID
          createdAt
          updatedAt
          GroupRoom {
            id
            groupName
            groupImg
            ChatRoomGroups {
              items {
                user {
                  id
                  imageUri
                  status
                }
              }
            }
            lastMessage {
              id
              content
              updatedAt
              user {
                id
                name
              }
            }
          }
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

