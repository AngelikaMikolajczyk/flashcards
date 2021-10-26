import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Header } from '../Header';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { Register } from '../Register';
import { Login } from '../Login';
import * as appModule from '../App';

// Not authed user

test('render Header for NOT logged user', () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
        </Router>
    );

    const goHomeLogoLink = screen.getByRole('link', { name: /FlashCards online/ });
    const loginButton = screen.getByRole('button', { name: /Log in/ });
    const registerButton = screen.getByRole('button', { name: /Register/ });

    expect(goHomeLogoLink).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
});

test('click Logo link and go to home page', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
        </Router>
    );

    const goHomeLogoLink = screen.getByRole('link', { name: /FlashCards online/ });

    fireEvent.click(goHomeLogoLink);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/');
    });
});

test('click Register button and go to Register page', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
            <Register />
        </Router>
    );
    const header = screen.getByRole('banner');
    const registerButton = within(header).getByRole('button', { name: /Register/ });

    fireEvent.click(registerButton);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/register');
    });
});

test('click Log in button and go to Log in page', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
            <Login />
        </Router>
    );
    const header = screen.getByRole('banner');
    const registerButton = within(header).getByRole('button', { name: /Log in/ });

    fireEvent.click(registerButton);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/login');
    });
});

// Authed user

test('render Header for logged user', () => {
    jest.spyOn(appModule, 'useAuth').mockReturnValue({ isAuth: true, setAuthState: () => null });

    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
        </Router>
    );

    const goHomeLogoLink = screen.getByRole('link', { name: /FlashCards online/ });
    const createLink = screen.getByRole('link', { name: /\+ Create/ });
    const flashcardsLink = screen.getByRole('link', { name: /My flashcards/ });
    const accountLink = screen.getByRole('link', { name: /My account/ });
    const logoutButton = screen.getByRole('button', { name: /Log out/ });

    expect(goHomeLogoLink).toBeInTheDocument();
    expect(createLink).toBeInTheDocument();
    expect(flashcardsLink).toBeInTheDocument();
    expect(accountLink).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
});

test('click create link and go to create flashcard page', async () => {
    jest.spyOn(appModule, 'useAuth').mockReturnValue({ isAuth: true, setAuthState: () => null });

    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
        </Router>
    );

    const createLink = screen.getByRole('link', { name: /\+ Create/ });

    fireEvent.click(createLink);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/new-flashcard');
    });
});

test('click My flashcards link and go to flashcards categories page', async () => {
    jest.spyOn(appModule, 'useAuth').mockReturnValue({ isAuth: true, setAuthState: () => null });

    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
        </Router>
    );

    const flashcardsLink = screen.getByRole('link', { name: /My flashcards/ });

    fireEvent.click(flashcardsLink);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/categories');
    });
});

test('click My account link and go to account info page', async () => {
    jest.spyOn(appModule, 'useAuth').mockReturnValue({ isAuth: true, setAuthState: () => null });

    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
        </Router>
    );

    const accountLink = screen.getByRole('link', { name: /My account/ });

    fireEvent.click(accountLink);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/my-account');
    });
});

test('click Log out button and go to home page', async () => {
    jest.spyOn(appModule, 'useAuth').mockReturnValue({ isAuth: true, setAuthState: () => null });

    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Header />
        </Router>
    );

    const logoutButton = screen.getByRole('button', { name: /Log out/ });

    fireEvent.click(logoutButton);
    await waitFor(() => {
        expect(history.location.pathname).toBe('/');
    });
});
