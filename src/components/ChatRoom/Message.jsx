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
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    background-color: red;
    padding: 8px;
    border-radius: 0px 8px 8px 8px;
  }

  .my-content {
    background-color: blue;
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
          <Typography.Text className="date">
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
            <Typography.Text className="author">{displayName}</Typography.Text>
            <Typography.Text className="date">
              {formatDate(createdAt?.seconds, "p")}
            </Typography.Text>
          </div>
          <Typography.Text className="content">{text}</Typography.Text>
        </Space>
      </Space>
    </WrapperStyled>
  );
}
