import React, { useState } from "react";
import {
  Collapse,
  Typography,
  Button,
  Avatar,
  Space,
  Spin,
  Select,
} from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "./../../../Context/AuthProvider";
import firebase, { db } from "../../../firebase/config";
import { debounce } from "lodash";
import { addDocument } from "../../../firebase/services";
import useFirestore from "../../../hooks/useFirestore";

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header {
      padding: 0;
    }
    ,
    .ant-collapse-header-text {
      color: #a7a7a7;
      font-weight: 500;
    }
    .ant-collapse-content-box {
    }
  }
`;

const SelectOption = styled(Select)`
  width: 100%;
  color: black;

  .ant-select-selector {
    background-color: #e3e6eb !important;
    border: none;
    border-radius: 16px;
  }
`;
const LinkStyled = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 68px;
  padding: 10px;
  color: #050505;
  font-weight: 500;
  text-align: left;
  border: none;
  box-shadow: none;

  :hover {
    background-color: aliceblue;
  }
`;

const AvatarGroup = styled(Avatar.Group)`
  position: relative;
  width: 48px;
  height: 48px;
  margin-right: 12px;

  .ant-avatar {
    width: calc(100% * (2 / 3));
    height: calc(100% * (2 / 3));
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-avatar-string {
    }
  }

  > :first-child {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
  }

  > :nth-child(2) {
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
  }
`;

function DebounceSelect({ fetchOptions, debounceTimeout = 100, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, props.uid).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions]);

  return (
    <SelectOption
      labelInValue
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL} style={{ marginRight: 6 }}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {`${opt.label}`}
        </Select.Option>
      ))}
    </SelectOption>
  );
}

export default function RoomList() {
  const {
    users,
    rooms,
    members,
    setIsAddRoomVisible,
    selectedContactId,
    setSelectedContactId,
    selectedContact,
    setSelectedRoomId,
    selectedRoomId,
  } = React.useContext(AppContext);
  const {
    user: { uid },
  } = React.useContext(AuthContext);
  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  const handleSelectPrivateRoom = (contactId) => {
    let searchedRoom = rooms.find(
      (room) =>
        room.isPrivateRoom &&
        room.members.includes(uid) &&
        room.members.includes(contactId)
    );
    if (!searchedRoom) {
      addDocument("rooms", {
        isPrivateRoom: true,
        latestInteractionAt: firebase.firestore.FieldValue.serverTimestamp(),
        members: [uid, contactId],
      });
    }

    searchedRoom = rooms.find(
      (room) =>
        room.isPrivateRoom &&
        room.members.includes(uid) &&
        room.members.includes(contactId)
    );
    setSelectedRoomId(searchedRoom.id);
  };

  async function fetchUserList(search, uid) {
    return db
      .collection("users")
      .where("keywords", "array-contains", search.toLowerCase())
      .orderBy("displayName")
      .limit(20)
      .get()
      .then((snapshot) => {
        return snapshot.docs
          .map((doc) => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
          }))
          .filter((opt) => opt.value != uid);
      });
  }
  console.log(rooms);
  return (
    <Space direction="vertical" style={{ width: "100%", padding: 12 }}>
      <DebounceSelect
        // label="Danh s??ch li??n h???"
        uid={uid}
        value={selectedContactId}
        placeholder="Nh???p t??n ng?????i tr?? chuy???n"
        fetchOptions={fetchUserList}
        onChange={(newValue) => {
          handleSelectPrivateRoom(newValue.value);
        }}
        // style={{
        //   width: "100%",
        // }}
      />
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          // type="outlined"
          icon={<PlusSquareOutlined />}
          className="add-room"
          onClick={handleAddRoom}
        >
          Th??m ph??ng
        </Button>
      </div>
      <div>
        {rooms
          .sort(
            (room1, room2) =>
              room2.latestInteractionAt - room1.latestInteractionAt
          )
          .map((room) => {
            const other = users.find(
              (user) =>
                user.uid === room.members.find((member) => member !== uid)
            );
            return (
              <LinkStyled
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                style={{
                  background: selectedRoomId == room.id ? "aliceblue" : "white",
                }}
                icon={
                  room.isPrivateRoom ? (
                    <Avatar
                      size="large"
                      src={other?.photoURL}
                      style={{ marginRight: 12 }}
                    >
                      {other?.photoURL
                        ? ""
                        : other?.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  ) : room?.members.length == 1 ? (
                    <Avatar size="large" style={{ marginRight: 12 }}>
                      {room.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  ) : (
                    <AvatarGroup maxCount={1}>
                      {members?.map((member) => {
                        if (room.members.includes(member.uid)) {
                          return (
                            <Avatar src={member?.photoURL} key={member.uid}>
                              {member?.photoURL
                                ? ""
                                : member.displayName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                          );
                        }
                      })}
                    </AvatarGroup>
                  )
                }
              >
                {room.isPrivateRoom ? other?.displayName : room.name}
              </LinkStyled>
            );
          })}
      </div>
    </Space>
  );
}
