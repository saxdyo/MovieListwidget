import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface DownloadIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const DownloadIcon: React.FC<DownloadIconProps> = (props) => {
  return (
    <BaseIcon
      name="downloadicon"
      path="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
      {...props}
    />
  );
};
