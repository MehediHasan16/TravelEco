
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

// pass =iL6Rh2H1l81Gccyn
//user= travelEco

const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udlsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database');

        const database = client.db('travel');
        const servicesCollection = database.collection('services');
        // const database2 = client.db('booking');
        // const bookingCollection = database2.collection('selectedServices');
        const bookingCollection = client.db('booking').collection("selectedServices");
        ///POST ADD services
        app.post('/addServices', async (req, res) => {
            const result = await servicesCollection.insertOne(req.body)
            res.send(result);
        });
        //get all services
        app.get('/ourServices', async (req, res) => {
            const result = await servicesCollection.find({}).toArray();
            res.send(result);
        })

        //get single service detail
        app.get('/serviceDetail/:id', async (req, res) => {
            const id = req.params.id;
            const result = await servicesCollection.findOne({ _id: ObjectId(id) })
            res.send(result)
        })

        // post my  booking
        app.post('/addBooking', async (req, res) => {
            console.log(req.body);
            const result = await bookingCollection.insertOne(req.body)
            res.send(result);
        })

        //get my booking
        app.get('/mybooking', async (req, res) => {

            const result = await bookingCollection.find({}).toArray();
            res.send(result)
        })
        //delete booking
        app.delete('/cancelBooking/:id', async (req, res) => {
            const result = await bookingCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(result);
        })

        //put booking
        app.put('/approved/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const option = { upset: true };
            const updateDoc = {
                $set: {
                    state: "Approved"

                },

            }
            const result = await bookingCollection.updateOne(query, updateDoc, option)
            res.send(result)
            console.log(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('Running travelEco server')
});
app.listen(port, () => {
    console.log('Running TravelEco Server on port', port);
})



