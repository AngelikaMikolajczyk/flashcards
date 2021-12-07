import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Register } from '../Register';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

const mockValues = {
    email: 'abc@gmail.com',
    password: 'test1234%',
};

test('render Register form', () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Register />
        </Router>
    );

    expect(screen.getByRole('heading', { name: /Register/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
    expect(screen.getByText(/Already have account\?/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log in/ })).toBeInTheDocument();
});

test('fill Register form with empty values', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Register />
        </Router>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/ }));

    await waitFor(() => {
        expect(screen.getByText(/^email is a required field$/)).toBeInTheDocument();
        expect(screen.getByText(/^password is a required field$/)).toBeInTheDocument();
    });
});

test('fill Register form with invalid email value', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Register />
        </Router>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: 'aaaagmail.com' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: mockValues.password } });
    fireEvent.click(screen.getByRole('button', { name: /Register/ }));

    await waitFor(() => {
        expect(screen.getByText(/^email must be a valid email$/)).toBeInTheDocument();
    });
});

test('fill Register form with invalid password value', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Register />
        </Router>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: mockValues.email } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'aaaa' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/ }));

    await waitFor(() => {
        expect(
            screen.getByText(
                /^password has to contains minimum 6 and maximum 20 characters, at least one letter, one number and one special character: @\$!%\*#\?&$/
            )
        ).toBeInTheDocument();
    });
});

test('click Cancel button and go to home page', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Register />
        </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));

    await waitFor(() => {
        expect(history.location.pathname).toBe('/');
    });
});

test('click log in link and go to Login page', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Register />
        </Router>
    );

    fireEvent.click(screen.getByRole('link', { name: /Log in/ }));

    await waitFor(() => {
        expect(history.location.pathname).toBe('/login');
    });
});

// TODO: testing fill Register form with valid values
