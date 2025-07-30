import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface EyeOffIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const EyeOffIcon: React.FC<EyeOffIconProps> = (props) => {
  return (
    <BaseIcon
      name="eyeofficon"
      path="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
      {...props}
    />
  );
};
