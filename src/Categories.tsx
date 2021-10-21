import { Heading } from './Heading';
import { FaRegSadCry } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Categories() {
    return (
        <main>
            <Heading variant="primary">Your FlashCards categories</Heading>
            <div className="flex gap-2 items-center">
                <span>You don't have any flashcards yet</span>
                <FaRegSadCry />
            </div>
            <div>
                Go and create your first flashcard{' '}
                <Link to="/" className="text-primary font-bold">
                    here
                </Link>
            </div>
        </main>
    );
}
