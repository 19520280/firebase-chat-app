import React, { useState } from "react";
import { Collapse, Typography, Button, Avatar, Space, Spin, Select } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "./../../../Context/AuthProvider";
import firebase, { db } from "../../../firebase/config"
import { debounce } from "lodash";
import { addDocument } from "../../../firebase/services";
import useFirestore from "../../../hooks/useFirestore";

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: #050505;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: #050505;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 68px;
  padding: 10px;
  margin-bottom: 8px;
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
  margin-right: 8px;

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
    <Select
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
    </Select>
  );
}

export default function RoomList() {
  const { users, rooms, members, 
    setIsAddRoomVisible, 
    selectedContactId, setSelectedContactId, selectedContact,
    setSelectedRoomId, selectedRoomId 
  } = React.useContext(AppContext);
  const {
    user: { uid },
  } = React.useContext(AuthContext);
  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  const handleSelectPrivateRoom = (contactId) => {
    let searchedRoom = rooms.find((room) => 
      room.members.includes(uid) && room.members.includes(contactId) && room.members.length === 2);
    if (!searchedRoom)
    {
      addDocument("rooms", {
        isPrivateRoom: true,
        latestInteractionAt: firebase.firestore.FieldValue.serverTimestamp(),
        members: [uid, contactId]
      });
    }

    searchedRoom = rooms.find((room) => 
      room.members.includes(uid) && room.members.includes(contactId) && room.members.length === 2);
    setSelectedRoomId(searchedRoom.id);
  }

  async function fetchUserList(search, uid) {
    return db
      .collection("users")
      .where("keywords", "array-contains", search)
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

  return (
    <Space direction="vertical" style={{ width: "100%", padding: 12 }}>
      <DebounceSelect
        label="Danh sách liên hệ"
        uid={uid}
        value={selectedContactId}
        placeholder="Nhập tên người trò chuyện"
        fetchOptions={fetchUserList}
        onChange={(newValue) => {
          handleSelectPrivateRoom(newValue.value);
        }}
        style={{ width: "100%" }}
      />
      {rooms
      .sort((room1, room2) => room2.latestInteractionAt - room1.latestInteractionAt)
      .map((room) => 
      {
        const other = users.find((user) => user.uid === room.members.find((member) => member !== uid));
        return (
        <LinkStyled
          key={room.id}
          onClick={() => setSelectedRoomId(room.id)}
          style={{
            background: selectedRoomId == room.id ? "aliceblue" : "white",
          }}
          icon={ room.isPrivateRoom ? (
            <Avatar size="large" src={other.photoURL}>
              {other.photoURL ? "" : other.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          ) : (
            <AvatarGroup maxCount={1}>
              {members.map((member) => {
                if (member.uid !== uid) {
                  return (
                    <Avatar src={member.photoURL}>
                      {member.photoURL ? "" : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  );
                }
              })}
            </AvatarGroup>
          )}
        >
          {room.isPrivateRoom ? other.displayName : room.name}
        </LinkStyled>
      )})}
    <Button
      // type="outlined"
      icon={<PlusSquareOutlined />}
      className="add-room"
      onClick={handleAddRoom}
    >
      Thêm phòng
    </Button>
    </Space>
  );
}
