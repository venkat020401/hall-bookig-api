const express = require("express");
const app = express();
const mongodb = require("mongodb");
const dotenv = require("dotenv").config();
const mongoclient = mongodb.MongoClient;
const URL = process.env.DB;

app.use(express.json());

// Room details
app.get("/room-details", async (req, res) => {
    try {
        //DB connection
        const connection = await mongoclient.connect(URL);
        // select db
        const db = connection.db("hall-booking");
        // select collection
        const collection = db.collection("room_details");
        // do operations -  find
        const room_details = await collection.find().toArray();
        // close connection
        connection.close();
        res.json(room_details);
    } catch (error) {
        console.log(error);
        res.status(500).json({ messagae: "Something Went Wrong" });
    }

});
// Create room
app.post("/create-room", async (req, res) => {
    try {
        //DB connection
        const connection = await mongoclient.connect(URL);
        // select db
        const db = connection.db("hall-booking");
        // select collection
        const collection = db.collection("room_details");
        // do operations -  find
        const create_room = await collection.insertOne(req.body);
        connection.close();
        // close connection
        res.json({ message: "Room created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ messagae: "Something Went Wrong" });
    }

});

// Customer details
app.get("/customer-details", async (req, res) => {
    try {
        //DB connection
        const connection = await mongoclient.connect(URL);
        // select db
        const db = connection.db("hall-booking");
        // select collection
        const collection = db.collection("customer_details");
        // do operations -  find
        const customer_details = await collection.find().toArray();
        // close connection
        connection.close();
        res.json(customer_details);
    } catch (error) {
        console.log(error);
        res.status(500).json({ messagae: "Something Went Wrong" });
    }
});

// Booking
app.post("/booking/:id", async (req, res) => {
    try {
        //DB connection
        const connection = await mongoclient.connect(URL);
        // select db
        const db = connection.db("hall-booking");
        // select collection
        const collection = db.collection("room_details");
        // do operations -  find
        const booked = await collection.find({ _id: mongodb.ObjectId(req.params.id) }).toArray();
        if (booked[0].booking_status) {
            res.status(200).json({ messagae: "sorry it was already booked by someone" });
        }
        else {
            const booking = await collection.findOneAndUpdate({ _id: mongodb.ObjectId(req.params.id) }, { $set: { booking_status: true } });
            res.status(200).json({ messagae: "Booking successful Welcome you!" });
        }

        // close connection
        connection.close();
    } catch (error) {
        console.log(error);
        res.status(500).json({ messagae: "Something Went Wrong" });
    }
});

//booked room details
app.get("/booked-room-details", async (req, res) => {
    try {
        //DB connection
        const connection = await mongoclient.connect(URL);
        // select db
        const db = connection.db("hall-booking");
        // select collection
        const collection = db.collection("room_details");
        // do operations -  find
        const booked_room_details = await collection.find({ booking_status: true }).toArray();
        // close connection
        connection.close();
        res.json(booked_room_details);
    } catch (error) {
        console.log(error);
        res.status(500).json({ messagae: "Something Went Wrong" });
    }

});


app.listen(3000);