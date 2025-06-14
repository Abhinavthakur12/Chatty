export const sampleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"]
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "saki THakur",
        _id: "2",
        groupChat: false,
        members: ["1", "2"]
    }
]

export const sampleUsers = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Abi Doe",
        _id: "1",
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "sai THakur",
        _id: "2",
    }
]

export const sampleNotifications = [
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "Abi Doe",
        },
        _id: "1",
    },
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "sai THakur",
        },
        _id: "2",
    }
]

export const sampleMessages = [
    {
        attachments: [{
            public_id: "afslfk",
            url: "https://www.w3schools.com/howto/img_avatar.png",
        }],
        content: "L*uda ka Message hai",
        _id: "sfnsdjkfsdnfkjsbnd",
        sender: {
            _id: "user._id",
            name: "Chaman ",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z",
    },
    {
        attachments: [{
            public_id: "afslfk2 ",
            url: "https://www.w3schools.com/howto/img_avatar.png",
        }],
        content: "L*uda 2ka Message hai",
        _id: "sfnsdjkfsdojjnfkjsbnd",
        sender: {
            _id: "akfljsklfj",
            name: "Chaman 2 ",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z",
    },
]

export const dashboardData = {
    users:[
        {
            name:"John doe",
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
            _id:"1",
            username:"john_doe",
            friends:20,
            groups:5
        },
        {
            name:"Jane Doe",
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
            _id:"2",
            username:"jane_doe",
            friends:30,
            groups:10
        },
    ],
    chats: [
        {
          name: "LabadBass Group",
          avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
          _id: "1",
          groupChat: false,
          members: [
            { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
            { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
          ],
          totalMembers: 2,
          totalMessages: 20,
          creator: {
            name: "John Doe",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
          },
        },
        {
          name: "L*Da Luston Group",
          avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
          _id: "2",
          groupChat: true,
          members: [
            { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
            { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
          ],
          totalMembers: 2,
          totalMessages: 20,
          creator: {
            name: "John Boi",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
          },
        },
      ],
      messages: [
        {
          attachments: [],
          content: "L*uda ka Message hai",
          _id: "sfnsdjkfsdnfkjsbnd",
          sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Chaman ",
          },
          chat: "chatId",
          groupChat: false,
          createdAt: "2024-02-12T10:41:30.630Z",
        },
    
        {
          attachments: [
            {
              public_id: "asdsad 2",
              url: "https://www.w3schools.com/howto/img_avatar.png",
            },
          ],
          content: "",
          _id: "sfnsdjkfsdnfkdddjsbnd",
          sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Chaman  2",
          },
          chat: "chatId",
          groupChat: true,
          createdAt: "2024-02-12T10:41:30.630Z",
        },
      ],
}