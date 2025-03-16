import { DeleteOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { CardDeletePopConfirm } from "./CardDeletePopConfirm";
import { areWordsSorted } from "../helpers/areWordsSorted";
import { useCardsStore } from "../store";
import { Card } from "../types";

type TableActionsCellProps = {
  card: Card;
};

export const TableActionsCell = ({ card }: TableActionsCellProps) => {
  const { t } = useTranslation();
  const sortWordsOfCard = useCardsStore((state) => state.sortWordsOfCard);

  return (
    <Space>
      <Tooltip title={t("sortWordsAscending")}>
        <Button
          variant="filled"
          type="primary"
          shape="circle"
          icon={<SortAscendingOutlined />}
          disabled={areWordsSorted(card)}
          onClick={() => sortWordsOfCard(card)}
        ></Button>
      </Tooltip>
      <CardDeletePopConfirm card={card} placement="left">
        <Button
          variant="outlined"
          color="danger"
          shape="circle"
          aria-label={t("deleteCard")}
          icon={<DeleteOutlined />}
        />
      </CardDeletePopConfirm>
    </Space>
  );
};
