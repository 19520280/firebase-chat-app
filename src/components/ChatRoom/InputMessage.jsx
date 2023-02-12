import { SendOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useContext, useRef, useState } from "react";
import styled from "styled-components";
import firebase from "../../firebase/config";
import { addDocument, updateDocument } from "../../firebase/services";
import { AppContext } from "./../../Context/AppProvider";
import { AuthContext } from "./../../Context/AuthProvider";

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  // border: 1px solid rgb(230, 230, 230);

  .ant-form-item {
    flex: 1;
    margin-right: 8px;
    margin-bottom: 0px;
    background-color: #e3e6eb;
    border-radius: 16px;
  }
`;

const InputMessage = () => {
  const {
    selectedRoomId,
    selectedRoom,
    users,
    members,
    setIsInviteMemberVisible,
    setIsEditRoomVisible,
    setIsLeaveRoomVisible,
  } = useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [img, setImg] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    if (!inputValue) return;

    addDocument("messages", {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });
    updateDocument(
      "rooms",
      {
        latestInteractionAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      selectedRoom.id
    );

    form.resetFields(["message"]);
    setInputValue("");

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  return (
    <FormStyled form={form}>
      <Form.Item name="message">
        <Input
          ref={inputRef}
          onChange={handleInputChange}
          onPressEnter={handleOnSubmit}
          placeholder="Nhập tin nhắn..."
          bordered={false}
          autoComplete="off"
        />
      </Form.Item>
      <input
        type="file"
        style={{ display: "none" }}
        id="file"
        onChange={(e) => setImg(e.target.files[0])}
      />
      <Button
        type="primary"
        shape="circle"
        onClick={handleOnSubmit}
        icon={<SendOutlined />}
      />
    </FormStyled>
  );
};

export default InputMessage;
