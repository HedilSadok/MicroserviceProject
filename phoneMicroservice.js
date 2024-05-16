const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const { Phone } = require('./models/Phone');
const { ObjectId } = require('mongodb');
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/PhoneDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1);
  }
};

connectDB();

// Charger le fichier phone.proto
const phoneProtoPath = 'phone.proto';
const phoneProtoDefinition = protoLoader.loadSync(phoneProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const phoneProto = grpc.loadPackageDefinition(phoneProtoDefinition).phone;

// Implémenter le service de téléphone
const phoneService = {
  createPhone: async (call, callback) => {
    const { marque, description } = call.request;
    try {
      const phone = new Phone({ marque, description });
      await phone.save();
      console.log('Phone saved successfully:', phone);
      callback(null, { phone });
    } catch (error) {
      console.error('Error saving Phone to MongoDB:', error);
      callback(error);
    }
  },
  
  getPhone: async (call, callback) => {
    try {
      const phoneId = new ObjectId(call.request.phone_id);
      console.log('Trying to fetch phone with ID:', phoneId);
      const phone = await Phone.findById(phoneId);
      if (!phone) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: 'Phone not found',
        });
      }
      console.log('Phone found:', phone);
      callback(null, { phone });
    } catch (error) {
      console.error('Error fetching phone:', error);
      callback(error);
    }
  },

  
  searchPhone: async (call, callback) => {
    try {
      console.log('Fetching all phones from MongoDB');
      const phones = await Phone.find({});
      console.log('Search results:', phones);
      callback(null, { phones });
    } catch (error) {
      console.error('Error fetching all phones:', error);
      callback(error);
    }
  },
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(phoneProto.PhoneService.service, phoneService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Échec de la liaison du serveur:', err);
      return;
    }
    console.log(`Le serveur s'exécute sur le port ${port}`);
    console.log(`Microservice de téléphone en cours d'exécution sur le port ${port}`);
    server.start();
  });
