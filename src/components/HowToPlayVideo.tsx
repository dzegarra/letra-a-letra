import { useState } from "react";
import { PlayCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type HowToPlayVideoProps = {
  videoId: string;
};

/** Shows a play button and only loads the YouTube player once it is pressed, so nothing is downloaded unless asked */
export const HowToPlayVideo = ({ videoId }: HowToPlayVideoProps) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-slate-800">
      {isPlaying ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={t("howToPlayVideo")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white hover:bg-slate-700 transition-colors"
        >
          <PlayCircleFilled className="text-6xl" />
          <span className="text-base font-medium">{t("watchVideo")}</span>
          <span className="text-xs text-slate-300">{t("videoFromYoutube")}</span>
        </button>
      )}
    </div>
  );
};
