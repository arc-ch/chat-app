import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";
// Zustand store to manage authentication state
export const useAuthStore = create((set, get) => ({

  authUser: null,                // Holds user information when authenticated
  isSigningUp: false,            // Tracks if the signup process is ongoing
  isLoggingIn: false,            // Tracks if the login process is ongoing
  isUpdatingProfile: false,      // Tracks if the profile is being updated
  isCheckingAuth: true,          // Tracks if the system is checking authentication status
  onlineUsers: [],               // A list of online users
  socket: null, 
  
  // Action to check the authentication status by calling the backend API
  checkAuth: async () => {
    try {
      const res  = await axiosInstance.get("/auth/check", {withCredentials: true});

      set({ authUser: res.data });
      get().connectSocket(); // If authenticated, connect to WebSocket
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      console.log(res.data);
      toast.success("Account created successfully");
      get().connectSocket(); // After successful sign-up, connect to socket
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket(); // ADD SOCKET
    } catch (error) {
      console.log(error.response.data.message);
    }
  },
  
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      console.log(res.data);
      toast.success("Logged in successfully");
      get().connectSocket(); // ADD SOCKET
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {authUser} = get(); // if authuser then only connect else return immediately
    if (!authUser || get().socket?.connected) return;  

    const socket = io (BASE_URL,
      {
        query: {
          userId: authUser._id,
        },
      }
    )
    socket.connect();
    set({ socket:socket }); 
    // after setting the state we can now listen for online user updates
    socket.on("getOnlineUsers",(userIds)=> {
      set({ onlineUsers: userIds });  // set the onlineUsers state with the received userIds
    })

  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect(); // If we are already connected then only disconnect
  },

}));
