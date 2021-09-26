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
      res.send('{"Respuesta":"Not Results"}');
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
      res.send('{"Respuesta":"Not Results"}');
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
      
      for (var i of results){
        var respuesta={
          "Respuesta":"True",
          "reg_academico": i.reg_academico,
          "nombre": i.nombre,
          "apellidos": i.apellidos,
          "contrasenia": i.contrasenia,
          "correo": i.correo
        }
        res.json(respuesta);
      }
      
    } else {
      res.send('{"Respuesta":"False"}');
    }
  });
});




//------------------------------Recuperar contraseña---------------------------------- 
app.post('/recuperar', (req, res) => {
  const id = req.body.cui;
  const email = req.body.email;
  const sql = `SELECT * FROM db_usuarios WHERE (reg_academico ='${id}'  AND correo= '${email}')`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      
      for (var i of results){
        var respuesta={
          "Respuesta":"True",
          "reg_academico": i.reg_academico,
          "nombre": i.nombre,
          "apellidos": i.apellidos,
          "contrasenia": i.contrasenia,
          "correo": i.correo
        }
        res.json(respuesta);
      }
      
    } else {
      res.send('{"Respuesta":"False"}');
    }
  });
});

app.put('/recuperar/:id', (req, res) => {

  const { id } = req.params;
  
  const sql1 = `SELECT * FROM db_usuarios WHERE reg_academico = ${id}`;
  connection.query(sql1, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      const password = req.body.password;
      const sql = `UPDATE db_usuarios SET  contrasenia='${password}' WHERE reg_academico =${id}`;

      connection.query(sql, error => {
        if (error) throw error;
        res.send('{"Respuesta":"Datos actualizados","Valor":"True"}');
      });
    } else {

      res.send('{"Respuesta":"No Results","Valor":"False"}');
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
      res.send('{"mensaje":"Usuario repetido", "data":"false"}');
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
        res.send('{"mensaje":"Usuario creado", "data":"true"}');
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
        res.send('{"Respuesta":"Datos actualizados"}');
      });
    } else {

      res.send('{"Respuesta":"No Results"}');
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
        res.send('{"Respuesta":"Usuario eliminado"}');
      });
    } else {

      res.send('{"Respuesta":"El usuario no existe"}');
    }
  });

});

//----------------------------Mostrar todos-----------------------------------
var profesor=[]
var curso=[]
function verificarProfesor(nombre) {
  for (var i of profesor){
    if (i==nombre){
      return true
    }  
  }
  return false
}
function verificarCurso(nombre) {
  for (var i of curso){
    if (i==nombre){
      return true
    }  
  }
  return false
}
app.get('/nombres', (req, res) => {
  const sql = 'SELECT * FROM  db_cursos';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      
      for (var i of results){
        var nombreProfesor=i.catedratico
          repetido = false;
          repetido=verificarProfesor(nombreProfesor);
          if (repetido==false){
            profesor.push(nombreProfesor);
          }
          var nombreCurso=i.nombre
          repetido = false;
          repetido=verificarCurso(nombreCurso);
          if (repetido==false){
            curso.push(nombreCurso);
          }

      }
      var respuesta ={
        "Profesores": profesor,
        "Cursos" : curso
      }
      res.json(respuesta);
    } else {
      res.send('{"Respuesta":"Not Results"}');
    }
  });
});


//------------------------------Crear Publicación---------------------------------- 
app.post('/publicaciones', (req, res) => {

  const sql = 'INSERT INTO db_publicaciones SET ?';

  const nuevo = {
    usuario: req.body.Usuario,
    nombre_publicacion: req.body.Nombre,
    mensaje: req.body.Mensaje,
    fecha: req.body.Fecha
  };

  connection.query(sql, nuevo, error => {
    if (error) throw error;
    res.send('{"Respuesta":"Publicación creada"}');
  });

});

//-------------------------Mostrar Todas las publicaciones-------------------------------
app.get('/publicaciones', (req, res) => {
  const sql = 'SELECT * FROM  db_publicaciones';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('{"Respuesta":"Not Results"}');
    }
  });
});



// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));