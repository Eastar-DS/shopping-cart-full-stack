import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('"장바구니"라는 텍스트가 화면에 보인다', () => {
    render(<App />);
    expect(screen.getByText('장바구니')).toBeInTheDocument();
  });
});
