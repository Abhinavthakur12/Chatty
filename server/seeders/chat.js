import { faker, simpleFaker } from "@faker-js/faker";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";

const createSingleChats = async(numChats)=>{
    try {
        const users = await User.find().select("_id")
        const chatPromise = [];
        for(let i=0;i<users.length;i++){
            for(let j= i+1;j<users.length;j++){
                chatPromise.push(
                    Chat.create({
                        name:faker.lorem.words(2),
                        members:[users[i],users[j]]
                    })
                )
            }
        }
        await Promise.all(chatPromise)
        console.log("chat created succefully")
        process.exit()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
const createGroupChats = async(numChats)=>{
    try {
        const users = await User.find().select("_id")
        const chatsPromise = [];
        for(let i=0;i<numChats;i++){
            const numMembers = simpleFaker.number.int({min:3,max:users.length})
            const members = []
            for(let i=0;i<numMembers;i++){
                const randomIdx = Math.floor(Math.random() * users.length);
                const randomUser = users[randomIdx];
                if(!members.includes(randomUser)){
                    members.push(randomUser)
                }
            }
            const chat = Chat.create({
                groupChat:true,
                name:faker.lorem.word(1),
                members,
                creator:members[0],
            })
            chatsPromise.push(chat)
        }
        await Promise.all(chatsPromise);
        console.log("chats created succefully")
        process.exit();
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
};

const createMessages = async(numMessages)=>{
    try {
        const users = await User.find().select("_id")
        const chats = await Chat.find().select("_id")
        const messagePromise = [];
        for(let i=0;i<numMessages;i++){
            const randomUser = users[Math.floor(Math.random() * users.length())];
            const randomChat = chats[Math.floor(Math.random() * chats.length())];
            messagePromise.push(
                Message.create({
                    chat:randomChat,
                    sender:randomUser,
                    content:faker.lorem.sentence()
                })
            )
        }
        await Promise.all(messagePromise);
        console.log("Messages create succesfully")
        process.exit();
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

const createMessagesInAChat = async(chatId,numMessages)=>{
    try {
        const users = await User.find().select("_id")
        const messagesPromise = [];
        for(let i=0;i<numMessages;i++){
            const randomUser = users[Math.floor(Math.random() * users.length)];
            messagesPromise.push(
                Message.create({
                    chat:chatId,
                    sender:randomUser,
                    content:faker.lorem.sentence()
                })
            )
        }
        await Promise.all(messagesPromise)
        console.log("Messages created succefully")
        process.exit();
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
export {createSingleChats,createGroupChats,createMessages,createMessagesInAChat}