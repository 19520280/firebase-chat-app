import { Route, Routes, BrowserRouter } from "react-router-dom";

import "./App.css";
import Login from "./components/Login";
import AuthProvider from "./Context/AuthProvider";
import ChatRoom from "./components/ChatRoom";
import AppProvider from "./Context/AppProvider";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteMemberModal from "./components/Modals/InviteMemberModal";

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
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
