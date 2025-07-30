import React from 'react';

export interface IconProps {
  /** 图标大小 */
  size?: number | string;
  /** 图标颜色 */
  color?: string;
  /** 自定义CSS类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<SVGElement>) => void;
  /** 鼠标悬停事件 */
  onMouseEnter?: (event: React.MouseEvent<SVGElement>) => void;
  /** 鼠标离开事件 */
  onMouseLeave?: (event: React.MouseEvent<SVGElement>) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标标题（用于无障碍访问） */
  title?: string;
}

export interface IconComponentProps extends IconProps {
  /** 图标名称 */
  name: string;
}

export type IconName = 
  | 'home'
  | 'search'
  | 'user'
  | 'settings'
  | 'heart'
  | 'star'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'close'
  | 'menu'
  | 'plus'
  | 'minus'
  | 'edit'
  | 'delete'
  | 'download'
  | 'upload'
  | 'share'
  | 'like'
  | 'comment'
  | 'notification'
  | 'calendar'
  | 'clock'
  | 'location'
  | 'phone'
  | 'email'
  | 'link'
  | 'image'
  | 'video'
  | 'file'
  | 'folder'
  | 'lock'
  | 'unlock'
  | 'eye'
  | 'eye-off'
  | 'check'
  | 'info'
  | 'warning'
  | 'error'
  | 'success';