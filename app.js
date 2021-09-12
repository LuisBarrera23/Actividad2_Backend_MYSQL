const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');
const PORT=process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());

// MySql
/*const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpass',
    database: 'node20_mysql'
});*/

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));