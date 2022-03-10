const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4f4qc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // connecting to mongodb
        await client.connect();
        const database = client.db("foodism");
        const foodsCollection = database.collection("foods");
        const orderedFoodCollection = database.collection("orders")

        // get api to getting foods
        app.get("/foods", async (req, res) => {
            const cursor = foodsCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        });
        // get api for getting booked services
        app.get("/orders", async (req, res) => {
            const cursor = orderedFoodCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // get api for getting single food
        app.get("/foods/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const food = await foodsCollection.findOne(query);
            res.json(food);
        });
        // get api for only users order
        app.get("/usersorder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { uid: (id) };
            const cursor = await orderedFoodCollection.find(query);
            const foods = await cursor.toArray();
            res.json(foods);
        });
        // post api for adding services
        app.post("/addfood", async (req, res) => {
            const food = req.body;
            const result = await foodsCollection.insertOne(food);
            res.json(result);
        });
        // post api for ordering food
        app.post("/orderfood", async (req, res) => {
            const food = req.body;
            const result = await orderedFoodCollection.insertOne(food);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("server running")
});
app.listen(port, () => {
    console.log('====================================');
    console.log("server running on ", port);
    console.log('====================================');
})