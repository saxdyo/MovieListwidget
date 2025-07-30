import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface FileIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const FileIcon: React.FC<FileIconProps> = (props) => {
  return (
    <BaseIcon
      name="fileicon"
      path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      {...props}
    />
  );
};
