import React, { useState } from 'react';
import { Icon, IconName } from '../src';

const App: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<IconName>('home');
  const [iconSize, setIconSize] = useState<number>(24);
  const [iconColor, setIconColor] = useState<string>('#000000');

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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>图标库示例</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>图标选择器</h3>
        <select 
          value={selectedIcon} 
          onChange={(e) => setSelectedIcon(e.target.value as IconName)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          {iconNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        
        <label style={{ marginRight: '10px' }}>
          大小: 
          <input 
            type="range" 
            min="16" 
            max="64" 
            value={iconSize} 
            onChange={(e) => setIconSize(Number(e.target.value))}
            style={{ marginLeft: '5px' }}
          />
          {iconSize}px
        </label>
        
        <label>
          颜色: 
          <input 
            type="color" 
            value={iconColor} 
            onChange={(e) => setIconColor(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>当前图标</h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}>
          <Icon 
            name={selectedIcon} 
            size={iconSize} 
            color={iconColor}
            title={`${selectedIcon} icon`}
          />
          <span>图标名称: {selectedIcon}</span>
        </div>
      </div>

      <div>
        <h3>所有图标</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '10px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}>
          {iconNames.map(name => (
            <div 
              key={name}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => setSelectedIcon(name)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icon name={name} size={24} color="#666" />
              <span style={{ fontSize: '12px', marginTop: '5px' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>交互示例</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Icon 
            name="heart" 
            size={32} 
            color="#ff4757"
            onClick={() => alert('点击了心形图标！')}
            style={{ cursor: 'pointer' }}
          />
          <Icon 
            name="star" 
            size={32} 
            color="#ffa502"
            onClick={() => alert('点击了星形图标！')}
            style={{ cursor: 'pointer' }}
          />
          <Icon 
            name="settings" 
            size={32} 
            color="#3742fa"
            onClick={() => alert('点击了设置图标！')}
            style={{ cursor: 'pointer' }}
          />
          <Icon 
            name="delete" 
            size={32} 
            color="#ff4757"
            disabled
            title="禁用状态"
          />
        </div>
      </div>
    </div>
  );
};

export default App;