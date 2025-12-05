import { Layout, Dropdown, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MailOutlined, SettingOutlined } from "@ant-design/icons";
import { useStore } from "@/store/useStore";
import { SiderMenuItems } from "./index.d";
import type { MenuProps } from "antd";
import "./index.css";

type AntdMenuItem = Required<MenuProps>["items"][number];
const { Header, Footer } = Layout;

const LayoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const removeUserInfo = useStore((state) => state.removeUserInfo);
  const userInfo = useStore((state) => state.userInfo);

  console.log(window.location, "window.location");

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            removeUserInfo();
            navigate("/login");
          }}
        >
          退出登录
        </a>
      ),
    },
  ];

  const siderMenus: SiderMenuItems[] = [
    {
      key: "sub1",
      label: "工作概览",
      icon: <MailOutlined />,

      children: [
        {
          key: "/main",
          label: "首页",
        },
      ],
    },
  ];

  const renderMenus = (menuItems: SiderMenuItems[]): AntdMenuItem[] => {
    return menuItems.map((item: SiderMenuItems) => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: renderMenus(item.children),
        };
      }

      return {
        key: item.key,
        label: item.label,
      };
    });
  };

  const onClick = ({ key }: { key: string }) => {
    // 使用 navigate 进行路由跳转
    navigate(key);
  };

  // 获取当前激活的菜单项 key
  const getActiveKey = () => {
    const currentPath = location.pathname;
    return currentPath;
  };

  // 获取默认展开的菜单项 keys
  const getDefaultOpenKeys = () => {
    const openKeys: string[] = [];
    const currentPath = location.pathname;

    const findParentKeys = (menuItems: SiderMenuItems[]) => {
      menuItems.forEach((item) => {
        if (item.children) {
          if (item.children.some((child) => child.key === currentPath)) {
            openKeys.push(item.key);
          }
          findParentKeys(item.children);
        }
      });
    };

    findParentKeys(siderMenus);
    return openKeys;
  };

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center", padding: 0 }}>
        <div className="logoTitle">
          <SettingOutlined />
          <span>管理中心</span>
        </div>
        <div className="userInfo">
          <Dropdown menu={{ items }} placement="bottom" arrow>
            {userInfo?.name || "sysadmin"}
          </Dropdown>
        </div>
      </Header>
      <div className="contentContainer">
        <div className="app-container">
          <div className="menu-scroll">
            <Menu
              onClick={onClick}
              selectedKeys={[getActiveKey()]}
              defaultOpenKeys={getDefaultOpenKeys()}
              mode="inline"
              items={renderMenus(siderMenus)}
            />
          </div>
          <div className={"content-container"}>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer style={{ marginLeft: "200px", textAlign: "center" }}>
        template ©{new Date().getFullYear()} Created by Chengxueming
      </Footer>
    </Layout>
  );
};

export default LayoutPage;
