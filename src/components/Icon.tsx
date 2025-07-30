import React from 'react';
import { IconComponentProps, IconName } from '../types';
import * as Icons from '../icons';

const iconComponents: Record<IconName, React.ComponentType<any>> = {
  'home': Icons.HomeIcon,
  'search': Icons.SearchIcon,
  'user': Icons.UserIcon,
  'settings': Icons.SettingsIcon,
  'heart': Icons.HeartIcon,
  'star': Icons.StarIcon,
  'arrow-left': Icons.ArrowLeftIcon,
  'arrow-right': Icons.ArrowRightIcon,
  'arrow-up': Icons.ArrowUpIcon,
  'arrow-down': Icons.ArrowDownIcon,
  'close': Icons.CloseIcon,
  'menu': Icons.MenuIcon,
  'plus': Icons.PlusIcon,
  'minus': Icons.MinusIcon,
  'edit': Icons.EditIcon,
  'delete': Icons.DeleteIcon,
  'download': Icons.DownloadIcon,
  'upload': Icons.UploadIcon,
  'share': Icons.ShareIcon,
  'like': Icons.LikeIcon,
  'comment': Icons.CommentIcon,
  'notification': Icons.NotificationIcon,
  'calendar': Icons.CalendarIcon,
  'clock': Icons.ClockIcon,
  'location': Icons.LocationIcon,
  'phone': Icons.PhoneIcon,
  'email': Icons.EmailIcon,
  'link': Icons.LinkIcon,
  'image': Icons.ImageIcon,
  'video': Icons.VideoIcon,
  'file': Icons.FileIcon,
  'folder': Icons.FolderIcon,
  'lock': Icons.LockIcon,
  'unlock': Icons.UnlockIcon,
  'eye': Icons.EyeIcon,
  'eye-off': Icons.EyeOffIcon,
  'check': Icons.CheckIcon,
  'info': Icons.InfoIcon,
  'warning': Icons.WarningIcon,
  'error': Icons.ErrorIcon,
  'success': Icons.SuccessIcon,
};

export interface IconProps extends IconComponentProps {}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent {...props} />;
};