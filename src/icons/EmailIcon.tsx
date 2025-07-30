import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface EmailIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const EmailIcon: React.FC<EmailIconProps> = (props) => {
  return (
    <BaseIcon
      name="emailicon"
      path="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      {...props}
    />
  );
};
