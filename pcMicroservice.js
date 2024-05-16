const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const { Pc } = require('./models/Pc');

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

// Charger le fichier pc.proto
const pcProtoPath = 'pc.proto';
const pcProtoDefinition = protoLoader.loadSync(pcProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const PcProto = grpc.loadPackageDefinition(pcProtoDefinition).pc;

// Implémenter le service pc
const PcService = {
    createPc: async (call, callback) => {
        const { marque, description } = call.request;
        try {
          const pc = new Pc({ marque, description });
          await pc.save();
          console.log('PC saved successfully:', pc);
          callback(null, { pc });
        } catch (error) {
          console.error('Error saving PC to MongoDB:', error);
          callback(error);
        }
      },  

      getPc: async (call, callback) => {
        try {
          const pcId = new ObjectId(call.request.pc_id);
          console.log('Trying to fetch PC with ID:', pcId);
          const pc = await Pc.findById(pcId); // Assuming Pc is your Mongoose model for PCs
          if (!pc) {
            return callback({
              code: grpc.status.NOT_FOUND,
              details: 'PC not found',
            });
          }
          console.log('PC found:', pc);
          callback(null, { pc });
        } catch (error) {
          console.error('Error fetching PC:', error);
          callback(error);
        }
      }
      
    ,

    searchPcs: async (call, callback) => {
      try {
        console.log('Fetching all PCs from MongoDB');
        const pcs = await Pc.find({});
        console.log('Search results:', pcs);
        callback(null, { pcs });
      } catch (error) {
        console.error('Error fetching all PCs:', error);
        callback(error);
      }
    },
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(PcProto.PcService.service, PcService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
    if (err) {
        console.error('Échec de la liaison du serveur:', err);
        return;
}
    console.log(`Le serveur s'exécute sur le port ${port}`);
    server.start();
});
