import React from "react";

export interface SiderMenuItems {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: SiderMenuItems[];
}
