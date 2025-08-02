import jwt from "jsonwebtoken";

// admin authentication middlewares

const authAdmin = async(req,res, next)=>{
try {
    
const {atoken} = req.headers
if(!atoken){
    return res.json({success:false, message:"Not Authoroized Login Again"})
}
const token_decod = jwt.verify(atoken,process.env.JWT_SECRET)

if(token_decod !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
    return res.json({success:false, message:"Not Authoroized Login Again"})
}
next()

} catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
}
}

export default authAdmin