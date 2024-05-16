const { gql } = require('@apollo/server');
const express = require('express');
const app = express();
// Define the GraphQL schema for mutations
const typeDefs = `
type Pc {
  id: String!
  marque: String!
  description: String!
}

type Phone {
  id: String!
  marque: String!
  description: String!
}

type Query {
  pc(id: String!): Pc
  pcs: [Pc]  # Define the pcs field here
  phone(id: String!): Phone
  phones: [Phone]
}
  type Mutation {
    createPc(input: CreatePcInput!): Pc
    createPhone(input: CreatePhoneInput!): Phone
  }

  input CreatePcInput {
    marque: String!
    description: String!
  }

  input CreatePhoneInput {
    marque: String!
    description: String!
  }
`;

module.exports = typeDefs;
