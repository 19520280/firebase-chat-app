import {
  CloseOutlined,
  PictureOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import firebase, { storage } from "../../../firebase/config";
import { addDocument, updateDocument } from "../../../firebase/services";

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2px 2px 2px 0;
  gap: 12px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0px;
    background-color: #e3e6eb;
    border-radius: 16px;
  }

  .img-input-container {
    padding: 12px;
  }

  .img-input {
    width: 52px;
    height: 52px;
    border-radius: 8px;
    position: relative;

    .image-container {
      position: relative;
      overflow: hidden;
      width: 52px;
      height: 52px;

      .image {
        object-fit: cover;
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }

    .close-button {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      transform: scale(1) translateX(40%) translateY(-40%);
    }
  }
`;
// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const InputMessage = () => {
  const { selectedRoomId, selectedRoom, users, members } =
    useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [imgURL, setImgURL] = useState(null);
  const [img, setImg] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      // Get this url from response in real world.
      getBase64(e.target.files[0], (url) => {
        setImgURL(url);
      });
      setImg(e.target.files[0]);
    }
  };

  const handleCancel = (e) => {
    setImgURL("");
    setImg(null);
  };

  const handleOnSubmit = () => {
    if (!inputValue && !img) return;

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log(error.message);
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("downloadURL", downloadURL);
            await addDocument("messages", {
              text: inputValue,
              imgURL: downloadURL,
              uid,
              photoURL,
              roomId: selectedRoom.id,
              displayName,
            });
          });
        }
      );
    } else {
      addDocument("messages", {
        text: inputValue,
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName,
      });
    }

    updateDocument(
      "rooms",
      {
        latestInteractionAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      selectedRoom.id
    );

    form.resetFields(["message"]);
    setInputValue("");
    setImgURL("");
    setImg(null);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };
  return (
    <FormStyled form={form}>
      <>
        <input
          type="file"
          style={{ display: "none" }}
          // hidden
          id="file"
          onChange={handleChange}
        />
        <label htmlFor="file">
          <PictureOutlined style={{ fontSize: "18px" }} />
        </label>
      </>

      <Form.Item name="message">
        <div>
          {imgURL ? (
            <div className="img-input-container">
              <div className="img-input">
                <Button
                  className="close-button"
                  icon={<CloseOutlined style={{ fontSize: "10px" }} />}
                  size="small"
                  shape="circle"
                  onClick={handleCancel}
                ></Button>
                <div className="image-container">
                  <img className="image" src={imgURL} />
                </div>
              </div>
            </div>
          ) : null}

          <Input
            ref={inputRef}
            onChange={handleInputChange}
            onPressEnter={handleOnSubmit}
            placeholder="Nhập tin nhắn..."
            bordered={false}
            autoComplete="off"
          />
        </div>
      </Form.Item>

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
