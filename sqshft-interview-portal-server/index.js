const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')

const app = express()
app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));
const PORT =  parseInt(process.env.PORT) || 8080;

const InterviewRoute = require('./routes/interview.route');
app.use('/', InterviewRoute);

app.listen(PORT, () => {
    console.log('Server Started on PORT ' + PORT)
})

