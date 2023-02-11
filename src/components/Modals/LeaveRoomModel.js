import React, { useContext } from 'react';
import { Form, Modal, Input } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { leaveRoom } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

export default function LeaveRoomModal() {
  const { isLeaveRoomVisible, setIsLeaveRoomVisible, selectedRoomId } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleOk = () => {
    // handle logic
    leaveRoom('rooms',selectedRoomId, uid)
    setIsLeaveRoomVisible(false);
  };

  const handleCancel = () => {
    setIsLeaveRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title='Bạn có chắc chắn rời phòng ?'
        visible={isLeaveRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
      </Modal>
    </div>
  );
}