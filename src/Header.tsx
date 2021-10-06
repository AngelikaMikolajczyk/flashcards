import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from './Button';
import { AuthContext } from './App';
import { supabase } from './supabaseClient';

function AuthedMenu() {
    const history = useHistory();

    async function onLogOut() {
        try {
            const { error } = await supabase.auth.signOut();
            history.push('/');
            if (error) throw error;
        } catch (error) {
            console.log(error.error_description || error.message);
        }
    }

    return (
        <div className="flex flex-row items-center gap-10">
            <nav className="flex flex-row text-xl gap-8 text-normal border-r-2 border-secondary pr-10 h-12 items-center">
                <div>
                    <Link to="/">+ Create</Link>
                </div>
                <div>
                    <Link to="/">My flashcards</Link>
                </div>
                <div>
                    <Link to="/">My account</Link>
                </div>
            </nav>
            <div>
                <Button type="button" variant="secondary" children="Log out" onClick={onLogOut} />
            </div>
        </div>
    );
}

function NoAuthedMenu() {
    const history = useHistory();

    function onRegister() {
        history.push('/register');
    }

    function onLogIn() {
        history.push('/login');
    }

    return (
        <div className="flex flex-row gap-8">
            <Button type="button" variant="secondary" children="Log in" onClick={onLogIn} />
            <Button type="button" variant="primary" children="Register" onClick={onRegister} />
        </div>
    );
}

export function Header() {
    const { isAuth, setAuthState } = useContext(AuthContext);
    return (
        <header className="flex flex-row justify-between items-center h-20 px-8 border-b-2 border-secondary text-primary shadow-md bg-white">
            <div>
                <Link to="/">
                    <p className="font-sriracha text-3xl">FlashCards</p>
                    <p className="font-sriracha text-2xl">online</p>
                </Link>
            </div>
            <div>{isAuth ? <AuthedMenu /> : <NoAuthedMenu />}</div>
        </header>
    );
}
