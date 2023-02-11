import { UserAddOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert } from 'antd';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';

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
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const { 
    selectedContactId, selectedContact, 
    selectedRoomId, selectedRoom, 
    members, setIsInviteMemberVisible 
  } = useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const isGroupConvesation = selectedRoomId && !selectedContactId;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    if (!inputValue) return;

    if (isGroupConvesation) {
      addDocument('messages', {
        text: inputValue,
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName,
      });
    }
    else {
      addDocument('messages', {
        text: inputValue,
        uid,
        photoURL,
        receiverId: selectedContactId,
        displayName,
      });
    }

    form.resetFields(['message']);
    setInputValue("");

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const condition1 = React.useMemo(
    () => ({
      fieldName: 'uid',
      operator: '==',
      compareValue: uid,
    }),
    [uid]
  );

  const condition2 = React.useMemo(
    () => ({
      fieldName: 'receiverId',
      operator: '==',
      compareValue: uid,
    }),
    [uid]
  );

  const groupMessages = useFirestore('messages', condition);
  const contactMessages = [...useFirestore('messages', condition1).filter((message) => message.receiverId === selectedContact.uid), 
                          ...useFirestore('messages', condition2).filter((message) => message.uid === selectedContact.uid)];
  const messages = isGroupConvesation ? groupMessages : contactMessages;

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {(!selectedRoom.id && !selectedContactId) ? 
      (
        <Alert
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{ margin: 5 }}
          closable
        />
      ) : (
        <>
        {
          isGroupConvesation ? (
            <HeaderStyled>
              <div className='header__info'>
                <p className='header__title'>{selectedRoom.name}</p>
                <span className='header__description'>
                  {selectedRoom.description}
                </span>
              </div>
              <ButtonGroupStyled>
                <Button
                  icon={<UserAddOutlined />}
                  type='text'
                  onClick={() => setIsInviteMemberVisible(true)}
                >
                  Mời
                </Button>
                <Avatar.Group size='small' maxCount={2}>
                  {members.map((member) => (
                    <Tooltip title={member.displayName} key={member.id}>
                      <Avatar src={member.photoURL}>
                        {member.photoURL
                          ? ''
                          : member.displayName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </ButtonGroupStyled>
            </HeaderStyled>
          ) : (
            <HeaderStyled>
              <div className='header__info'>
                <p className='header__title'>{selectedContact.displayName}</p>
              </div>
            </HeaderStyled>
          )
        }
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name='message'>
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Nhập tin nhắn...'
                  bordered={false}
                  autoComplete='off'
                />
              </Form.Item>
              <Button type='primary' onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      )}
    </WrapperStyled>
  );
}
