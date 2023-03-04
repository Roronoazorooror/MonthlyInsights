const cron = require('node-cron');
const express = require('express')
const bodyParser = require('body-parser');

const app = express()
// const { Client } = require('pg');
// cron.schedule('* * * * *', () => {
//   console.log('Running cron job');
// });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.static('public'));
app.use('/',require('./routes/indexRoute.js'))

try {
    app.listen(4000,()=> console.log(`running at port 4000`))  
} catch (error) { 
    console.error(`Error starting server: ${err.message}`);
}
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(500).send('Internal Server Error');
  });