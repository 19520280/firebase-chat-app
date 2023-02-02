import { UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Tooltip } from "antd";
import { AppContext } from "../../Context/AppProvider";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import Message from "./Message";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);

    .header {
        &_info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &_title {
            margin: 0;
            font-weight: bold;
        }

        &_description {
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

`;

const ContentStyled = styled.div`
    height: calc(100% - 56px);
    display: flex;
    flex-direction: column;
    padding; 11px;
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
    const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext);
    const { 
        user: { uid, photoURL, displayName },
    } = useContext(AuthContext);
    const [inputValue, setInputValue] = useState('');
    const [form] = Form.useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleOnSubmit = () => {
        addDocument('messages', {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName,
        })

        form.resetFields(['messages'])
    };

    const condition = React.useMemo(() => ({
        fieldName: 'roomId',
        operator: '==',
        compareValue: selectedRoom.id,
    }), [selectedRoom.id]);

    const messages = useFirestore('messages', condition);

    return (
        <WrapperStyled>
            {
                selectedRoom.id ? (
                    <>
                        <HeaderStyled>
                            <div className="header_info">
                                <p className="header_title">{selectedRoom.name}</p>
                                <span className="header_description">{selectedRoom.description}</span>
                            </div>
                            <ButtonGroupStyled>
                                <Button icon={<UserAddOutlined/>} type='text' onClick={() => setIsInviteMemberVisible(true)}>
                                    Mời
                                </Button>
                                <Avatar.Group size="small" maxCount={2}>
                                    {
                                        members.map(member => 
                                            <Tooltip title={member.displayName} key={member.id}>
                                                <Avatar src={member.photoURL}>
                                                    {member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}
                                                </Avatar>
                                            </Tooltip>
                                        )
                                    }
                                </Avatar.Group>
                            </ButtonGroupStyled>
                        </HeaderStyled>
                        <ContentStyled>
                            <MessageListStyled>
                                {
                                    messages.map(mes => <Message 
                                        key={mes.id}
                                        text={mes.text} 
                                        photoURL={mes.photoURL} 
                                        displayName={mes.displayName} 
                                        createdAt={mes.createdAt}
                                    />)
                                }
                            </MessageListStyled>
                            <FormStyled form={form}>
                                <FormStyled.Item name="messages">
                                    <Input 
                                        onChange={handleInputChange}
                                        onPressEnter={handleOnSubmit}
                                        placeholder='Nhập tin nhắn...'
                                        bordered={false} 
                                        autoComplete="off"
                                    />
                                </FormStyled.Item>
                                <Button type='primary'>Gửi</Button>
                            </FormStyled>
                        </ContentStyled>
                    </>
                ) : ( 
                    <Alert 
                        message="Hãy chọn phòng" 
                        type="info" 
                        showIcon
                        style={{ margin: 5 }}
                        closable
                    />
                )
            }
        </WrapperStyled>    
    );
}