const express=require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const port=process.env.NODE_PORT;


const mongo = {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    cluster: process.env.MONGO_CLUSTER,
    database: process.env.MONGO_DB
};

(async () => {

    try {
        await mongoose.connect(`mongodb://${mongo.username}:${mongo.password}@${mongo.cluster}/${mongo.database}?ssl=true&replicaSet=atlas-dtg4qa-shard-0&authSource=admin&retryWrites=true&w=majority`,
           
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
    } catch (error) {
        return console.log(error)
    }
   
    const MovieSchema = new mongoose.Schema({
        title: String,
        genre: String,
    });
    const MovieModels = mongoose.model('movies', MovieSchema);

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended:true}))

    app.post('/movies', async (req, res) => {
        const data = req.body
        
        await MovieModels.create(data);
        return res.send('success insert new movies');
    })

        app.listen(port, () => console.log(`this app run at http://localhost:${port}`));
})()
