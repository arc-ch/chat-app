import jwt from "jsonwebtoken";

export const generatetoken = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, 
        { expiresIn: "7d"  //token expires in 7 days so user has to re login after 7 days
    });

    res.cookie("jwt", token, {
        httpOnly: true, //cookie can only be accessed by the server and not by the client and prevent XSS attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, //maxage has to be in MS =>  expiry= 7 days * 24 hrs * 60 min * 60 sec * 1000 ms 
        sameSite: "strict", // cookie can only be sent to the server and not to the client and prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development", //cookie can only be sent over https not http
        
    });

    return token 
    }


  