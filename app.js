const express = require('express');
const app = express();
const puerto = process.env.PORT || 3003;
app.use(express.json())

// Arreglo de objeto de peliculas
let peliculas = [
    {id: 1, titulo: "Matrix", director: "Lana Wachowski, Lilly Wachowski", 
    añoLanzamiento: "1999", genero: "Acción", calificacion: "9.5"},
    {id: 2, titulo: "Terrifier", director: "Damien Leone", 
    añoLanzamiento: "2016", genero: "Terror/Suspenso", calificacion: "8"},
    {id: 3, titulo: "Sing Street", director: "John Carney", 
    añoLanzamiento: "2016", genero: "Comedia Romántica", calificacion: "9"}
];

// Obtener lista de todas las peliculas
app.get('/socios/v1/peliculas', (req, res)=>{
    // Verificar si existen peliculas
    if(peliculas.length > 0){
        res.status(200).json({
            estado: 1,
            mensaje: "Existen peliculas",
            peliculas: peliculas
        })
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "No existen peliculas",
            peliculas: peliculas
        })
    }
    // Si existen, mostrar estado y mensaje
})

// Obtener pelicula por su id
app.get('/socios/v1/peliculas/:id', (req, res)=>{
    // Solo una pelicula
    const id = req.params.id;
    // Programación Funcional
    const pelicula = peliculas.find(pelicula => pelicula.id == id)
    // Si se encontró una pelicula
    if(pelicula){
        res.status(200).json({
            estado: 1,
            mensaje: "Pelicula encontrada",
            pelicula: pelicula
        })
        
    } else {
        // No se encontró una pelicula
        res.status(404).json({
            estado: 0,
            mensaje: "No se encontró la pelicula",
            pelicula: {}
        })  
    }

    res.send('Mostrar una pelicula por su id');
})

// Agregar nueva pelicula
app.post('/socios/v1/peliculas', (req, res)=>{
    // Crear un recurso - pelicula
    // id = Generar un número aleatorio 
    // Nombre y descripción = Body
    const{titulo, director, añoLanzamiento, genero, calificacion} = req.body;
    const id = Math.round(Math.random()*1000);
    // Comprobar que el cliente(navegador) = usuario = programador
    if(titulo == undefined || director == undefined || añoLanzamiento == undefined
        || genero == undefined || calificacion == undefined){
        // Hay un error en la solicitud por parte del usuario
        res.status(400).json({
            estado: 0,
            mensaje: "BAD REQUEST - Favor de llenar los campos correctamente"
        })
    } else {
        // En javascript como agregar una nueva pelicula a un arreglo
        const pelicula = {id: id, titulo: titulo, director: director, añoLanzamiento: añoLanzamiento,
                            genero: genero, calificacion: calificacion};
        const longitudInicial = peliculas.length;
        peliculas.push(pelicula)
        if(peliculas.length > longitudInicial){
            // Si se agregó una pelicula todo OK
            res.status(201).json({
                estado: 1,
                mensaje: "Pelicula creada",
                pelicula: pelicula
            })
        } else {
            // Error del servidor al no poder crearse la pelicula
            res.status(500).json({
                estado: 0,
                mensaje: "Pelicula no creada por un error desconocido",
                pelicula: pelicula
            })
        }
    }
    res.send('Crear una pelicula');
})

// Actualizar una pelicula por su id
app.put('/socios/v1/peliculas/:id', (req, res)=>{
    // Actualizar un recurso - Actualizar una pelicula
    const {id} = req.params;
    const {titulo, director, añoLanzamiento, genero, calificacion} = req.body;
    if(titulo == undefined || director == undefined || añoLanzamiento == undefined
        || genero == undefined || calificacion == undefined)
    {
        res.status(400).json({
            estado: 0,
            mensaje: "Faltan parámetros en la solicitud"
        })
    }
    else
    {
        const posActualizar = peliculas.findIndex(pelicula => pelicula.id == id)
        if(posActualizar != -1)
        {
            // Si encontró la pelicula con el id buscado
            // Actualizar la pelicula
            peliculas[posActualizar].titulo = titulo;
            peliculas[posActualizar].director = director;
            peliculas[posActualizar].añoLanzamiento = añoLanzamiento;
            peliculas[posActualizar].genero = genero;
            peliculas[posActualizar].calificacion = calificacion;
            res.status(200).json({
                estado: 1,
                mensaje: "Pelicula actualizada",
                pelicula: peliculas[posActualizar]
            })            
        }
        else
        {
            // No se encontró la pelicula del id buscado
            res.status(404).json({
                estado: 0,
                mensaje: "Pelicula no encontrada"
            })
        }
    }
    res.send('Actualizar una pelicula por su id');
})

// Eliminar una pelicula por su id
app.delete('/socios/v1/peliculas/:id', (req, res)=>{
    const id = req.params.id;
    const peliculaToDelete = peliculas.find(pelicula => pelicula.id == id);
    // Verificar si la pelicula existe
    if (!peliculaToDelete) {
        return res.status(404).json({
            estado: 0,
            mensaje: "Pelicula no encontrada",
            pelicula: {}
        });
    }
    // Realizar la eliminación de la pelicula
    const indice = peliculas.indexOf(peliculaToDelete);
    peliculas.splice(indice, 1);

    res.status(200).json({
        estado: 1,
        mensaje: "Pelicula eliminada con éxito",
        pelicula: peliculaToDelete
    });
})

app.listen(puerto,()=>{
    console.log('Servidor corriendo en el puerto: ', puerto);
})
