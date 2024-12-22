require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const blog= require('./models/blog');
const User = require('./models/user');

const PORT = process.env.PORT || 8000;
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// console.log(process.env.MONGO_URL);
// mongoose.connect(process.env.MONGO_URL ).then(() => {
//   console.log('Connected to MongoDB');
// });

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));



app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));  // the cookie name is what we given at time of creation of cookie which is in user router file
app.use(express.static(path.resolve('./public')));  // as without this express can not statically serve anything as it also sees this as route


app.get('/', async (req, res) => { 
  const allBlogs = await blog.find({}).sort({createdAt: -1}).populate('createdBy');   
  const user = req.user ?await User.findById(req.user._id) : null;
    res.render('home',{
      user: user,
      blogs: allBlogs,
    });
    })

app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});