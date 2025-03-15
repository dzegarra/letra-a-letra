import clsx from "clsx";
import { ComponentProps, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

const pageSizes = {
  a4: {
    w: 2480,
    h: 3508,
  },
};

type PageProps = ComponentProps<"div"> & {
  format: keyof typeof pageSizes;
  replaceWithScreenshot?: boolean;
  contentClassname?: string;
};

/**
 * Render a page canvas with a specific format (size).
 */
export const Page = ({ children, className, contentClassname, format, replaceWithScreenshot = false }: PageProps) => {
  const dimensions = pageSizes[format];
  const canvasRef = useRef<HTMLDivElement>(null);
  const [screenshot, setScreenshot] = useState<string>();

  useEffect(() => {
    if (replaceWithScreenshot && canvasRef.current) {
      html2canvas(canvasRef.current).then((canvas) => {
        setScreenshot(canvas.toDataURL("image/png"));
      });
    }
  }, [replaceWithScreenshot]);

  return (
    <div
      className={clsx("m-3 bg-white shadow-md relative", className)}
      style={{
        width: `${dimensions.w / 10}mm`,
        height: `${dimensions.h / 10}mm`,
      }}
    >
      <div
        ref={canvasRef}
        className={clsx("absolute top-0 left-0 w-full h-full bg-white", contentClassname, {
          hidden: !!screenshot,
        })}
      >
        {children}
      </div>

      {screenshot && <img src={screenshot} alt="screenshot" />}
    </div>
  );
};
