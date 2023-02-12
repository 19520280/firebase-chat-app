import React from "react";
import { Button, Avatar, Typography, Space, Divider } from "antd";
import styled from "styled-components";

import { auth } from "../../../firebase/config";
import { AuthContext } from "../../../Context/AuthProvider";
import { LogoutOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
//import { AppContext } from '../../../Context/AppProvider';

export default function UserInfo() {
  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);
  //const { clearState } = React.useContext(AppContext);

  return (
    <Space direction="vertical" style={{ width: "100%", padding: "12px 16px" }}>
      <WrapperStyled>
        <Space direction="horizontal">
          <Avatar src={photoURL} size="large">
            {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography.Text className="username" style={{ marginLeft: 8 }}>
            {displayName}
          </Typography.Text>
        </Space>
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
    </Space>
  );
}
const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  .username {
    color: #050505;
    font-weight: bold;
    margin-left: 5px;
  }
`;

const SearchBox = styled(Search)`
  background-color: #e3e6eb;
  padding: 8px;
  width: 100%;
`;
