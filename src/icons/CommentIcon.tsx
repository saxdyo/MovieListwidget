import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface CommentIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const CommentIcon: React.FC<CommentIconProps> = (props) => {
  return (
    <BaseIcon
      name="commenticon"
      path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      {...props}
    />
  );
};
