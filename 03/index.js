
// Esta linea importa el modulo de Express.
// Requiere('express) carga el paquete de Express desde los modulos intalados con npm.
// Al ser ejecutada Express devuelve una instancia de una aplicación Express
const express = require('express');

// Se crea la instancia de la aplicación Express llamada por convención app.
// Esta instancia tiene todos los metodos necesarios para manejar rutas, middleware, peticiones y respuestas HTTP.
const app = express();

// Define el puerto en el que el servidor va a escuchar.
/* Se usa process.env.PORT para permitir que el puerto se defina desde una variable de entorno
 desde un archivo .env o por defecto utilizara el puerto 8080*/
const PORT = process.env.PORT || 8080;

// Variables
let frase = 'Frase inicial';

// Middlewares
app.use(express.json()); // 

// Rutas

// Se obtiene toda la frase
app.get('/api/frase', (req, res) => {
// respuesta de la frase con desestructuración.
  res.json({ frase });
});

// Se obtiene palabra buscada de acuerdo a posición.
app.get('/api/palabras/:pos', (req, res) => {
// se obtiene el params pos con desestructuración.
  const { pos } = req.params;
// Se parsea pos para que transforme a entero en caso de que usuario ingrese numero con decimal.
  let num = parseInt(pos);

// Validación: verifica si es numero entero, se lo contratio envia mensaje error de mala petición.
  if(isNaN(num)){
    return res.status(400).json({ error: 'El parámetro requerido debe ser un número válido'});
  }

// Divide el string en palabras y lo transforma en un array de palabras.
  const palabras = frase.split(' ');

/* Validación: si el numero entregado por usuario es menor a 1 y mayor a la cantidad de palabras 
que hay envia mensaje error mala petición.*/
  if(num < 1 || num > palabras.length) {
    return res.status(400).json({ error: 'El parámetro definido está fuera de rango'});
  }

// retorna la palabra buscada.
  return res.json({ buscada: palabras[num - 1]});
});

// Envia palabra desde cliente para agregarlo a frase
app.post('/api/palabras', (req, res) => {
// se obtiene dato ingresado de cliente con desestructuración.
  const { palabra } = req.body || {};

// Valida que el campo palabra tenga un dato, si no, lo solicita.
  if(!palabra){
    return res.status(400).json( {error: 'El campo palabra es requerido'});
  };

// Divide el string en palabras y lo transforma en un array de palabras.
  const palabras = frase.split(' ');

// Agrega la palabra entregada por cliente al array palabras.
  palabras.push(palabra);

// Se actuliza frase convirtiendo el array palabras en un string unidos por un espacio cada elemento.
  frase = palabras.join(' ');

// Se retorna el objeto con lo que se agrego (palabra) mas la frase completa.
  return res.json({ agregada: palabra, pos: palabras.length});
});


app.put('/api/palabras/:pos', (req, res) => {
// se obtiene el params pos con desestructuración.
  const { pos } = req.params;

// se obtiene dato ingresado de cliente con desestructuración.
  const { palabra } = req.body || {};

// Valida que el campo palabra tenga un dato, si no, lo solicita.
  if(!palabra){
    return res.status(400).json( {error: 'El campo palabra es requerido'});
  };

// Se parsea pos para que transforme a entero en caso de que usuario ingrese numero con decimal.
  let num = parseInt(pos);

// Validación: verifica si es numero entero, se lo contratio envia mensaje error de mala petición.
  if(isNaN(num)){
    return res.status(400).json({ error: 'El parámetro requerido debe ser un número válido'});
  };

// Divide el string en palabras y lo transforma en un array de palabras.
  const palabras = frase.split(' ');

/* Validación: si el numero entregado por usuario es menor a 1 y mayor a la cantidad de palabras 
que hay envia mensaje error mala petición.*/
  if(num < 1 || num > palabras.length) {
    return res.status(400).json({ error: 'El parámetro definido está fuera de rango'});
  };

// Se guarda la palabra a modificar en la variable para luego mostrarla como anterior.
  const palabraAModificar = palabras[num - 1];

// Se actualiza array de palabras 
  palabras[num - 1] = palabra;

// Se actuliza frase convirtiendo el array palabras en un string unidos por un espacio cada elemento.
  frase = palabras.join(' ');

// Se retorna la palabra atualizada y tambien la palabra anterior que estaba en esa misma posición.
  return res.json({ actualizada: palabra, anterior: palabraAModificar});

});

// app.listen(...) inicia el servidor y lo pone a escuchar en el puerto definido.
// El callback () => { ... } se ejecuta cuando el servidor se inicia con éxito.
// connectedServer es la referencia al servidor HTTP creado internamente, que es una instancia de http.Server.
const connectedServer = app.listen(PORT, () => {
  console.log(`El servidor esta activo y escuchando en el puerto ${PORT}....`);

});

// Se está manejando errores del servidor, por ejemplo si el puerto ya está en uso.
// Se escucha el evento 'error' sobre el servidor creado, y se imprime el mensaje del error.
connectedServer.on('error', (error) => {
  console.log(error.message);
});

