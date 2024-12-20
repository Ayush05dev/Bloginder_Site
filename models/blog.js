const  {Schema,model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'      // this is the name of user schema inside mongodb
    }
},{timestamps: true});

module.exports = model('blog', blogSchema);  // this is the name of collection inside mongodb