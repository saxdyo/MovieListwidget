import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface NotificationIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const NotificationIcon: React.FC<NotificationIconProps> = (props) => {
  return (
    <BaseIcon
      name="notificationicon"
      path="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v7.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 17.25V9.75a6 6 0 00-6-6zM12 9a3 3 0 11-6 0 3 3 0 016 0z"
      {...props}
    />
  );
};
