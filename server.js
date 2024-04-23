const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

let db;
async function connectToDb(){
    try{
        await client.connect();
        db = client.db('data');
        console.log('Connected to MongoDB');
        // const isMasterOutput = await db.command({ isMaster: 1 });//to check replica set of db.
        // console.log(isMasterOutput);
    }
    catch(err){
        console.error(err);
    }
}
connectToDb();

app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static('public')); Assuming CSS file is in a 'public' directory

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });


  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    

    console.log('Received login request:', { username, password });

    try {
        // Query the database for the provided username and password
        const user = await db.collection('userData').findOne({ Username: username, Password: password });
        console.log(user);
        if (user) {
            // Authentication successful
            console.log('Login successful for user:', username);
            res.redirect('\index.html'); // Redirect to home page after successful login
        } else {
            // Authentication failed
            console.log('Invalid credentials for user:', username);
            res.send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.send('Error during login');
    }
});
app.use(express.static(__dirname));

// app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});