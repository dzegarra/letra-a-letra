import { useCallback, useState } from "react";
import { ViewMode } from "../types";

export const useViewMode = () => {
  const [state, setState] = useState<ViewMode>("preview");

  return {
    viewMode: state ?? "preview",
    setViewMode: setState,
    setPreviewView: useCallback(() => setState("preview"), []),
    setTableView: useCallback(() => setState("table"), []),
  };
};
