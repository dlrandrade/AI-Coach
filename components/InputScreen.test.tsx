import { render, screen, fireEvent } from '@testing-library/react';
import { InputScreen } from './InputScreen';
import { describe, it, expect, vi } from 'vitest';

describe('InputScreen', () => {
    it('renders the branding correctly', () => {
        render(<InputScreen onAnalyze={() => { }} />);
        expect(screen.getByText('AI COACH')).toBeInTheDocument();
    });

    it('updates input value on typing', () => {
        render(<InputScreen onAnalyze={() => { }} />);
        const input = screen.getByPlaceholderText('seu_perfil');
        fireEvent.change(input, { target: { value: 'test_user' } });
        expect(input).toHaveValue('test_user');
    });

    it('calls onAnalyze when form is submitted', () => {
        const mockAnalyze = vi.fn();
        render(<InputScreen onAnalyze={mockAnalyze} />);
        const input = screen.getByPlaceholderText('seu_perfil');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'test_user' } });
        fireEvent.click(button);

        expect(mockAnalyze).toHaveBeenCalledWith('test_user');
    });
});
