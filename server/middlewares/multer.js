import multer from "multer";
const multerUploads = multer({
    limits:{
        fileSize:1024 * 1024 *5
    }
})

const singleAvatar = multerUploads.single("avatar")
const attachementsMulter = multerUploads.array("files",5)
export {multerUploads,singleAvatar,attachementsMulter}