import React, { useContext } from 'react';
import { Form, Modal, Input } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { updateDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

export default function EditRoomModal() {
  const { isEditRoomVisible, setIsEditRoomVisible, selectedRoomId } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleOk = () => {
    // handle logic
    // add new room to firestore
    updateDocument('rooms', { ...form.getFieldsValue() }, selectedRoomId);
    // reset form value
    form.resetFields();

    setIsEditRoomVisible(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsEditRoomVisible(false);
  };

  return (
    <div>
      <Modal
        title='Sửa tên phòng'
        visible={isEditRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout='vertical'>
          <Form.Item label='Tên phòng' name='name'>
            <Input placeholder='Nhập tên phòng' />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea placeholder='Nhập mô tả' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}