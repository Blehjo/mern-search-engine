const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [String]!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user: User!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(userId: ID!, savedBook: String!): User
    deleteBook(savedBook: String!): User
  }
`;

module.exports = typeDefs;
