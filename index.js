const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqit7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('genius car db connected');
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("genius_car_service").collection("service")

        // get service: http://localhost:5000/service
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services);
        });

        // data load way by an id :http://localhost:5000/service/6263d3258f6051841d9d7200
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        // we use post for creating or adding data 
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService)
            res.send(result);
        })
        // delte 
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

    }

    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running my genius server')
})


app.listen(port, () => {

    console.log('listening to the port', port);
})
