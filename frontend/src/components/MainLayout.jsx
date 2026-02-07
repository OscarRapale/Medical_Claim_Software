import { useState } from "react";
import { Layout, Menu, Typography, Avatar, Dropdown } from "antd";
import {
  FileTextOutlined,
  UploadOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/claims",
      icon: <FileTextOutlined />,
      label: "Claims",
    },
    {
      key: "/import",
      icon: <UploadOutlined />,
      label: "Import Claims",
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        style={{
          background: "linear-gradient(180deg, #1a1f3c 0%, #0d1025 100%)",
          boxShadow: "4px 0 15px rgba(0, 0, 0, 0.15)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "0" : "0 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: collapsed ? 0 : 12,
            }}
          >
            <FileTextOutlined style={{ fontSize: 20, color: "#fff" }} />
          </div>
          {!collapsed && (
            <Text
              strong
              style={{
                fontSize: 20,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              Medical Claims Management
            </Text>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: "transparent",
            borderRight: "none",
            marginTop: 20,
            padding: "0 12px",
          }}
          theme="dark"
        />

        {/* User section at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: collapsed ? "20px 12px" : "20px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="topRight"
            trigger={["click"]}
          >
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                transition: "background 0.2s",
              }}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#6366f1",
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <div style={{ overflow: "hidden" }}>
                  <Text
                    style={{
                      color: "#fff",
                      display: "block",
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    {user?.email?.split("@")[0] || "User"}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.email}
                  </Text>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: "margin-left 0.2s",
          background: "#f0f2f5",
        }}
      >
        <Header
          style={{
            padding: "0 32px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 99,
            height: 72,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                cursor: "pointer",
                background: "#f5f5f5",
                transition: "background 0.2s",
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </div>
        </Header>

        <Content
          style={{
            margin: 32,
            minHeight: "calc(100vh - 72px - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
