import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,  // when set to true it will show a loading skeleton for users
  isMessagesLoading: false,

  getUsers: async() => {

    set({isUsersLoading: true});
    try{
        const res = await axiosInstance.get("/messages/users");
        set({users: res.data, isUsersLoading: false});
        } 
    catch (error) {
            toast.error(error.response.data.message);
            set({isUsersLoading: false});
    }
    finally{
        set({isUsersLoading: false});
    }
  },

  getMessages: async(userId) => {
    set({isMessagesLoading: true});
    try{
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({messages: res.data});
        }
    catch (error) {
            toast.error(error.response.data.message);
            set({isMessagesLoading: false});
    }
    finally{
        set({isMessagesLoading: false});
    }
  },
  
  sendMessage: async(messageData) => {
    const {selectedUser, messages } = get();
    try{
      const res = await axiosInstance.post(`messages/send/${selectedUser._id}`, messageData); // newly created message
      set({messages: [...messages, res.data]}); // keep all prev msgs and the new one i.e res.data at the end
    }
    catch (error) {
            toast.error(error.response.data.message);
    }
  },
//// DELETE MESSAGE 
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      toast.success("Message deleted successfully");
      // Remove the message from the state after successful deletion
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    } catch (error) {
      toast.error("Error deleting message");
      console.error("Error deleting message:", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return; // Exit if no selected user

    const socket = useAuthStore.getState().socket; // get socket from authstore using zustand's getstate method

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {    // keep the event name exact as it is in the msgcontroller when emitted
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;

      // Only update if the message is from the selected user
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage], // // keep all the prev messages plus add the new message at the end
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },


  setSelectedUser:(selectedUser) => set({selectedUser}),

}));