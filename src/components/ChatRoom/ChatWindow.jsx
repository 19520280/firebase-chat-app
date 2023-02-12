import {
  SendOutlined,
  UserAddOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Tooltip, Avatar, Form, Input, Alert, Divider } from "antd";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import { addDocument, updateDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import { isSameDate, formatDate } from "../../utils/formatDate";
import firebase from "../../firebase/config";

// export default function ChatWindow() {
//   const {  selectedContactId, selectedContact,
//     selectedRoomId, selectedRoom,
//     membersSelectedRoom, setIsInviteMemberVisible,
//     setIsEditRoomVisible, setIsLeaveRoomVisible  } =
//     useContext(AppContext);

//   const {
//     user: { uid, photoURL, displayName },
//   } = useContext(AuthContext);

//   const [inputValue, setInputValue] = useState("");
//   const [form] = Form.useForm();
//   const inputRef = useRef(null);
//   const messageListRef = useRef(null);

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleOnSubmit = () => {
//     addDocument("messages", {
//       text: inputValue,
//       uid,
//       photoURL,
//       roomId: selectedRoom.id,
//       displayName,
//     });

//     form.resetFields(["message"]);

//     // focus to input again after submit
//     if (inputRef?.current) {
//       setTimeout(() => {
//         inputRef.current.focus();
//       });
//     }
//   };

//   const condition = React.useMemo(
//     () => ({
//       fieldName: "roomId",
//       operator: "==",
//       compareValue: selectedRoom.id,
//     }),
//     [selectedRoom.id]
//   );

//   const messages = useFirestore("messages", condition);

//   useEffect(() => {
//     // scroll to bottom after message changed
//     if (messageListRef?.current) {
//       messageListRef.current.scrollTop =
//         messageListRef.current.scrollHeight + 50;
//     }
//   }, [messages]);

//   return (
//     <WrapperStyled>
//       {selectedRoom.id ? (
//         <>
//           <HeaderStyled>
//             <div className="header__info">
//               <p className="header__title">{selectedRoom.name}</p>
//               <span className="header__description">
//                 {selectedRoom.description}
//               </span>
//             </div>
//             <ButtonGroupStyled>
//               <Button
//                 icon={<EditOutlined />}
//                 type="text"
//                 onClick={()=> setIsEditRoomVisible(true)}
//               >
//                 Đổi tên phòng
//               </Button>
//               <Button
//                 icon={<LogoutOutlined />}
//                 type="text"
//                 onClick={()=> setIsLeaveRoomVisible(true)}
//               >
//                 Rời phòng
//               </Button>
//               <Button
//                 icon={<UserAddOutlined />}
//                 type="text"
//                 onClick={() => setIsInviteMemberVisible(true)}
//               >
//                 Mời
//               </Button>
//               <Avatar.Group size="small" maxCount={2}>
//                 {membersSelectedRoom.map((member) => (
//                   <Tooltip title={member.displayName} key={member.id}>
//                     <Avatar src={member.photoURL}>
//                       {member.photoURL
//                         ? ""
//                         : member.displayName?.charAt(0)?.toUpperCase()}
//                     </Avatar>
//                   </Tooltip>
//                 ))}
//               </Avatar.Group>
//             </ButtonGroupStyled>
//           </HeaderStyled>
//           <ContentStyled>
//             <MessageListStyled ref={messageListRef}>
//               {messages.map((mes, index) => {
//                 return (
//                   <div key={mes.id}>
//                     {messages[index - 1] !== undefined ? (
//                       !isSameDate(
//                         messages[index - 1].createdAt?.seconds,
//                         mes.createdAt?.seconds
//                       ) ? (
//                         <DividerMessage plain>
//                           {formatDate(mes.createdAt?.seconds, "PPPP")}
//                         </DividerMessage>
//                       ) : null
//                     ) : null}
//                     <Message
//                       key={mes.id}
//                       text={mes.text}
//                       photoURL={mes.photoURL}
//                       displayName={mes.displayName}
//                       createdAt={mes.createdAt}
//                       myMess={uid === mes.uid}
//                     />
//                   </div>
//                 );
//               })}
//             </MessageListStyled>
//             <FormStyled form={form}>
//               <Form.Item name="message">
//                 <Input
//                   ref={inputRef}
//                   onChange={handleInputChange}
//                   onPressEnter={handleOnSubmit}
//                   placeholder="Nhập tin nhắn..."
//                   bordered={false}
//                   autoComplete="off"
//                 />
//               </Form.Item>
//               <Button
//                 type="primary"
//                 shape="circle"
//                 onClick={handleOnSubmit}
//                 icon={<SendOutlined />}
//               />
//             </FormStyled>
//           </ContentStyled>
//         </>
//       ) : (
//         <Alert
//           message="Hãy chọn phòng"
//           type="info"
//           showIcon
//           style={{ margin: 5 }}
//           closable
//         />
//       )}
//     </WrapperStyled>
//   );
// }

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
  display: block;
  overflow-x: hidden;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 12px;
  justify-content: flex-end;
`;

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

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
  padding: 12px 16px 12px 12px;
`;

const DividerMessage = styled(Divider)`
  .ant-divider-inner-text {
    color: #a7a7a7;
    font-size: 12px;
    font-weight: 500;
  }
`;

export default function ChatWindow() {
  const {
    selectedRoomId, selectedRoom, 
    users, members, setIsInviteMemberVisible,
    setIsEditRoomVisible, setIsLeaveRoomVisible 
  } = useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    if (!inputValue) return;

    addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });
    updateDocument('rooms', { 
      latestInteractionAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, selectedRoom.id);

    form.resetFields(["message"]);
    setInputValue("");

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const other = users.find((user) => user.uid === selectedRoom?.members?.find((member) => member !== uid));

  const condition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore('messages', condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {(!selectedRoom.id) ? (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      ) : (
        <>
        {
          selectedRoom.isPrivateRoom ? (
            <HeaderStyled>
              <div className='header__info'>
                <p className='header__title'>{other.displayName}</p>
              </div>
            </HeaderStyled>
          ) : (
            <HeaderStyled>
              <div className="header__info">
                <p className="header__title">{selectedRoom.name}</p>
                <span className="header__description">
                  {selectedRoom.description}
                </span>
              </div>
              <ButtonGroupStyled>
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => setIsEditRoomVisible(true)}
                >
                  Đổi tên phòng
                </Button>
                <Button
                  icon={<LogoutOutlined />}
                  type="text"
                  onClick={() => setIsLeaveRoomVisible(true)}
                >
                  Rời phòng
                </Button>
                <Button
                  icon={<UserAddOutlined />}
                  type="text"
                  onClick={() => setIsInviteMemberVisible(true)}
                >
                  Mời
                </Button>
                <Avatar.Group size="small" maxCount={2}>
                  {members.map((member) => (
                    <Tooltip title={member.displayName} key={member.id}>
                      <Avatar src={member.photoURL}>
                        {member.photoURL
                          ? ""
                          : member.displayName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </ButtonGroupStyled>
            </HeaderStyled>

          )}
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes, index) => {
                return (
                  <div key={mes.id}>
                    {messages[index - 1] !== undefined ? (
                      !isSameDate(
                        messages[index - 1].createdAt?.seconds,
                        mes.createdAt?.seconds
                      ) ? (
                        <DividerMessage plain>
                          {formatDate(mes.createdAt?.seconds, "PPPP")}
                        </DividerMessage>
                      ) : null
                    ) : null}
                    <Message
                      key={mes.id}
                      text={mes.text}
                      photoURL={mes.photoURL}
                      displayName={mes.displayName}
                      createdAt={mes.createdAt}
                      myMess={uid === mes.uid}
                    />
                  </div>
                );
              })}
            </MessageListStyled>
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
              <Button
                type="primary"
                shape="circle"
                onClick={handleOnSubmit}
                icon={<SendOutlined />}
              />
            </FormStyled>
          </ContentStyled>
        </>
      )}
    </WrapperStyled>
  );
}
