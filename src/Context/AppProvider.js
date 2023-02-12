import React, { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [isEditRoomVisible, setIsEditRoomVisible] = useState(false);
  const [isLeaveRoomVisible, setIsLeaveRoomVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const {
    user: { uid },
  } = React.useContext(AuthContext);

  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);

  const rooms = useFirestore("rooms", roomsCondition);

  const selectedRoom = React.useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  const usersSelectedRoomCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const membersSelectedRoom = useFirestore("users", usersSelectedRoomCondition);

  const memberUidList = React.useMemo(() => {
    if (rooms.length > 0) {
      var memberList = [];
      rooms.map((room) => {
        memberList = memberList.concat(room.members);
      });

      return memberList;
    }
  }, [rooms]);

  const userCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: memberUidList,
    };
  }, [memberUidList]);

  const members = useFirestore("users", userCondition);

  const clearState = () => {
    setSelectedRoomId("");
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
    setIsEditRoomVisible(false);
    setIsLeaveRoomVisible(false);
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        membersSelectedRoom,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        isEditRoomVisible,
        setIsEditRoomVisible,
        isLeaveRoomVisible,
        setIsLeaveRoomVisible,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
