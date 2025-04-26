import { compare } from "bcrypt"
import {User} from "../models/user.js"
import {Chat} from "../models/chat.js"
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js"
import { TryCatch } from "../middlewares/error.js"
import { ErrorHandler } from "../utils/utility.js"
import {Request} from "../models/request.js"
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js"
import {getOtherMember} from "../lib/helper.js"
const newUser = TryCatch(async(req,res,next)=>{
  const {name,username,password,bio} = req.body
  let file = req.file;
  if(!file) return next(new ErrorHandler("Please upload avatar",400))
  const result = await uploadFilesToCloudinary([file])
  const avatar = {
    public_id:result[0].public_id,
    url:result[0].url
  }
const user = await User.create({
    name,
    username,
    bio,
    password, 
    avatar
  })
  
   sendToken(res,user,201,"User created")
})

// login user and save token 
const login = TryCatch( async(req,res,next)=>{
  try{
    let {username,password} = req.body;
    const user = await User.findOne({username}).select("+password")
    if(!user) return next(new ErrorHandler("Invalid username or password",404));
    const isMatch = await compare(password,user.password)
    if(!isMatch) return next(new ErrorHandler("Invalid credentials password or username",404));
     sendToken(res,user,201,`Welcome back buddy ${user.name}`)
  }catch(err){
    return next(err)
  }
  
  }
  )
const getMyProfile = TryCatch(async(req,res,next)=>{
  const user = await User.findById(req.user)
  if(!user) return next(new ErrorHandler("User not Found",404))
  res.status(200).json({
    success:true,
    user
  })
})
const logout = TryCatch(async(req,res)=>{
 return res.status(200).cookie("Chatty-token","",{...cookieOptions,maxAge:0}).json({
    success:true,
    message:"logout succesfully"
  })
})
const searchUser = TryCatch(async(req,res)=>{

  const {name=""} = req.query;
  const myChats = await Chat.find({groupChat:false,members:req.user});
  const allUsersFromMyChats = myChats.flatMap((chat)=>chat.members)
  const allUsersExceptMeAndFriends = await User.find({
    _id:{$nin:allUsersFromMyChats},
    name:{$regex:name, $options:'i'},
  })
  const users = allUsersExceptMeAndFriends.map(({_id,name,avatar})=>({
    _id,
    name,
    avatar:avatar.url
  }))
  return res.status(200).json({
     success:true,
     users
   })
 })

 const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;
  
  // Ensure req.user is an ID
  const senderId = req.user.toString();
  const receiverId = userId.toString();

  const request = await Request.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId }
    ]
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: senderId,
    receiver: receiverId
  });

  emitEvent(req, NEW_REQUEST, [receiverId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request sent"
  });
});


 const acceptFriendRequest = TryCatch(async(req,res,next)=>{
  const {requestId,accept} = req.body
  const request = await Request.findById(requestId)
  .populate("sender", "name")
  .populate("receiver", "name");
  console.log(request)
  if(!request) return next(new ErrorHandler("Request not found",404))
  if(request.receiver._id.toString() !== req.user.toString()){
    return next(new ErrorHandler("You are not authorize to accept the request",403))
  }
  if(!accept){
    await request.deleteOne()
    return res.status(200).json({
      success:true,
      message:"Friend Request Rejected"
    })
  }
  const members = [request.sender._id,request.receiver._id]
  await Promise.all([
    Chat.create({
      members,
      name:`${request.sender.name}-${request.receiver.name}`
    }),
    request.deleteOne()
  ])
  emitEvent(req,REFETCH_CHATS,members)
  return res.status(200).json({
     success:true,
     message:"Friend Request accepted",
     senderId:request.sender._id,
   })
 })

 const getMyNotifications = TryCatch(async(req,res)=>{
  const requests = await Request.find({receiver:req.user}).populate(
    "sender","name avatar"
  )
  const allRequests = requests.map(({_id,sender})=>({
    _id,sender:{
      _id:sender._id,
      name:sender.name,
      avatar:sender.avatar.url
    }
  }))
  return res.status(200).json({
    success:true,
    allRequests
  })
 })

 const getMyFriends = TryCatch(async(req,res)=>{
  const chatId = req.query.chatId;
  const chats = await Chat.find({
    members:req.user,
    groupChat:false,
  }).populate("members","name avatar")
  const friends = chats.map(({members})=>{
    const otherUser = getOtherMember(members,req.user);
    return {
      _id:otherUser._id,
      name:otherUser.name,
      avatar:otherUser.avatar.url
    }
  });

  if(chatId){
    const chat = await Chat.findById(chatId)
    const availableFriends = friends.filter((friend)=> !chat.members.includes(friend._id));
    return res.status(200).json({
      success:true,
      friends:availableFriends
    })
  }else{
    return res.status(200).json({
      success:true,
      friends
    });
  }
 })
export {login,newUser,getMyProfile,logout,searchUser,sendFriendRequest,acceptFriendRequest,getMyNotifications,getMyFriends};