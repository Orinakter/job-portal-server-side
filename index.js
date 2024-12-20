const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 4000
require('dotenv').config()
 app.use(express.json())
 app.use (cors({
  origin : ["http://localhost:5173"],
   credentials : true
 }))
 app.use(cookieParser())


//  QXpXC4Y3bmHDEzZD
// job_portal



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fo90p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("jobPortal");
    const jobsCollection = database.collection("jobs");
    const jobApplicationCollection = database.collection("job-Application")
   
    

    // jobs related apis:

    app.get('/jobs',async(req,res)=>{
      const cursor = jobsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/jobs/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await jobsCollection.findOne(query)
      res.send(result)
    })

    // job Application apis:

    app.post('/job-Application',async(req,res)=>{
      const application = req.body;
      const result = await jobApplicationCollection.insertOne(application)
      res.send(result)
    })

    app.get('/job-Application',async(req,res)=>{
      const email = req.query.email
      const query = {applicant_email : email}
      const result = await jobApplicationCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/job-Application/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await jobApplicationCollection.deleteOne(query)
      res.send(result)
    })

    // jwt api

    app.post('/jwt',(req,res)=>{
      const user = req.body
      const token = jwt.sign(user,process.env.SECRET_TOKEN,{expiresIn : "6h"})
      res.cookie('token',token,{
        httpOnly : true,
        secure : false,
      })
      .send('token send successfully')
     
    })

    app.post('/logout',(req,res)=>{
      res.clearCookie('token',{
        httpOnly : true,
        secure : false,
        
      })
      .send('token clear successfully')
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


 app.get ('/',(req,res)=>{
    res.send('Hello express')
 })

 app.listen(port,()=>{
    console.log(`current port : ${port}`);
 })