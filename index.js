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

        //add database name
        const brandsCollection = client.db('brandsDB').collection('brands');
        const cartCollection = client.db('brandsDB').collection('cart');

        //brand functionality
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

        // see updated added brands
        app.get('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await brandsCollection.findOne(query);
            res.send(result)
        })
        //update
        app.put('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedBrands = req.body;
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

        //cart operation

        //read cart
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        //add to cart
        app.post('/cart', async (req, res) => {
            const newCart = req.body;
            console.log(newCart);
            const result = await cartCollection.insertOne(newCart);
            res.send(result)
        })
        //delete cart item
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
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