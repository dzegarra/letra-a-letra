import { ComponentProps, forwardRef } from "react";
import { PrintPageCardRears } from "./PrintPageCardRears";
import { PrintPage } from "./PrintPage";
import { useCardsStore } from "../store";
import { CardFront } from "./CardFront";

type PreviewViewProps = ComponentProps<"div">;

export const PrintDocument = forwardRef<HTMLDivElement, PreviewViewProps>(({ ...props }, ref) => {
  const cards = useCardsStore((state) => state.cards);

  return (
    <>
      <div className="flex flex-col flex-1 items-start" {...props} ref={ref}>
        <PrintPage>
          {cards.map((card) => (
            <CardFront key={card.id} card={card} />
          ))}
        </PrintPage>

        <PrintPageCardRears className="self-end" style={{ direction: "rtl" }} />
      </div>
    </>
  );
});
