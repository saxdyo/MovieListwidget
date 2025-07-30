import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface MenuIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const MenuIcon: React.FC<MenuIconProps> = (props) => {
  return (
    <BaseIcon
      name="menuicon"
      path="M4 6h16M4 12h16M4 18h16"
      {...props}
    />
  );
};
