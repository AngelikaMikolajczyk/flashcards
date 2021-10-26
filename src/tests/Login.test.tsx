import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Login } from '../Login';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

const mockValues = {
    email: 'abc@gmail.com',
    password: 'test1234%',
};

test('render Login form', () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Login />
        </Router>
    );

    expect(screen.getByRole('heading', { name: /Log in/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reset password\?/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
    expect(screen.getByText(/Don't have account\?/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Register now!/ })).toBeInTheDocument();
});

test('fill Login form with empty values', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Login />
        </Router>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Log in/ }));

    await waitFor(() => {
        expect(screen.getByText(/^email is a required field$/)).toBeInTheDocument();
        expect(screen.getByText(/^password is a required field$/)).toBeInTheDocument();
    });
});

test('click Cancel button and go to home page', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Login />
        </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));

    await waitFor(() => {
        expect(history.location.pathname).toBe('/');
    });
});

// TODO: testing fill Login form with valid values

// test.only('click Log in button and go to home page', async () => {
//     const history = createMemoryHistory();
//     render(
//         <Router history={history}>
//             <Login />
//         </Router>
//     );

//     fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: mockValues.email } });
//     fireEvent.change(screen.getByLabelText(/Password/), { target: { value: mockValues.password } });

//     fireEvent.click(screen.getByRole('button', { name: /Log in/ }));

//     await waitFor(() => {
//         expect(history.location.pathname).toBe('/');
//     });
// });
