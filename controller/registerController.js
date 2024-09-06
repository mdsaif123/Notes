import userModels from "../Model/userModels.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import Jwt from "jsonwebtoken"

export const registerController = async (req, res) => {
    try {
        const { name,email, password, phone, address } = req.body;

        // Check if the user already exists
        const existinguser = await userModels.findOne({ email });

        // If the user already exists, send an error message
        if (existinguser) {
            return res.status(200).send({
                success: false, // This should be false since the registration didn't happen
                message: "User already registered, please login",
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user instance
        const user = new userModels({ name, email, phone, address, password: hashedPassword });

        // Save the user to the database
        await user.save();

        // Send a success response
        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        console.error("Error during registration:", error); // Log the error for debugging
        res.status(400).send({
            success: false,
            message: "Error in registration",
            error, // Optionally, send the error details to the client
        });
    }
};

//login controller
export const logincontroller=async(req,res)=>{
    try {
        const {email,password}=req.body
        //validation
        if(!email || !password){
            res.status(400).send({
                message:"Invalid username or password "
            })
        }
        //check user exist or not 
        const user=await userModels.findOne({email})
        if(!user){
             return res.status(400).send({
                success:false,
                message:"user not registered"
            })
        }
     
        //match hashed password or encrypted password
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"

            })
        }
 
       

        //token generate
        const token = await Jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(200).send({
            success:true,
            message:"Login successfully",
            user:{
               name:user.name,
               email:user.email,
               phone:user.phone,
               address:user.address,
               role:user.role,
            },
            token
        })

        
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"Error in login"
        })
        
    }
}
//testController

export const testController=async(req,res)=>{
    res.status(200).send({
        succes:true,
        message:"protected Route"
    })

}
 //forgot password
export const forgotPasswordController=async()=>{
try {
    const {email,answer,newPassword}=req.body
    if(!email || !answer|| newPassword){
        res.status(400).send({message:"all Fiels ae required"})
    }

    //chcek email or password

    const user=await userModels.findOne({email,answer})

    //validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:'wrong email or answer'

        })
    }

    const hashed=await hashPassword(newPassword)
    await userModels.findByIdAndUpdate(user._id,{password:hashed})
    res.status(200).send({
        success:true,
        message:"password Changed Successfully"
    })
    
} catch (error) {
    console.log(error)
    // res.status(500).send({
    //     success:false,
    //     message:"Something wrong",
        
    // })
    
}

 }
