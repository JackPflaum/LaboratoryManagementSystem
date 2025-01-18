import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  // create mock function for toggleTheme
  const mockToggleTheme = jest.fn();

  render(<App toggleTheme={mockToggleTheme} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
