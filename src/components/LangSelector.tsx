import { FlagOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { languages } from "../constants";

export const LangSelector = () => {
  const { i18n } = useTranslation();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    i18n.changeLanguage(e.key);
  };

  return (
    <Dropdown
      menu={{
        items: languages,
        selectable: true,
        selectedKeys: [i18n.resolvedLanguage ?? "en"],
        onClick: handleMenuClick,
      }}
    >
      <Button>
        {(i18n.resolvedLanguage ?? "en").toLocaleUpperCase()}
        <FlagOutlined />
      </Button>
    </Dropdown>
  );
};
