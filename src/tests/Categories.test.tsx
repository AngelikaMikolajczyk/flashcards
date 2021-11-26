import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Categories } from '../Categories';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import * as appModule from '../App';
import * as supabaseClientModule from '../supabaseClient';
import { useEffect, useState } from 'react';

test('render Categories page', () => {
    jest.spyOn(supabaseClientModule, 'supabase').mockReturnValue({
        from() {},
    });

    jest.spyOn(appModule, 'useAuth').mockReturnValue({ isAuth: true, setAuthState: () => null });
    const history = createMemoryHistory();

    render(<Router history={history}>{/* <Categories /> */}</Router>);

    // expect(screen.getByText(/Your FlashCards categories/i)).toBeInTheDocument();
});
