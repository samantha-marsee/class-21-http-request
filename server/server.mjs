import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

// log every request to the console
app.use((req, res, next) => {
  console.log('>', req.method, req.path);
  next();
});

// Delay every request by 1 second (helps to demonstrate that data is coming from another source.)
app.use((req, res, next) => {
  setTimeout(() => {
    next();
  }, 1000);
});

// --- Change nothing above this line ---


// Connect to MongoDB
const client = new MongoClient('mongodb://localhost:27017');
const conn = await client.connect();
const db = conn.db('app');

app.get('/api/space', async (req, res) => {
  const spaceData = await db.collection('space').find().toArray();
  res.status(200).json(spaceData);
});

app.get('/api/produce', async (req, res) => {
  // query parameters
  const country = req.query.country;
  const category = req.query.category;

  // Build filter based on provided query parameters
  let filter = {};
  if (country) {
    filter.country = country;
  }
  if (category) {
    filter.category = category;
  }

  // query the database
  const produce = await db.collection('produce')
    .find(filter)
    .toArray();
  res.status(200).json(produce);
});

app.get('/api/produce/:id', async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const id = new ObjectId(req.params.id);
    const produce = await db.collection('produce').findOne({ _id: id });

    if (produce) {
      res.status(200).json(produce);
    } else {
      res.status(404).send()
    }
  } else {
    res.status(404).send();
  }
});

app.get('/api/produce/:id/buy', async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const id = new ObjectId(req.params.id);
    const status = await db.collection('produce').updateOne(
      { _id: id },
      { $inc: { quantity: -1 } }
    );

    if (status.modifiedCount > 0) {
      res.status(200).send()
    } else {
      res.status(404).send()
    }
  } else {
    res.status(404).send();
  }
});

app.delete('/api/produce/:id', async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const id = new ObjectId(req.params.id);
    const result = await db.collection('produce').deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.status(200).send()
    } else {
      res.status(404).send()
    }
  } else {
    res.status(404).send();
  }
});


// --- Change nothing below this line ---

// 404 - not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'resource ' + req.url + ' not found' });
});

// 500 - Any server error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send()
});

// start server on port
const server = app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}/`);
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`error: port ${port} is already in use!`, 'kill this server! (control + c)');
    process.exit(1);
  } else {
    console.error('server error:', error);
  }
});
