const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log("provid password as arugment");
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.7t43h.mongodb.net/note-app?retryWrites=true&w=majority`
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is eary',
    date: new Date(),
    important: true
})

note.save().then(result=>{
    console.log('note saved');
    mongoose.connection.close()
})

// Note.find({}).then(result=>{
//     result.forEach(note => {
//         console.log(note);
//     })
//     mongoose.connection.close()
// })