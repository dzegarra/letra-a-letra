import { ComponentProps } from "react";
import { Alert, Typography } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { CardFront } from "./CardFront";
import { HowToPlayVideo } from "./HowToPlayVideo";
import { defaultColors, howToPlayVideos } from "../constants";
import { Card } from "../types";

const steps = ["howToPlayStep1", "howToPlayStep2", "howToPlayStep3", "howToPlayStep4", "howToPlayStep5"] as const;

type GameIntroProps = {
  /** Shows a "How to play" heading over the rules, for when nothing else around says what this is */
  showTitle?: boolean;
} & ComponentProps<"div">;

/** Explains what the game is about and how it is played, with a video when there is one in the current language */
export const GameIntro = ({ showTitle = false, className, ...props }: GameIntroProps) => {
  const { t, i18n } = useTranslation();
  const videoId = howToPlayVideos[i18n.resolvedLanguage ?? "en"];
  const sampleCard: Card = {
    id: "sample",
    words: [
      { word: t("sampleWordOuter"), color: defaultColors[0], rotationDeg: 40 },
      { word: t("sampleWordMiddle"), color: defaultColors[1], rotationDeg: 200 },
      { word: t("sampleWordInner"), color: defaultColors[2], rotationDeg: 110 },
    ],
  };

  return (
    <div className={clsx("flex flex-col gap-6", className)} {...props}>
      <Alert type="info" showIcon icon={<ReadOutlined />} message={t("educationalPurpose")} />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* The sample card keeps its real size for the words to fit, and is shrunk visually */}
        <div className="h-[220px] w-[220px] flex-none flex items-center justify-center" aria-hidden>
          <CardFront card={sampleCard} hideIndex className="flex-none scale-[0.647]" />
        </div>
        <div>
          {showTitle && (
            <Typography.Title level={4} className="!mt-0">
              {t("howToPlay")}
            </Typography.Title>
          )}
          <ol className="list-decimal pl-5 space-y-1 text-[15px]">
            {steps.map((step) => (
              <li key={step}>{t(step)}</li>
            ))}
          </ol>
        </div>
      </div>

      {videoId && <HowToPlayVideo videoId={videoId} />}
    </div>
  );
};
