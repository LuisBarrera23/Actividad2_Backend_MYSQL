const express = require('express');
var cors = require('cors')
const mysql = require('mysql');

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors())
app.use(bodyParser.json());

// MySql
const connection = mysql.createConnection({
  host: 'bveqykxdmvdy8lcdb6bh-mysql.services.clever-cloud.com',
  user: 'uj99eg6zhlmwcvfs',
  password: 'HrGVm7IDGqidCb23VUsD',
  database: 'bveqykxdmvdy8lcdb6bh'
});
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});
//-------------------------Mostrar Todos-------------------------------
app.get('/usuarios', (req, res) => {
  const sql = 'SELECT * FROM  db_usuarios';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

//--------------------------Mostrar Solo uno--------------------------------
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM db_usuarios WHERE reg_academico = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('Not result');
    }
  });
});


//--------------------------Inicio de sesión--------------------------------
//--------------------------adios xd--------------------------------
app.post('/inicio', (req, res) => {
  const id = req.body.cui;
  const contra = req.body.password;
  const sql = `SELECT * FROM db_usuarios WHERE (reg_academico ='${id}'  AND contrasenia= '${contra}')`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
      res.send('{"Respuesta":"Rodolfo Morales"}');
      
    } else {
      res.send('{"Respuesta":"Datos incorrectos"}');
    }
  });
});

//------------------------------Registro---------------------------------- 
app.post('/registro', (req, res) => {

  const id = req.body.cui;
  const sql1 = `SELECT * FROM db_usuarios WHERE reg_academico = ${id}`;
  connection.query(sql1, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.send('{"Respuesta":"Usuario repetido"}');
    } else {
      const sql = 'INSERT INTO db_usuarios SET ?';

      const nuevo = {
        reg_academico: req.body.cui,
        nombre: req.body.name,
        apellidos: req.body.lastname,
        contrasenia: req.body.password,
        correo: req.body.email
      };

      connection.query(sql, nuevo, error => {
        if (error) throw error;
        res.send('{"Respuesta":"Usuario creado"}');
      });

    }
  });





});

//------------------------------------Actualizar-------------------------------
app.put('/actualizar/:id', (req, res) => {

  const { id } = req.params;

  const sql1 = `SELECT * FROM db_usuarios WHERE reg_academico = ${id}`;
  connection.query(sql1, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      const { name, lastname, password, email } = req.body;
      const sql = `UPDATE db_usuarios SET  nombre = '${name}', apellidos='${lastname}' , contrasenia='${password}', correo='${email} ' WHERE reg_academico =${id}`;

      connection.query(sql, error => {
        if (error) throw error;
        res.send('Dato actualizado ;v!');
      });
    } else {

      res.send('El usuario no existe');
    }
  });


});
//---------------------------------------Eliminar---------------------------------
app.delete('/eliminar/:id', (req, res) => {


  const { id } = req.params;

  const sql1 = `SELECT * FROM db_usuarios WHERE reg_academico = ${id}`;
  connection.query(sql1, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      const sql = `DELETE FROM db_usuarios WHERE reg_academico= ${id}`;

      connection.query(sql, error => {
        if (error) throw error;
        res.send('Dato eliminado');
      });
    } else {

      res.send('El usuario no existe');
    }
  });

});





// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));