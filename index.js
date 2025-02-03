const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Smart-to-do:qVePR7Oya84zRV4q@cluster0.jdke4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    
    
    // Post Method 
    app.post('/todos', async(req, res) =>{
      const user = req.body;
      console.log("Users New To-do List", user)
      const result = await usersCollection.insertOne(user);
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