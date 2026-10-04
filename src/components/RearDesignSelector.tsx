import { useCallback, useState } from "react";
import { Button, message as antdMessage, Select, Space } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useCardsStore } from "../store";
import { RearDesign, rearDesigns } from "../rearDesigns";
import { pickFile } from "../helpers/pickFile";
import { readRearImage, RearImageError } from "../helpers/readRearImage";
import { CardRear } from "./CardRear";

type RearDesignSelectorProps = {
  disabled?: boolean;
};

/**
 * Picks the design for the rear of the cards, including an SVG or PNG uploaded by the user.
 */
export const RearDesignSelector = ({ disabled }: RearDesignSelectorProps) => {
  const colors = useCardsStore((state) => state.colors);
  const rearDesign = useCardsStore((state) => state.rearDesign);
  const setRearDesign = useCardsStore((state) => state.setRearDesign);
  const customRearImage = useCardsStore((state) => state.customRearImage);
  const setCustomRearImage = useCardsStore((state) => state.setCustomRearImage);
  const [isReading, setIsReading] = useState(false);
  const [message, messageContextHolder] = antdMessage.useMessage();
  const { t } = useTranslation();

  const uploadImage = useCallback(() => {
    pickFile(async (files) => {
      const file = files?.[0];
      if (!file) return;
      setIsReading(true);
      try {
        setCustomRearImage(await readRearImage(file));
      } catch (error) {
        const reason = error instanceof RearImageError ? error.reason : "invalid";
        message.error(t(`customRearImageError_${reason}`));
      } finally {
        setIsReading(false);
      }
    }, ".svg,.png,image/svg+xml,image/png");
  }, [message, setCustomRearImage, t]);

  const designs = Object.keys(rearDesigns) as RearDesign[];
  if (customRearImage) designs.push("custom");

  return (
    <div className="flex flex-col gap-2">
      {messageContextHolder}
      <Select<RearDesign>
        value={rearDesign}
        onChange={setRearDesign}
        disabled={disabled}
        options={designs.map((design) => ({
          value: design,
          label: (
            <Space size="small">
              <CardRear color={colors[0]} design={design} className="!h-5 !w-5 align-middle" />
              {t(`rearDesign_${design}`)}
            </Space>
          ),
        }))}
      />
      <Space.Compact block>
        <Button block icon={<UploadOutlined />} onClick={uploadImage} loading={isReading} disabled={disabled}>
          {customRearImage ? t("changeCustomRearImage") : t("uploadCustomRearImage")}
        </Button>
        {customRearImage && (
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setCustomRearImage(null)}
            disabled={disabled}
            aria-label={t("removeCustomRearImage")}
            title={t("removeCustomRearImage")}
          />
        )}
      </Space.Compact>
    </div>
  );
};
