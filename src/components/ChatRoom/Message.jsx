import { Avatar, Space, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import { formatDate, formatRelativeDate } from "./../../utils/formatDate";
const WrapperStyled = styled.div`
  margin-bottom: 12px;
  width: 100%;
  display: flex;
  direction: row;

  .author {
    color: #a7a7a7;
    font-size: 12px;
  }

  .content {
    background-color: #e3e6eb;
    padding: 8px;
    border-radius: 0px 8px 8px 8px;
  }

  .my-content {
    background-color: #1890ff;
    color: white;
    padding: 8px;
    border-radius: 8px 0px 8px 8px;
  }
`;

export default function Message({
  text,
  displayName,
  createdAt,
  photoURL,
  myMess,
}) {
  if (myMess) {
    return (
      <WrapperStyled style={{ justifyContent: "flex-end" }}>
        <Space direction="vertical" align="end">
          <Typography.Text className="author">
            {formatDate(createdAt?.seconds, "p")}
          </Typography.Text>
          <Typography.Text className="my-content">{text}</Typography.Text>
        </Space>
      </WrapperStyled>
    );
  }
  return (
    <WrapperStyled>
      <Space align="start">
        <Avatar size="large" src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Space direction="vertical">
          <div>
            <Typography.Text className="author">
              {displayName}, {formatDate(createdAt?.seconds, "p")}
            </Typography.Text>
          </div>
          <Typography.Text className="content">{text}</Typography.Text>
        </Space>
      </Space>
    </WrapperStyled>
  );
}
