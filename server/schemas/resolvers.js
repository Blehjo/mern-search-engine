const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
      }
      throw new AuthenticationError('You need to be logged in, sorry..')
    },
  },
  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user with this email found!');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect password!');
        }
  
        const token = signToken(user);
        return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
        // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: { savedBooks: book },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        }
    },
    deleteBook: async (parent, { savedBook }, context) => {
        if (context.user) {
            return User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: savedBook } },
            { new: true }
            );
        }
    },
  },
};

module.exports = resolvers;