const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto files for PC and Phone services
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

// Define resolvers for GraphQL queries and mutations
const resolvers = {
  Query: {
    pc: (_, { id }) => {
      const client = new pcProto.PcService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getPc({ pcId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.pc);
          }
        });
      });
    },
    pcs: () => {
      const client = new pcProto.PcService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchPcs({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.pcs);
          }
        });
      });
    },
    phone: (_, { id }) => {
      const client = new phoneProto.PhoneService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getPhone({ phoneId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.phone);
          }
        });
      });
    },
    phones: () => {
      const client = new phoneProto.PhoneService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchPhones({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.phones);
          }
        });
      });
    },
  },
  Mutation: {
    createPc: (_, { input }) => {
      const { marque, description } = input;
      const client = new pcProto.PcService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createPc({ marque, description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.pc);
          }
        });
      });
    },
    createPhone: (_, { input }) => {
      const { marque, description } = input;
      const client = new phoneProto.PhoneService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createPhone({ marque, description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.phone);
          }
        });
      });
    }, 
  },
};

module.exports = resolvers;
