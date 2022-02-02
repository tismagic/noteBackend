
const { application } = require('express')
const express = require('express')
const Note = require('./models/note')
require('dotenv').config()

const app = express()
const cors = require('cors')

app.use(express.static("build"))
app.use(cors())



app.use(express.json())
const requestLogger = (request, response, next) => {
    console.log('method', request.method);
    console.log('path', request.path);
    console.log("body:", request.body);
    console.log("---");
    next()
}
app.use(requestLogger)

// const mongoose = require('mongoose')
// const url = `mongodb+srv://fullstack:fullstack@cluster0.7t43h.mongodb.net/note-app?retryWrites=true&w=majority`
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//     content: String,
//     date: Date,
//     important: Boolean
// })

// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })

// const Note = mongoose.model('Note', noteSchema)

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    // res.json(notes)
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const note = notes.find(note=>note.id===id)
    // if(note){
    //     response.json(note)
    // }else{
    //     response.status(404).end()
    // }
    Note.findById(request.params.id).
        then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        // .catch(error=>{
        //     console.log(error);
        //     response.status(400).send({error: 'malformatted id'})
        // })
        .catch(error => next(error))
})



const generatedId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response, next) => {
    const body = request.body
    // if(!body.content){
    //     return response.status(400).json({
    //         error: 'content missing'
    //     })
    // }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note.save().then(savedNote => savedNote.toJSON())
        .then(savedAndFormattedNote => { response.json(savedAndFormattedNote) })
        .catch(error => next(error))
})

// test

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important
    }
    Note.findByIdAndUpdate(request.params.id, note, { new: false })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === "CastError" && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted idss' })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
