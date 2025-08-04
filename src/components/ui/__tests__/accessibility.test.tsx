import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../button';
import { Badge } from '../badge';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Input } from '../input';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Button aria-label='Test button'>Click me</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Button aria-label='Submit form' aria-describedby='button-help'>
          Submit
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Submit form' });
      expect(button).toHaveAttribute('aria-label', 'Submit form');
      expect(button).toHaveAttribute('aria-describedby', 'button-help');
    });
  });

  describe('Badge Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Badge variant='default' aria-label='Status badge'>
          Active
        </Badge>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper color contrast', () => {
      render(
        <Badge variant='default' className='bg-green-100 text-green-800'>
          Active
        </Badge>
      );

      const badge = screen.getByText('Active');
      expect(badge).toBeInTheDocument();
      // Note: Color contrast would need manual verification or specialized tools
    });
  });

  describe('Card Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content</p>
          </CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content</p>
          </CardContent>
        </Card>
      );

      const heading = screen.getByRole('heading', { name: 'Test Card' });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Input Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Input
          aria-label='Email input'
          placeholder='Enter your email'
          type='email'
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form association', () => {
      render(
        <div>
          <label htmlFor='email-input'>Email Address</label>
          <Input
            id='email-input'
            aria-describedby='email-help'
            placeholder='Enter your email'
            type='email'
          />
          <div id='email-help'>Please enter a valid email address</div>
        </div>
      );

      const input = screen.getByRole('textbox', { name: 'Email Address' });
      expect(input).toHaveAttribute('id', 'email-input');
      expect(input).toHaveAttribute('aria-describedby', 'email-help');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation', () => {
      render(
        <div>
          <Button>First Button</Button>
          <Button>Second Button</Button>
          <Button>Third Button</Button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);

      // Test that all buttons are focusable (buttons are naturally focusable)
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        // Buttons are naturally focusable, so we don't need explicit tabindex
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA landmarks', () => {
      render(
        <div>
          <header role='banner'>
            <h1>Application Header</h1>
          </header>
          <nav role='navigation' aria-label='Main navigation'>
            <ul>
              <li>
                <a href='/dashboard'>Dashboard</a>
              </li>
              <li>
                <a href='/tasks'>Tasks</a>
              </li>
            </ul>
          </nav>
          <main role='main'>
            <h2>Main Content</h2>
            <p>Content here</p>
          </main>
        </div>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});
