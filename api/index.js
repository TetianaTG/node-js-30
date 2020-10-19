const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const contactsRouter = require('./contacts/contacts.router');

require('dotenv').config();

class ContacsServer {
  constructor() {
    this.server = null;
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan('tiny'));
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use('/contacts', contactsRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(
        process.env.MONGODB_URL,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
      console.log('Database connection successful');
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  startListening() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log('Server started listening on port', PORT);
    });
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }
}

new ContacsServer().start();