import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface FolderIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const FolderIcon: React.FC<FolderIconProps> = (props) => {
  return (
    <BaseIcon
      name="foldericon"
      path="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
      {...props}
    />
  );
};
