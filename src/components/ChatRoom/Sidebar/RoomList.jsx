import React, { useState } from "react";
import { Collapse, Typography, Button, Avatar, Space } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "./../../../Context/AuthProvider";

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

export default function RoomList() {
  const {
    others,
    rooms,
    members,
    setIsAddRoomVisible,
    selectedContactId,
    setSelectedContactId,
    setSelectedRoomId,
    selectedRoomId,
  } = React.useContext(AppContext);
  const {
    user: { uid },
  } = React.useContext(AuthContext);
  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  return (
    <Space direction="vertical" style={{ width: "100%", padding: 12, gap: 0 }}>
      <Button
        // type="outlined"
        icon={<PlusSquareOutlined />}
        className="add-room"
        onClick={handleAddRoom}
      >
        Thêm phòng
      </Button>
      {others.map((user) => (
        <LinkStyled
          key={user.uid}
          onClick={() => {
            setSelectedContactId(user.uid);
            setSelectedRoomId("");
          }}
          style={{
            background: selectedContactId == user.uid ? "aliceblue" : "white",
          }}
        >
          {user.displayName}
        </LinkStyled>
      ))}
      <Collapse ghost defaultActiveKey={[1]}>
        <PanelStyled header="Danh Sách Phòng" key={1}>
          {rooms.map((room) => (
            <LinkStyled
              key={room.id}
              onClick={() => {
                setSelectedContactId("");
                setSelectedRoomId(room.id);
              }}
              style={{
                background: selectedRoomId == room.id ? "aliceblue" : "white",
              }}
              icon={
                room?.members.length == 1 ? (
                  <Avatar size="large" style={{ marginRight: 8 }}>
                    {room.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                ) : (
                  <AvatarGroup maxCount={1}>
                    {members?.map((member) => {
                      if (room.members.includes(member.uid)) {
                        return (
                          <Avatar src={member.photoURL}>
                            {member.photoURL
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
              {room.name}
            </LinkStyled>
          ))}
        </PanelStyled>
      </Collapse>
    </Space>
  );
}
