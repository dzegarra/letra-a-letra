import { Grid } from "antd";

/** True on wide screens, where actions live in the header instead of floating buttons */
export const useIsDesktop = () => Grid.useBreakpoint().lg === true;
