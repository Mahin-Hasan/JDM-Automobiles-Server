const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4lo48xa.mongodb.net/?retryWrites=true&w=majority`;

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

        //add database name
        const brandsCollection = client.db('brandsDB').collection('brands');

        //implement read
        app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        //add brands
        app.post('/brands', async (req, res) => {
            const newBrand = req.body;
            console.log(newBrand);
            const result = await brandsCollection.insertOne(newBrand);
            res.send(result)
        })

        //update added brands
        app.get('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await brandsCollection.findOne(query);
            res.send(result)
        })

        app.put('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedBrands = req.body;
            // image, brandName, carType, carPrice, carRating, carDescription
            const brands = {
                $set: {
                    image: updatedBrands.image,
                    brandName: updatedBrands.brandName,
                    carName: updatedBrands.carName,
                    carType: updatedBrands.carType,
                    carPrice: updatedBrands.carPrice,
                    carRating: updatedBrands.carRating,
                    carDescription: updatedBrands.carDescription,
                }
            }
            const result = await brandsCollection.updateOne(filter, brands, options)
            res.send(result);
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


app.get('/', (req, res) => {
    res.send('JDM Automobiles server is running')
})

app.listen(port, () => {
    console.log(`JDM Automobiles is running on port: ${port}`);
    console.log('test');
})