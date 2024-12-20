//here this is a generic function that can be used to check for authentication cookie in any route
const {validateToken} = require('../service/authentication');
function checkForAuthenticationCookie(cookieName){
    return (req, res, next)=>{ 
        const tokenCookieValue=req.cookies[cookieName];
        //console.log("Token Cookie Value",tokenCookieValue)
        if(!tokenCookieValue){
           return next();
        }
        try{
          const userPayload=validateToken(tokenCookieValue);
          req.user=userPayload;
         // console.log("Try",req.user)  
        } 
        catch(error){
            console.log("There is some error")
            //console.log("req.user in catch ",req.user)
        }  
       return next();   
    }
       
}

module.exports={
    checkForAuthenticationCookie,
}
