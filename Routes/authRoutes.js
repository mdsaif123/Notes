import express from "express"
import { registerController,logincontroller, testController, forgotPasswordController } from "../controller/registerController.js"
import { isAdmin, requireSignin } from "../middleware/authmiddleware.js";



//router object
const router=express.Router()


//routing
//Register|| method post
router.post("/register", registerController)

//Login Controller || method post
router.post("/login",logincontroller)

//forgot-password
router.post("/forgot-password",forgotPasswordController)

//test route
router.get("/test",requireSignin, testController)

//protected Route

router.get("/user-auth",requireSignin,(req,res)=>{
    res.status(200).send({ok:true})
})

//admin
router.get("/admin-auth",requireSignin, isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

export default router

