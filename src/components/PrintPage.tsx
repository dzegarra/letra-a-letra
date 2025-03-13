import clsx from "clsx";
import { ComponentProps, Fragment, Children } from "react";

type PageWithCardFrontsProps = ComponentProps<"div">;

export const PrintPage = ({ children, className, style }: PageWithCardFrontsProps) => {
  const childrenAsArray = Children.toArray(children);

  const groupedChildren = [];
  for (let i = 0; i < childrenAsArray.length; i += 6) {
    groupedChildren.push(childrenAsArray.slice(i, i + 6));
  }

  return (
    <>
      {groupedChildren.map((children, index) => (
        <Fragment key={index}>
          <div className={clsx("inline-grid grid-cols-2 grid-rows-3 gap-5 mt-2 mx-3", className)} style={style}>
            {children.map((child) => child)}
          </div>
          <div className="html2pdf__page-break" />
        </Fragment>
      ))}
    </>
  );
};
