import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Home } from '../Home';
import * as appModule from '../App';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { CreateFlashcard } from '../CreateFlashcard';
import { Register } from '../Register';
import { Router } from 'react-router';

test('render Home page for NOT logged user', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Home />
            <Register />
        </Router>
    );

    expect(screen.getByText(/Create account and create your own flashcards!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Let's create new flashcards!/i)).toBeNull();

    expect(screen.getByText(/Create account!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Create new flashcard/i)).toBeNull();

    const button = screen.getByRole('button', { name: /Create account!/ });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Create new flashcard/ })).toBeNull();

    fireEvent.click(button);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/register');
    });
});

test('render Home page for logged user', async () => {
    jest.spyOn(appModule, 'useAuth').mockReturnValue({ isAuth: true, setAuthState: () => null });

    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Home />
            <CreateFlashcard />
        </Router>
    );

    expect(screen.getByText(/Let's create new flashcards!/)).toBeInTheDocument();
    expect(screen.queryByText(/Create account and create your own flashcards!/i)).toBeNull();

    expect(screen.getByText(/Create new flashcard/)).toBeInTheDocument();
    expect(screen.queryByText(/Create account!/i)).toBeNull();

    const button = screen.getByRole('button', { name: /Create new flashcard/ });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Create account!/ })).toBeNull();

    fireEvent.click(button);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/new-flashcard');
    });
});
