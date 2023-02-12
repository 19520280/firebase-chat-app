import React from "react";
import { Button, Avatar, Typography } from "antd";
import styled from "styled-components";

import { auth } from "../../../firebase/config";
import { AuthContext } from "../../../Context/AuthProvider";
import { LogoutOutlined } from "@ant-design/icons";
//import { AppContext } from '../../../Context/AppProvider';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  .username {
    color: #050505;
    font-weight: bold;
    margin-left: 5px;
  }
`;

export default function UserInfo() {
  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);
  //const { clearState } = React.useContext(AppContext);

  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL} size='large'>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username" style={{marginLeft: 8}}>{displayName}</Typography.Text>
      </div>
      <Button
        shape="circle"
        icon={<LogoutOutlined />}
        onClick={() => {
          // clear state in App Provider when logout
          //clearState();
          auth.signOut();
        }}
      />
    </WrapperStyled>
  );
}
