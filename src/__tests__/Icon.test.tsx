import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Icon } from '../components/Icon';

describe('Icon Component', () => {
  it('renders icon with correct name', () => {
    render(<Icon name="home" />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'home');
  });

  it('renders icon with custom size', () => {
    render(<Icon name="home" size={32} />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('width', '32px');
    expect(icon).toHaveAttribute('height', '32px');
  });

  it('renders icon with custom color', () => {
    render(<Icon name="home" color="red" />);
    const path = screen.getByRole('img').querySelector('path');
    expect(path).toHaveAttribute('fill', 'red');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Icon name="home" onClick={handleClick} />);
    const icon = screen.getByRole('img');
    fireEvent.click(icon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles mouse events', () => {
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();
    render(
      <Icon 
        name="home" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );
    const icon = screen.getByRole('img');
    
    fireEvent.mouseEnter(icon);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(icon);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    render(<Icon name="home" disabled />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('icon-disabled');
    expect(icon).toHaveStyle({ opacity: '0.5', cursor: 'not-allowed' });
  });

  it('renders with custom title', () => {
    render(<Icon name="home" title="Home Icon" />);
    const title = screen.getByText('Home Icon');
    expect(title).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Icon name="home" className="custom-class" />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('custom-class');
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'blue' };
    render(<Icon name="home" style={customStyle} />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveStyle(customStyle);
  });

  it('warns when icon name is not found', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    render(<Icon name="invalid-icon" />);
    expect(consoleSpy).toHaveBeenCalledWith('Icon "invalid-icon" not found');
    consoleSpy.mockRestore();
  });
});