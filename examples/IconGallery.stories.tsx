import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Icon, IconName } from '../src';

export default {
  title: 'Components/Icon Gallery',
  component: Icon,
} as Meta;

const iconNames: IconName[] = [
  'home', 'search', 'user', 'settings', 'heart', 'star',
  'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
  'close', 'menu', 'plus', 'minus', 'edit', 'delete',
  'download', 'upload', 'share', 'like', 'comment',
  'notification', 'calendar', 'clock', 'location', 'phone',
  'email', 'link', 'image', 'video', 'file', 'folder',
  'lock', 'unlock', 'eye', 'eye-off', 'check', 'info',
  'warning', 'error', 'success'
];

const Template: Story = () => (
  <div style={{ padding: '20px' }}>
    <h2>图标库</h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '16px',
      padding: '20px',
      border: '1px solid #eee',
      borderRadius: '8px'
    }}>
      {iconNames.map(name => (
        <div 
          key={name}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fafafa';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Icon name={name} size={32} color="#666" />
          <span style={{ 
            fontSize: '12px', 
            marginTop: '8px',
            textAlign: 'center',
            color: '#333'
          }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const Gallery = Template.bind({});