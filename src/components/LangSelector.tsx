import { FlagOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { useTranslation } from "react-i18next";

const items: MenuProps["items"] = [
  {
    label: "English",
    key: "en",
  },
  {
    label: "Español",
    key: "es",
  },
  {
    label: "Polski",
    key: "pl",
  },
];

export const LangSelector = () => {
  const { i18n } = useTranslation();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    i18n.changeLanguage(e.key);
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
    >
      <Button>
        {i18n.language.toLocaleUpperCase()}
        <FlagOutlined />
      </Button>
    </Dropdown>
  );
};
