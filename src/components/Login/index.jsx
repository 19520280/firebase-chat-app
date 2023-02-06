import React from "react";
import { Row, Col, Button, Typography, Space } from "antd";
import firebase, { auth } from "../../firebase/config";
import { GoogleOutlined } from "@ant-design/icons";
import { FacebookOutlined } from "@ant-design/icons/lib/icons";
import { addDocument, generateKeywords } from "../../firebase/services";

const { Title } = Typography;

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default function Login() {
  const handleLogin = async (provider) => {
    const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

    if (additionalUserInfo?.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(user.displayName?.toLowerCase()),
      });
    }
  };

  return (
    <div>
      <Row justify="center" align="middle" style={{ height: "60vh" }}>
        <Space direction="vertical" style={{ width: "30%" }}>
          <h1
            style={{
              textAlign: "center",
              backgroundImage:
                "linear-gradient(83.84deg, #0088FF -6.87%, #A033FF 26.54%, #FF5C87 58.58%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontWeight: 500,
              fontSize: "60px",
              letterSpacing: "-4px",
              lineHeight: "85px",
            }}
          >
            Firebase ChatApp
            {/* <Title style={{ textAlign: "center", marginBottom: 16 }} level={4}>
              SE400.N12
            </Title> */}
          </h1>
          <Button
            style={{ width: "100%" }}
            size="large"
            icon={<GoogleOutlined />}
            onClick={() => handleLogin(googleProvider)}
          >
            Đăng nhập bằng Google
          </Button>
          <Button
            style={{ width: "100%" }}
            size="large"
            icon={<FacebookOutlined />}
            onClick={() => handleLogin(fbProvider)}
          >
            Đăng nhập bằng Facebook
          </Button>
        </Space>
      </Row>
    </div>
  );
}
