import Router from 'express';
import {registerUser, logout , login} from '../controllers/user.controller.js';
import  {upload}  from '../middlewares/multer.middleware.js';
import loggedout from '../middlewares/auth.middleware.js';



const router = Router();


router.route('/register').post(
    upload.fields(
       [
        {
            name : 'avatar',
            maxCount : 1
        },
        {
            name : 'coverImage',
            maxCount : 1
        }
       ]
    ),
    registerUser)


router.route('/login').post(login);


router.route('/logout').post(loggedout , logout)


export default router;