import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Icon, IconProps } from '../src';

export default {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: [
        'home', 'search', 'user', 'settings', 'heart', 'star',
        'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
        'close', 'menu', 'plus', 'minus', 'edit', 'delete',
        'download', 'upload', 'share', 'like', 'comment',
        'notification', 'calendar', 'clock', 'location', 'phone',
        'email', 'link', 'image', 'video', 'file', 'folder',
        'lock', 'unlock', 'eye', 'eye-off', 'check', 'info',
        'warning', 'error', 'success'
      ],
    },
    size: {
      control: { type: 'range', min: 16, max: 64, step: 4 },
    },
    color: {
      control: 'color',
    },
    disabled: {
      control: 'boolean',
    },
  },
} as Meta;

const Template: Story<IconProps> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'home',
  size: 24,
  color: '#333',
};

export const Large = Template.bind({});
Large.args = {
  name: 'heart',
  size: 48,
  color: '#ff4757',
};

export const Small = Template.bind({});
Small.args = {
  name: 'star',
  size: 16,
  color: '#ffa502',
};

export const Disabled = Template.bind({});
Disabled.args = {
  name: 'delete',
  size: 32,
  color: '#ff4757',
  disabled: true,
};

export const Interactive = Template.bind({});
Interactive.args = {
  name: 'settings',
  size: 32,
  color: '#3742fa',
  onClick: () => alert('图标被点击了！'),
};