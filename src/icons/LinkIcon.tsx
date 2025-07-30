import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface LinkIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const LinkIcon: React.FC<LinkIconProps> = (props) => {
  return (
    <BaseIcon
      name="linkicon"
      path="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      {...props}
    />
  );
};
