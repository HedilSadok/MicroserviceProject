**PcService Microservice**
The PcService microservice handles the management of PCs (Personal Computers) in your application. It offers functionalities to create, retrieve, update, and delete PC records.

**Data Schemas**
The PcService microservice uses the following data schema:

*Pc (Personal Computer)*
Represents a PC in the application. The schema includes the following fields:

id (ID): Unique identifier for the PC.
marque (String): Brand of the PC.
description (String): Description of the PC.
Endpoints
The PcService microservice exposes the following endpoints for interacting with the PC records:

*REST API*
GET /pcs: Retrieve all PCs.
GET /pcs/:id: Retrieve a specific PC by its ID.
POST /pcs: Create a new PC by providing the necessary information.
*GraphQL API*
Query:
getPc(id: ID!) : Pc: Retrieve the details of a specific PC by providing its ID.
getAllPcs : [Pc]: Retrieve all PCs.
Mutation:
createPc(marque: String!, description: String!) : Pc: Create a new PC by providing the necessary information.

Allows interaction with the PcService microservice through HTTP requests. The REST API offers endpoints to perform CRUD operations on PCs.

*GraphQL*
Facilitates interaction with the microservice using GraphQL queries and mutations. 
GraphQL offers a flexible and efficient way to query and manipulate data related to PCs.

*gRPC*
Allows interaction with the PcService microservice through Remote Procedure Call (RPC) methods. 
The gRPC service provides methods to create, read, update, and delete PC records.
**Setup and Installation**
Install dependencies:
npm install
Start MongoDB:
Ensure you have MongoDB running locally or update the connection string in the connectDB function to point to your MongoDB instance.
Run the microservice:
node pcService.js

**Usage**
*REST API*
Retrieve all PCs:
GET http://localhost:3000/pcs
Retrieve a specific PC by ID:GET http://localhost:3000/pcs/:id
Create a new PC:
POST http://localhost:3000/pcs
Content-Type: application/json
{
  "marque": "DELL",
  "description": "Description of the PC"
}
GraphQL
Query to get all PCs:query {
  getAllPcs {
    id
    marque
    description
  }
}
gRPC
Ensure your gRPC client is set up to communicate with the PcService running on the appropriate port (50051 by default).


**PhoneService Microservice**
The PhoneService microservice handles the management of phones in your application. It offers functionalities to create, retrieve, update, and delete phone records.

**Data Schemas**
The PhoneService microservice uses the following data schema:

Phone
Represents a phone in the application. The schema includes the following fields:

id (ID): Unique identifier for the phone.
marque (String): Brand of the phone.
description (String): Description of the phone.
Endpoints
The PhoneService microservice exposes the following endpoints for interacting with phone records:

*REST API*
GET /phones: Retrieve all phones.
GET /phones/:id: Retrieve a specific phone by its ID.
POST /phones: Create a new phone by providing the necessary information.
GraphQL API
Query:
getPhone(id: ID!) : Phone: Retrieve the details of a specific phone by providing its ID.
getAllPhones : [Phone]: Retrieve all phones.
Mutation:
createPhone(marque: String!, description: String!) : Phone: Create a new phone by providing the necessary information.
gRPC
The PhoneService microservice also exposes a gRPC interface for interaction with clients.

Interactions
The PhoneService microservice can be interacted with via:

*REST API*
Allows interaction with the PhoneService microservice through HTTP requests. 
The REST API offers endpoints to perform CRUD operations on phones.

GraphQL
Facilitates interaction with the microservice using GraphQL queries and mutations. 
GraphQL offers a flexible and efficient way to query and manipulate data related to phones.

gRPC
Allows interaction with the PhoneService microservice through Remote Procedure Call (RPC) methods. 
The gRPC service provides methods to create, read, update, and delete phone records.
Setup and Installation
Clone the repository:
Start MongoDB:
Run the microservice:node phoneService.js
**Usage**
REST API
Retrieve all phones:GET http://localhost:3000/phones
Retrieve a specific phone by ID:GET http://localhost:3000/phones/:id
Create a new phone:
POST http://localhost:3000/phones
Content-Type: application/json
{
  "marque": "Samsung",
  "description": "Description of the phone"
}
*GraphQL*
Query to get all phones:
query {
  getAllPhones {
    id
    marque
		description
  }
}
gRPC
**Ensure your gRPC client is set up to communicate with the PhoneService running on the appropriate port (50052 by default).**

**This README provides a comprehensive overview of the PhoneService microservice and PcService, detailing its data schemas, endpoints, interactions, setup instructions, and usage examples**
