import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Account } from '../Account';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

test('render My account page with New email form and New password form', () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    expect(screen.getByRole('heading', { name: /My account/ })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /New email address/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save new email/ })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /New password/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/New password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm new password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save new password/ })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
});

test('fill New email form with empty value', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Save new email/ }));

    await waitFor(() => {
        expect(screen.getByText(/^email is a required field$/)).toBeInTheDocument();
    });
});

test('fill New email form with invalid value', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Email/ }), { target: { value: 'aaagmail.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Save new email/ }));

    await waitFor(() => {
        expect(screen.getByText(/^email must be a valid email$/)).toBeInTheDocument();
    });
});

test('fill New password form with empty value', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    fireEvent.change(screen.getByLabelText(/New password/), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Confirm new password/), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Save new password/ }));

    await waitFor(() => {
        expect(screen.getByText(/^newPassword is a required field$/)).toBeInTheDocument();
        expect(screen.getByText(/^confirmNewPassword is a required field$/)).toBeInTheDocument();
    });
});

test('fill New password form with invalid values', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    fireEvent.change(screen.getByLabelText(/New password/), { target: { value: 'aaa' } });
    fireEvent.change(screen.getByLabelText(/Confirm new password/), { target: { value: 'aaa' } });

    fireEvent.click(screen.getByRole('button', { name: /Save new password/ }));

    await waitFor(() => {
        expect(
            screen.getByText(
                /password has to contains minimum 6 and maximum 20 characters, at least one letter, one number and one special character: @\$!%\*#\?&$/
            )
        ).toBeInTheDocument();
    });
});

test('fill New password form with invalid confirm password value', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    fireEvent.change(screen.getByLabelText(/New password/), { target: { value: 'aaa1234?' } });
    fireEvent.change(screen.getByLabelText(/Confirm new password/), { target: { value: 'aaa1234' } });

    fireEvent.click(screen.getByRole('button', { name: /Save new password/ }));

    await waitFor(() => {
        expect(screen.getByText(/passwords must match/)).toBeInTheDocument();
    });
});

test('fill new password and enabled confirm password input', () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    expect(screen.getByLabelText(/Confirm new password/)).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/New password/), { target: { value: 'a' } });
    expect(screen.getByLabelText(/Confirm new password/)).toBeEnabled();
});

test('click Cancel button and go to home page', async () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Account />
        </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));

    await waitFor(() => {
        expect(history.location.pathname).toBe('/');
    });
});

// TODO: testing fill New email form and New password form with valid values
