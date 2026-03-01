import { render, screen, fireEvent } from '@testing-library/react';
import { InputScreen } from './InputScreen';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('InputScreen', () => {
    beforeEach(() => {
        localStorage.setItem('luzzia_visited_v2', 'true');
    });

    it('renders the branding correctly', () => {
        render(<InputScreen onAnalyze={() => { }} isLoading={false} />);
        expect(screen.getByText('LUZZIA')).toBeInTheDocument();
        expect(screen.getByText('ENGINE v2.1')).toBeInTheDocument();
    });

    it('updates input value on typing', () => {
        render(<InputScreen onAnalyze={() => { }} isLoading={false} />);
        const input = screen.getByPlaceholderText('@usuario');
        fireEvent.change(input, { target: { value: 'test_user' } });
        expect(input).toHaveValue('test_user');
    });

    it('calls onAnalyze when form is submitted', () => {
        const mockAnalyze = vi.fn();
        render(<InputScreen onAnalyze={mockAnalyze} isLoading={false} />);
        const input = screen.getByPlaceholderText('@usuario');
        const objectiveButton = screen.getByText('DOMINAR UM TERRITÓRIO MENTAL');
        const submitButton = screen.getByRole('button', { name: 'INICIAR DIAGNÓSTICO' });

        fireEvent.change(input, { target: { value: 'test_user' } });
        fireEvent.click(objectiveButton);
        fireEvent.click(submitButton);

        expect(mockAnalyze).toHaveBeenCalledWith('test_user', 7, 1);
    });
});
