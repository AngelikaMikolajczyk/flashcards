import { Button } from './Button';
import { useHistory } from 'react-router-dom';

export function Home() {
    const history = useHistory();

    function onRegister() {
        history.push('/register');
    }
    return (
        <main className="flex flex-grow">
            <div className="relative w-3/5 h-2/3 mx-auto my-auto bg-home-background bg-cover flex flex-col justify-center items-center gap-20 rounded-xl pb-20">
                <div className="absolute inset-0 w-full h-full bg-gray-700 bg-opacity-50 rounded-xl"></div>
                <div className="font-bold text-4xl text-white z-10 text-center">
                    Create account and create your own flashcards!{' '}
                </div>
                <Button type="button" variant="primary" onClick={onRegister}>
                    Create account!
                </Button>
            </div>
        </main>
    );
}
