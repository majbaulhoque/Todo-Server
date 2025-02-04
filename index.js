const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174','https://fastidious-cendol-3d01c9.netlify.app'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jdke4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const usersCollection = client.db('Todos').collection('users-todo');

    // Get Method 
    app.get('/todos', async(req, res) =>{
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Single Get Method
    app.get('/todosUpdate/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await usersCollection.findOne(query);
      res.send(result)
    })
    
    // Post Method 
    app.post('/todos', async(req, res) =>{
      const user = req.body;
      console.log("Users New To-do List", user)
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

    app.put('/todosUpdate/:id', async(req,res) =>{
      const id = req.params.id;
      const updatedUser = req.body;
      console.log("Updated User", updatedUser);
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true};
      const updateUser = {
        $set: {
          todo: updatedUser.todo
        }
      }
      const result = await usersCollection.updateOne(filter, updateUser, options);
      res.send(result)
    })

    // Delete Method
    app.delete('/todos/:id', async(req, res) =>{
      const id = req.params.id;
      console.log("Please delete form database", id);
      const query = {_id : new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result)
    })

    // Delete All
    app.delete('/todos', async(req, res) =>{
      const result = await usersCollection.deleteMany({});
      res.send(result)
    })

  } finally {

  }
}
run();


app.get('/', (req, res) =>{
  res.send('Hello World')
})

app.listen(port, () =>{
  console.log(`Smart To Do server is running on port ${port}`)
})