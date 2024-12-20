const  {Schema,model } = require('mongoose');
const {createHmac, randomBytes} = require('crypto');
const{createTokenForUser, validateToken} = require('../service/authentication');

const userSchema = new Schema({
    fullName: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/userAvatar.jpg'
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    savedBlogs: [{
         type: Schema.Types.ObjectId,
        ref: 'Blog'
         }],
},{timestamps: true});


userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return ;

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt=salt;
    this.password=hashedPassword;
    next();
});

// virtual function to authenticate user

userSchema.static("matchPasswordAndGenerateToken", async function(email, password) {
    const user = await this.findOne({email});
    if(!user)  throw new Error('User not found');

    const salt =user.salt;
    const hashedPassword=user.password;

    const userProvidedPassword = createHmac('sha256', salt).update(password).digest('hex');
    if(hashedPassword !== userProvidedPassword)
        throw new Error('Invalid password');

    const token =createTokenForUser(user);
    return token;

});

const User = model('user', userSchema);  // User - for referencing in code , user - ref in mongodb
module.exports = User;