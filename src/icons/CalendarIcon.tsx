import React from 'react';
import { BaseIcon, BaseIconProps } from '../components/BaseIcon';

export interface CalendarIconProps extends Omit<BaseIconProps, 'name' | 'path'> {}

export const CalendarIcon: React.FC<CalendarIconProps> = (props) => {
  return (
    <BaseIcon
      name="calendaricon"
      path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      {...props}
    />
  );
};
