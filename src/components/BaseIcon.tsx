import React from 'react';
import { IconProps } from '../types';

export interface BaseIconProps extends IconProps {
  /** SVG路径数据 */
  path: string;
  /** 图标名称 */
  name: string;
}

export const BaseIcon: React.FC<BaseIconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  title,
  path,
  name,
}) => {
  const iconSize = typeof size === 'number' ? `${size}px` : size;
  
  const handleClick = (event: React.MouseEvent<SVGElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<SVGElement>) => {
    if (!disabled && onMouseEnter) {
      onMouseEnter(event);
    }
  };

  const handleMouseLeave = (event: React.MouseEvent<SVGElement>) => {
    if (!disabled && onMouseLeave) {
      onMouseLeave(event);
    }
  };

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon icon-${name} ${disabled ? 'icon-disabled' : ''} ${className}`}
      style={{
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={title || name}
    >
      {title && <title>{title}</title>}
      <path d={path} fill={color} />
    </svg>
  );
};