import React, {useState} from 'react';
import { Collapse, Typography, Button } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons';
//import { AppContext } from '../../../Context/AppProvider';

const { Panel } = Collapse;

let rooms = [
	{
		"id":"001",
		"name":"phong chat 001"
	},
	{
		"id":"002",
		"name":"phong chat 002"
	},
	{
		"id":"003",
		"name":"phong chat 003"
	},
	{
		"id":"004",
		"name":"phong chat 004"
	}
]

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;

export default function RoomList() {
//   const { rooms, setIsAddRoomVisible, setSelectedRoomId } =
//     React.useContext(AppContext);

  const handleAddRoom = () => {
    //setIsAddRoomVisible(true);
	console.log('AddRoom')
  };
  const [selectedRoomId, setSelectedRoomId] = useState()

  return (
    <Collapse ghost defaultActiveKey={['1']}>
      <PanelStyled header='Danh sách các phòng' key='1'>
        {rooms.map((room) => (
          <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type='text'
          icon={<PlusSquareOutlined />}
          className='add-room'
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
      </PanelStyled>
    </Collapse>
  );
}