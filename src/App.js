import { Route, Routes, BrowserRouter } from "react-router-dom";

import "./App.css";
import Login from "./components/Login";
import AuthProvider from "./Context/AuthProvider";
import ChatRoom from "./components/ChatRoom";
import AppProvider from "./Context/AppProvider";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteMemberModal from "./components/Modals/InviteMemberModal";
import EditRoomModal from "./components/Modals/EditRoomModal";
import LeaveRoomModal from "./components/Modals/LeaveRoomModel";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route element={<Login />} path="/login" />
            <Route element={<ChatRoom />} path="/" />
          </Routes>
          <AddRoomModal/>
          <InviteMemberModal/>
          <EditRoomModal/>
          <LeaveRoomModal/>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
