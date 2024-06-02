const {Schema, model}  = require('mongoose')

const DocumentSchema = Schema({
    _id:String,
    data:Object,
    password:{
        type:String,
        require:false
    }
})

module.exports = model('document',DocumentSchema)

