import {
  EditOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Alert, Avatar, Button, Divider, Form, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import { formatDate, isSameDate } from "../../utils/formatDate";
import InputMessage from "./Message/InputMessage";
import Message from "./Message/Message";

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
//                 ?????i t??n ph??ng
//               </Button>
//               <Button
//                 icon={<LogoutOutlined />}
//                 type="text"
//                 onClick={()=> setIsLeaveRoomVisible(true)}
//               >
//                 R???i ph??ng
//               </Button>
//               <Button
//                 icon={<UserAddOutlined />}
//                 type="text"
//                 onClick={() => setIsInviteMemberVisible(true)}
//               >
//                 M???i
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
//                   placeholder="Nh???p tin nh???n..."
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
//           message="H??y ch???n ph??ng"
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
    selectedRoomId,
    selectedRoom,
    users,
    membersSelectedRoom,
    setIsInviteMemberVisible,
    setIsEditRoomVisible,
    setIsLeaveRoomVisible,
  } = useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const messageListRef = useRef(null);

  const other = users.find(
    (user) =>
      user.uid === selectedRoom?.members?.find((member) => member !== uid)
  );

  const condition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore("messages", condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {!selectedRoom.id ? (
        <Alert
          message="H??y ch???n ph??ng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      ) : (
        <>
          {selectedRoom.isPrivateRoom ? (
            <HeaderStyled>
              <div className="header__info">
                <p className="header__title">{other.displayName}</p>
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
                  ?????i t??n ph??ng
                </Button>
                <Button
                  icon={<LogoutOutlined />}
                  type="text"
                  onClick={() => setIsLeaveRoomVisible(true)}
                >
                  R???i ph??ng
                </Button>
                <Button
                  icon={<UserAddOutlined />}
                  type="text"
                  onClick={() => setIsInviteMemberVisible(true)}
                >
                  M???i
                </Button>
                <Avatar.Group size="small" maxCount={2}>
                  {membersSelectedRoom.map((member) => (
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
                    {messages[index - 1] == undefined ||
                    !isSameDate(
                      messages[index - 1].createdAt?.seconds,
                      mes.createdAt?.seconds
                    ) ? (
                      <DividerMessage plain>
                        {formatDate(mes.createdAt?.seconds, "PPPP")}
                      </DividerMessage>
                    ) : null}
                    <Message
                      key={mes.id}
                      text={mes.text}
                      imgURL={mes.imgURL}
                      photoURL={mes.photoURL}
                      displayName={mes.displayName}
                      createdAt={mes.createdAt}
                      myMess={uid === mes.uid}
                    />
                  </div>
                );
              })}
            </MessageListStyled>
            <InputMessage />
          </ContentStyled>
        </>
      )}
    </WrapperStyled>
  );
}
