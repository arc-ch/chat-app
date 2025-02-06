import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // we can access id from req.user because last step of protectRoute was req.user = user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); 
        //these will be displayed in sidebar and not the logged in one because thats the use itself

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

// Get messages between 2 diff users i.e me and other
export const getMessages = async (req,res) => { 

    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId}, //find all msgs which sender is me and receiver is someone else or 
                {senderId: userToChatId, receiverId: myId}  // vice versa
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}


// send messages
export const sendMessage = async(req,res) =>{

    try {
        const {text, image} = req.body;
        const{id: receiverId} = req.params; 
        const senderId = req.user._id;

        let imageurl;
        if(image){ // if user sends image upload it to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadResponse.secure_url;  // store the secured url in imageurl
        }
        // as img is handled now create a message i.e put it in db
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageurl,
        });
        await newMessage.save(); // when sending a message save it to db then emit it to the receiver 

        // todo: realtime functionality goes here using socket io
        // emit a new message event to the receiver's socket
        const receiverSocketId = getReceiverSocketId(receiverId);
         if (receiverSocketId) { 
             io.to(receiverSocketId).emit("newMessage", newMessage); // io.to targets a specific user, emit sends to all
            // now go to chatstore and listen for the "new message" event and update 
            }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendmessage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//// DELETE MESSAGE CONTROLLER 
export const deleteMessage = async (req, res) => {
    try {
      const { id: messageId } = req.params;
      const userId = req.user._id; // The logged-in user who wants to delete the message
  
      // Find the message in the database
      const message = await Message.findOne({ _id: messageId });
  
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
  
      // Ensure the message belongs to the logged-in user before deleting
      if (message.senderId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You can only delete your own messages" });
      }
  
      // Delete the message
      await Message.findByIdAndDelete(messageId);  // This deletes the message by its ID
  
      return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      console.log("Error in deleteMessage controller:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


  