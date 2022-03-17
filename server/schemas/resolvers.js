const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, { _id }) => {
      const params =  { _id };
      return User.find(params);
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
        const profile = await User.findOne({ email });
  
        if (!profile) {
          throw new AuthenticationError('No profile with this email found!');
        }
  
        const correctPw = await profile.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect password!');
        }
  
        const token = signToken(profile);
        return { token, profile };
    },
    saveBook: async (parent, { savedBook }, context) => {
        // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
        if (context.user) {
          return User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: { savedBooks: savedBook },
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