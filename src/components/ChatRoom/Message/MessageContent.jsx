import { Space, Typography } from "antd";
import React from "react";

// const WrapperStyled = styled.div`
//   .content {
//     background-color: #e3e6eb;
//     padding: 8px;
//     border-radius: 0px 8px 8px 8px;
//   }

//   .my-content {
//     background-color: #1890ff;
//     color: white;
//     padding: 8px;
//     border-radius: 8px 0px 8px 8px;
//   }

//   img {
//     position: relative;
//     max-width: 30%;
//   }
// `;
const MessageContent = ({ text, imgURL, isOwner }) => {
  return (
    <Space
      direction="vertical"
      align={isOwner ? "end" : "start"}
      style={{ gap: "4px" }}
    >
      {text && (
        <Typography.Text className={isOwner ? "my-content" : "content"}>
          {text}
        </Typography.Text>
      )}
      {imgURL && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isOwner ? "flex-end" : "flex-start",
          }}
        >
          <img src={imgURL} />
        </div>
      )}
    </Space>
  );
};

export default MessageContent;
