import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($userId: ID!, $savedBook: String!) {
    savedBook(userId: $userId, savedBook: $savedBook) {
      _id
      username
      savedBook
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deletebook($savedBook: String!) {
    deletebook(skill: $savedBook) {
      _id
      username
      savedBook
    }
  }
`;
