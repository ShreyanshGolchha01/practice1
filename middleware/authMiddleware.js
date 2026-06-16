import jwt from 'jsonwebtoken';
export const authMiddleware = (req,res,next) => {
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token is in cookies if not in header
    if (!token && req.cookies) {
        token = req.cookies.accesstoken;
    }

    if(!token){
        const error = new Error("No token, authorization denied");
        error.status = 401;
        return next(error);
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        const error = new Error("Invalid token");
        error.status = 401;
        next(error);
    }
}
export default authMiddleware;