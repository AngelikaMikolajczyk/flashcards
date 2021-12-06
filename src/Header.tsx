import { Link, useHistory } from 'react-router-dom';
import { Button } from './Button';
import { supabase } from './supabaseClient';
import { useAuth } from './App';
import useDarkMode from './useDarkMode';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { IconButton } from './IconButton';

type UnknownError = {
    error_description?: string;
    message?: string;
};

function AuthedMenu() {
    const history = useHistory();

    async function onLogOut() {
        try {
            const { error } = await supabase.auth.signOut();
            history.push('/');
            if (error) throw error;
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    }

    return (
        <div className="flex flex-row items-center gap-10">
            <nav className="flex flex-row text-xl gap-8 text-normal dark:text-dark-normal border-r-2 border-secondary dark:border-gray-800 pr-10 h-12 items-center">
                <div>
                    <Link to="/new-flashcard">+ Create</Link>
                </div>
                <div>
                    <Link to="/categories">My flashcards</Link>
                </div>
                <div>
                    <Link to="/my-account">My account</Link>
                </div>
            </nav>
            <div>
                <Button type="button" variant="secondary" onClick={onLogOut}>
                    Log out
                </Button>
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
    const { isAuth } = useAuth();
    const [colorMode, setMode] = useDarkMode();

    return (
        <header className="flex flex-row justify-between items-center h-20 px-8 border-b-2 border-secondary text-primary dark:text-dark-primary shadow-md bg-white dark:bg-gray-700 dark:border-gray-800">
            <div>
                <Link to="/">
                    <p className="font-sriracha text-3xl">FlashCards</p>
                    <p className="font-sriracha text-2xl">online</p>
                </Link>
            </div>
            <div className="flex items-center gap-8">
                <div>{isAuth ? <AuthedMenu /> : <NoAuthedMenu />}</div>

                <IconButton
                    onClick={() => setMode(colorMode)}
                    className="text-3xl w-10 h-10 bg-primary rounded-full flex justify-center items-center text-yellow-100 dark:bg-inactive dark:text-gray-600"
                >
                    {colorMode === 'light' ? (
                        <MdOutlineLightMode className="w-6 h-6" />
                    ) : (
                        <MdDarkMode className="w-6 h-6" />
                    )}
                </IconButton>
            </div>
        </header>
    );
}
