import { Avatar, Space, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import { formatDate, formatRelativeDate } from "../../../utils/formatDate";
import MessageContent from "./MessageContent";
const WrapperStyled = styled.div`
  margin-bottom: 12px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;

  &.owner: {
    justify-content: flex-end;
    align-items: flex-end;
  }
  .author {
    color: #a7a7a7;
    font-size: 12px;
  }

  .message-info {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;

    &.owner {
      align-items: flex-end;
    }

    .content {
      background-color: #e3e6eb;
      max-width: 50%;
      padding: 8px;
      border-radius: 0px 8px 8px 8px;
    }

    .my-content {
      background-color: #1890ff;
      max-width: 50%;
      color: white;
      padding: 8px;
      border-radius: 8px 0px 8px 8px;
    }

    img {
      position: relative;
      max-width: 30%;
      border-radius: 8px;
    }
  }
`;

export default function Message({
  text,
  imgURL,
  displayName,
  createdAt,
  photoURL,
  myMess: owner,
}) {
  return (
    <WrapperStyled className={`${owner && "owner"}`}>
      {!owner && (
        <Avatar size="large" src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
      )}
      <div className={`message-info ${owner && "owner"}`}>
        <Typography.Text className="author">
          {!owner ? `${displayName}, ` : ""}
          {formatDate(createdAt?.seconds, "p")}
        </Typography.Text>
        {text && (
          <Typography.Text className={owner ? "my-content" : "content"}>
            {text}
          </Typography.Text>
        )}
        {imgURL && <img src={imgURL} />}
      </div>
    </WrapperStyled>
  );
  // if (owner) {
  //   return (
  //     <WrapperStyled style={{ justifyContent: "flex-end" }}>
  //       <Space direction="vertical" align="end">
  //         <Typography.Text className="author">
  //           {formatDate(createdAt?.seconds, "p")}
  //         </Typography.Text>
  //         {/* {text && (
  //           <Typography.Text className="my-content">{text}</Typography.Text>
  //         )}
  //         <img src={imgURL} /> */}
  //         <MessageContent text={text} imgURL={imgURL} isOwner />
  //       </Space>
  //     </WrapperStyled>
  //   );
  // }
  // return (
  //   <WrapperStyled>
  //     <Space align="start" direction="horizontal">
  //       <Avatar size="large" src={photoURL}>
  //         {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
  //       </Avatar>
  //       <Space direction="vertical">
  //         <div>
  //           <Typography.Text className="author">
  //             {displayName}, {formatDate(createdAt?.seconds, "p")}
  //           </Typography.Text>
  //         </div>
  //         {/* {text && (
  //           <Typography.Text className="content">{text}</Typography.Text>
  //         )}
  //         <img src={imgURL} /> */}
  //         <MessageContent text={text} imgURL={imgURL} />
  //       </Space>
  //     </Space>
  //   </WrapperStyled>
  // );
}
