import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface UploadIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const UploadIcon: React.FC<UploadIconProps> = (props) => {
  return (
    <BaseIcon
      name="uploadicon"
      path="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
      {...props}
    />
  );
};
