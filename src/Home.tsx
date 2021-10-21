import { Button } from './Button';
import { useHistory } from 'react-router-dom';
import { useAuth } from './App';

export function Home() {
    const history = useHistory();

    const { isAuth } = useAuth();

    function onRegister() {
        history.push('/register');
    }

    function onNewFlashcard() {
        history.push('/new-flashcard');
    }

    return (
        <main className="flex flex-grow">
            <div className="relative w-3/5 h-2/3 mx-auto my-auto bg-home-background bg-cover flex flex-col justify-center items-center gap-20 rounded-xl pb-20">
                <div className="absolute inset-0 w-full h-full bg-gray-700 bg-opacity-50 rounded-xl"></div>
                <div className="font-bold text-4xl text-white z-10 text-center">
                    {isAuth ? "Let's create new flashcards!" : 'Create account and create your own flashcards!'}{' '}
                </div>
                <Button type="button" variant="primary" onClick={isAuth ? onNewFlashcard : onRegister}>
                    {isAuth ? 'Create new flashcard' : 'Create account!'}
                </Button>
            </div>
        </main>
    );
}
