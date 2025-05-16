import {body,validationResult,check, param} from "express-validator"
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req,res,next)=>{
    const errors = validationResult(req)
    const errorMessages = errors.array().map((error)=>error.msg).join(" ,");
    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages,400))
}
const registerValidator = ()=>[
    body("name","Please Enter name").notEmpty(),
    body("username","Please Enter Username").notEmpty(),
    body("bio","Please Enter bio").notEmpty(),
    body("password","Please Enter password").notEmpty()
];
const loginValidator = ()=>[
    body("username","Please Enter Username").notEmpty(),
    body("password","Please Enter password").notEmpty(),
];
const newGroupValidator = ()=>[
    body("name","Please Enter name").notEmpty(),
    body("members","please enter members").notEmpty().withMessage("Please Enter members").isArray({min:2,max:100}).withMessage("Membes between 2-100"),
]

const addMemberValidator = ()=>[
    body("chatId","Please Enter chadt ID").notEmpty(),
    body("members","please enter members").notEmpty().withMessage("Please Enter members").isArray({min:1,max:97}).withMessage("Membes between 1-97"),
];

const removeMemberValidator = ()=>[
    body("userId","Please Enter user ID").notEmpty(),
    body("chatId","Please Enter chat ID").notEmpty(),
];


const sendAttachmentsValidator = ()=>[
    body("chatId","Please Enter chat ID").notEmpty(),
]

const chatIdValidator = ()=>[
    param("id","Please enter chat id").notEmpty()
]

const renameValidator = ()=>[
    param("id","Please enter chat id").notEmpty(),
    body("name","Please Enter name").notEmpty(),
]

const sendRequestValidator = ()=>[
    body("userId","please enter userId").notEmpty()
]

const acceptRequestValidator = ()=>[
    body("requestId","Please enter request Id").notEmpty(),
    body("accept").notEmpty().withMessage("Please add Accept").isBoolean().withMessage("Accept must be Boolean")
]

const adminLoginValidator = ()=>[
    body("secretKey","Please enter secret key").notEmpty()
]
export {registerValidator,loginValidator,validateHandler,newGroupValidator,addMemberValidator,removeMemberValidator,sendAttachmentsValidator,chatIdValidator,renameValidator,sendRequestValidator,acceptRequestValidator,adminLoginValidator}