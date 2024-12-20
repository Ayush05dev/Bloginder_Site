const {Router}=require('express');
const User =require('../models/user');
const Blog=require('../models/blog');
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const mongoose = require('mongoose');

const router = Router();

router.get("/signin", (req, res) => {
    res.render('signin');
}); 

router.get("/signup", (req, res) => {
    res.render('signup');
}); 

router.post("/signup", async(req, res) => {
    const {fullName, email, password} = req.body;
    const user = await User.create({
        fullName, 
        email, 
        password
    });

   return  res.redirect('/user/signin');
});

router.get('/dashboard/:id/edit', async (req, res) => {
    try{
        const user=await User.findById(req.params.id);
    const user2=await User.findById(req.user._id);
    if(user2._id.toString() === user._id.toString()){
        return res.render('dashboardEdit',{
            user,

        });
   }
   else{
        throw new Error("You are not authorized to edit this user");
}
    }
    catch(e){
        res.status(403).render('error', {
            message: "You can not have permission to do that", 
        });
    }
    
});


router.get('/dashboard/:id', async (req, res) => {
    
    try{
        const user=await User.findById(req.params.id);
        const user2=await User.findById(req.user._id);
        const savedBlogs = await Blog.find({ _id: { $in: user.savedBlogs } });
    //  console.log("User",user);
    let authorize=false;
        const userblogs= await Blog.find({createdBy: req.params.id});
        if(user2._id.toString() !== user._id.toString()){
            authorize=false
        }
        else{
            authorize=true
    
}

return res.render('dashboard',{
    user,
    userblogs,
    authorize,
    savedBlogs
});
}

catch(e){
    res.status(500).render('error', {
        message: "There was an issue loading your dashboard or the user don't exist. Please try again later.", // Optional, you can omit this for security reasons
    });
}
});

const storage = multer.diskStorage({
    destination: async function(req, file, cb){
        try {
            console.log("User here in multer",req.user)
            const uploadPath = path.resolve(`public/images/${req.user._id}`); // Dynamic path based on user ID
            
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


router.post('/dashboard/:id',upload.single('profileImageURL'), async (req, res) => {
    try{
        const user=await User.findById(req.params.id);
        const user2=await User.findById(req.user._id);
        if(user2._id.toString() !== user._id.toString()){
            throw new Error("You are not authorized to edit this user");
        }
            
    const {fullName } = req.body;
    const user1 = await User.findByIdAndUpdate(req.params.id, {
        profileImageURL:`/images/${req.user._id}/${req.file.filename}`,
        fullName
    });
    return res.redirect(`/user/dashboard/${req.params.id}`);
}
catch(e){
    res.status(403).render('error', {
        message: "You can not have permission to do that", 
    });
}
});


// router.post('/toggle-save/:blogId', async (req, res) => {
//     try {
//         const userId = req.user._id; // Get logged-in user ID
//         const blogId = req.params.blogId; // Blog ID from URL

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
        
//         // Check if the blog is already saved
//         const isSaved = user.savedBlogs.includes(blogId);
//         console.log("is Saved",isSaved);
//         if (isSaved) {
//             // Remove the blog from savedBlogs
//             user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== blogId);
//         } else {
//             // Add the blog to savedBlogs
//             console.log("Hi")
//             user.savedBlogs.push(new mongoose.Types.ObjectId(blogId));
//         }
//         console.log("Hi2")
//         await user.save()

//         console.log("Hi3")
//         // Send JSON response with the new state
//         res.json({ saved: !isSaved });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while toggling save status' });
//     }router.post('/toggle-save/:blogId', async (req, res) => {
//         try {
//             const userId = req.user._id; // Get logged-in user ID
//             const blogId = req.params.blogId; // Blog ID from URL
    
//             const user = await User.findById(userId);
    
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }
    
//             // Check if the blog is already saved
//             const isSaved = user.savedBlogs.includes(blogId);
//             console.log("is Saved", isSaved);
    
//             if (isSaved) {
//                 // Remove the blog from savedBlogs
//                 user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== blogId);
//             } else {
//                 // Add the blog to savedBlogs
//                 console.log("Hi");
//                 user.savedBlogs.push(new mongoose.Types.ObjectId(blogId));
//             }
    
//             console.log("Hi2");
    
//             // Try saving user and logging the success or error
//             try {
//                 await user.save();
//                 console.log("Hi3");
//                 res.json({ saved: !isSaved });
//             } catch (saveError) {
//                 console.error("Error saving user:", saveError);
//                 res.status(500).json({ message: 'Error saving user' });
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: 'An error occurred while toggling save status' });
//         }
//     });
    
// });


// router.post('/toggle-save/:blogId', async (req, res) => {
//     try {
//         const userId = req.user._id; // Get logged-in user ID
//         const blogId = req.params.blogId; // Blog ID from URL

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the blog is already saved
//         const isSaved = user.savedBlogs.includes(blogId);
//         console.log("is Saved", isSaved);

//         if (isSaved) {
//             // Remove the blog from savedBlogs
//             user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== blogId);
//         } else {
//             // Add the blog to savedBlogs
//             console.log("Hi");
//             user.savedBlogs.push(new mongoose.Types.ObjectId(blogId));
//         }

//         console.log("Hi2");

//         // Try saving user and logging the success or error
//         await user.save()

//             console.log("Hi3");
//             res.json({ saved: !isSaved });
       
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while toggling save status' });
//     }
// });

router.post('/toggle-save/:blogId', async (req, res) => {
    try {
        const userId = req.user._id; // Get logged-in user ID
        const blogId = req.params.blogId; // Blog ID from URL

        // Find the user and toggle the blog's save status in one step
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the blog is already saved
        const isSaved = user.savedBlogs.includes(blogId);

        // Update using `findByIdAndUpdate`
        const updateOperation = isSaved 
            ? { $pull: { savedBlogs: blogId } } // Remove blog ID
            : { $addToSet: { savedBlogs: blogId } }; // Add blog ID (avoids duplicates)

        // Update the user's savedBlogs in the database
        await User.findByIdAndUpdate(userId, updateOperation, { new: true });

        // Respond with the new save status
        res.json({ saved: !isSaved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while toggling save status' });
    }
});


router.post("/signin", async(req, res) => {
    const {email, password} = req.body;
  try{
    const token= await User.matchPasswordAndGenerateToken(email, password)
   // console.log("Token",token);
   //const redirectTo = req.query.redirectTo || '/';
     return res.cookie("token",token).redirect('/');
  }
  catch(error){
    // console.error('Error during sign-in:', error); // Log the error for debugging
    return res.render("signin",{
        
        error: "Incorrect email or password"
    });
  }
});

// for logout you just have to clear the cookie

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect('/');
});



module.exports = router;