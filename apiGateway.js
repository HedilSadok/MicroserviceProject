const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { gql } = require('apollo-server-express');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();

// Load protobuf files
const pcProtoPath = 'pc.proto';
const phoneProtoPath = 'phone.proto';
const pcProtoDefinition = protoLoader.loadSync(pcProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const phoneProtoDefinition = protoLoader.loadSync(phoneProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const pcProto = grpc.loadPackageDefinition(pcProtoDefinition).pc;
const phoneProto = grpc.loadPackageDefinition(phoneProtoDefinition).phone;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //csrfPrevention: false,
});

//(async () => {
  server.start().then(() => {

  app.use(
    cors(),
    bodyParser.json(), // Use bodyParser before expressMiddleware
    expressMiddleware(server),
  );
});

  // Define routes for PC and Phone services
  app.get('/pcs', (req, res) => {
    const query = req.query.query || {}; // Ensure query is an object
    const client = new pcProto.PcService('localhost:50051', grpc.credentials.createInsecure());
    client.searchPcs({ query }, (err, response) => {
      if (err) {
        console.error('Error fetching PCs:', err);
        res.status(500).send(err);
      } else {
        res.json(response.pcs);
      }
    });
  });

  app.get('/pcs/:id', (req, res) => {
    const client = new pcProto.PcService('localhost:50051', grpc.credentials.createInsecure());
    const id = req.params.id;
    console.log(`Fetching PC with ID: ${id}`); // Log the ID
    client.getPc({ pcId: id }, (err, response) => {
      if (err) {
        console.error('Error fetching PC:', err); // Log the error
        res.status(500).send(err);
      } else if (!response) {
        console.log('No PC found for ID:', id); // Log if no PC is found
        res.status(404).send({ message: 'PC not found' });
      } else {
        res.json(response.pc);
      }
    });
  });

  app.get('/phones', (req, res) => {
    const query = req.query.query || {}; // Ensure query is an object
    const client = new phoneProto.PhoneService('localhost:50052', grpc.credentials.createInsecure());
    client.searchPhones({ query }, (err, response) => {
      if (err) {
        console.error('Error fetching Phones:', err);
        res.status(500).send(err);
      } else {
        res.json(response.phones);
      }
    });
  });

  app.get('/phones/:id', (req, res) => {
    const client = new phoneProto.PhoneService('localhost:50052', grpc.credentials.createInsecure());
    const id = req.params.id;
    console.log(`Fetching Phone with ID: ${id}`); // Log the ID
    client.getPhone({ phoneId: id }, (err, response) => {
      if (err) {
        console.error('Error fetching Phone:', err); // Log the error
        res.status(500).send(err);
      } else if (!response) {
        console.log('No Phone found for ID:', id); // Log if no Phone is found
        res.status(404).send({ message: 'Phone not found' });
      } else {
        res.json(response.phone);
      }
    });
  });

  app.post('/phones', (req, res) => {
    const { marque, description } = req.body;
    const client = new phoneProto.PhoneService('localhost:50052', grpc.credentials.createInsecure());
    client.createPhone({ marque, description }, (err, response) => {
      if (err) {
        console.error('Error creating Phone:', err);
        res.status(500).send(err);
      } else {
        res.json(response.phone);
      }
    });
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
  });

