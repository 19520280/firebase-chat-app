import React, { useState } from "react";
import { Collapse, Typography, Button } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../../Context/AppProvider";

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
  display: block;
  width: 100%;
  margin-bottom: 5px;
  color: #050505;
  text-align: left;
  border: none;
  box-shadow: none;
  :hover {
    background-color: aliceblue;
  }
`;

export default function RoomList() {
  const { rooms, setIsAddRoomVisible, setSelectedRoomId, selectedRoomId } =
    React.useContext(AppContext);
  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };
  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {rooms.map((room) => (
          <LinkStyled
            key={room.id}
            onClick={() => {
              setSelectedRoomId(room.id);
            }}
          >
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type="text"
          style={{
            color:'#1677ff',
            fontWeight:'500'
          }}
          icon={<PlusSquareOutlined />}
          className="add-room"
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
