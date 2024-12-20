const express = require('express');
const User = require('../models/user');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const blogSchema = require('../models/blog');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
    destination: async function(req, file, cb){
        try {
            const uploadPath = path.resolve(`public/uploads/${req.user._id}`); // Dynamic path based on user ID
            
            // Ensure the directory exists, creating it if necessary
            await fs.mkdir(uploadPath, { recursive: true });
      
            cb(null, uploadPath); // Pass the folder path to multer
          } catch (err) {
            console.error('Error creating directory:', err);
            cb(err); // Pass the error to multer for handling
          }
            },

    filename: function(req, file, cb){
        const filename =`${Date.now()}-${file.originalname}`;
        cb(null, filename)
    }
})

const upload = multer({storage: storage});



router.get('/add-new', (req, res) => {
    return res.render('addBlog',{
        user: req.user,
    
    })});


router.get('/:id', async(req, res) => {
    const blog = await blogSchema.findById(req.params.id).populate('createdBy');
    const comments= await Comment.find({blogId: req.params.id}).populate('createdBy').sort({createdAt: -1});
    const user = req.user ?await User.findById(req.user._id) : null;
    return res.render('blog',{
        blog,
        user: user,
        comments: comments
    })
})

router.post('/comment/:blogId', async(req, res) => {
    //console.log("req Body :" ,req.body)
    const {content} = req.body;
     await Comment.create({
        content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
   // console.log("Cooment Content :" ,content)
    return res.redirect(`/blog/${req.params.blogId}`);
})

router.post('/',upload.single('coverImage') , async(req, res) => {
    const {title, body} = req.body;
    const blog = await blogSchema.create({
        title,
        body,
        coverImageURL:`/uploads/${req.user._id}/${req.file.filename}` ,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;