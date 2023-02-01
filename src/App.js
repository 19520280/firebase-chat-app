import { Route, Routes, BrowserRouter } from "react-router-dom";

import "./App.css";
import Login from "./components/Login";
import AuthProvider from "./Context/AuthProvider";
import ChatRoom from "./components/ChatRoom";
//import InviteMemberModal from "./components/Modals/InviteMemberModal";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<ChatRoom />} path="/" />
        </Routes>
        {/* <InviteMemberModal/> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
