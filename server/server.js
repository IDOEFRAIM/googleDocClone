const mongoose = require('mongoose')
const Document = require('./doc.shema')

const defaultValue = ''
mongoose.connect('mongodb+srv://idoefraimtanka:g36lhtHVf1BNJKX4@cluster0.t1netab.mongodb.net/').then(()=>console.log('success'))
const io = require('socket.io')(5174,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})

io.on('connection',socket=>{
    console.log('connection')
    socket.on('get-document',async documentId=>{
        const document =await findOrCreate(documentId)
        socket.join(documentId)
        socket.emit('load-document',document.data)
        socket.on('send-changes',delta=>{
            socket.broadcast.to(documentId).emit('receive-changes',delta)
        })
        socket.on('save-document',async data=>{
            await Document.findByIdAndUpdate(documentId,data)
        })
    })

})

async function findOrCreate(id){
    if(!id) return
    const document = await Document.findById(id)
    if(document) return document
    console.log('doc',document)
    return await Document.create({_id:id,data:defaultValue})

}