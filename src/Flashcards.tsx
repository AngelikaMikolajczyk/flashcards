import { useEffect, useState } from 'react';
import { FaEdit, FaReply, FaTrashAlt } from 'react-icons/fa';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Heading } from './Heading';
import { supabase } from './supabaseClient';

interface FlashcardsRowProps {
    itemNumber: number;
    front: string;
    back: string;
    onDelete: () => void;
    categoryname: string;
    flashcardId: number;
    categoryId: number;
}

function FlashcardsRow({
    itemNumber,
    front,
    back,
    onDelete,
    categoryname,
    flashcardId,
    categoryId,
}: FlashcardsRowProps) {
    return (
        <li className="grid grid-cols-flashcard text-xl w-full">
            <span className="border-1 border-dark-grey px-10 py-6">{itemNumber}.</span>
            <span className="font-sriracha text-primary border-1 border-dark-grey px-10 py-6">{front}</span>
            <span className="font-sriracha text-primary border-1 border-dark-grey px-10 py-6">{back}</span>
            <span className="border-1 border-dark-grey px-10 py-6 flex gap-4 items-center cursor-pointer">
                <Link
                    to={{
                        pathname: '/categories/' + categoryname + '/edit-flashcard',
                        state: { flashcardId: flashcardId, front: front, back: back, categoryId: categoryId },
                    }}
                    className="flex gap-4 items-center"
                >
                    <FaEdit className="text-secondary mb-1" />
                    Edit
                </Link>
            </span>
            <span className="border-1 border-dark-grey px-10 py-6">
                <Button type="button" variant="tertiary" onClick={onDelete}>
                    <FaTrashAlt className="text-secondary mb-1" />
                    Delete
                </Button>
            </span>
        </li>
    );
}

type UnknownError = {
    error_description?: string;
    message?: string;
};

export function Flashcards() {
    let { categoryname } = useParams<{ categoryname: string }>();
    let location = useLocation<{ categoryId: number }>();
    let [flashcards, setFlashcards] = useState<{ id: number; front: string; back: string }[] | undefined>();
    const history = useHistory();

    async function handleDelete(flashcardId: number) {
        try {
            const { error } = await supabase.from('flashcards').delete().eq('id', flashcardId);
            setFlashcards((flashcards) => {
                return flashcards?.filter((flashcard) => flashcard.id !== flashcardId);
            });

            if (error) throw error;
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    }

    function handleAdd() {
        history.push('/categories/' + categoryname + '/new-flashcard');
    }

    function handleLearn() {
        history.push('/');
    }

    useEffect(() => {
        async function fetchFlashcards() {
            try {
                let { data: flashcardsData, error } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('user_id', supabase.auth.user()?.id)
                    .eq('category_id', location.state.categoryId);

                if (error) throw error;

                if (flashcardsData) {
                    setFlashcards(flashcardsData);
                }
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
            }
        }
        fetchFlashcards();
    }, [location.state.categoryId]);

    if (!flashcards) return null;

    return (
        <main className="flex flex-grow flex-col items-center mx-auto pt-14">
            <Heading variant="primary">
                Your FlashCards in category <span className="text-secondary">{categoryname}</span>
            </Heading>
            {flashcards.length !== 0 ? (
                <div className="my-32">
                    <div className="grid grid-cols-flashcard text-xl w-full pb-4">
                        <span></span>
                        <span className="justify-self-center font-bold">front</span>
                        <span className="justify-self-center font-bold">back</span>
                    </div>
                    <ul className="border-1 border-dark-grey">
                        {flashcards.map((flashcard, index) => {
                            return (
                                <FlashcardsRow
                                    itemNumber={index + 1}
                                    front={flashcard.front}
                                    back={flashcard.back}
                                    key={flashcard.id}
                                    onDelete={() => handleDelete(flashcard.id)}
                                    categoryname={categoryname}
                                    flashcardId={flashcard.id}
                                    categoryId={location.state.categoryId}
                                />
                            );
                        })}
                    </ul>
                    <div className="mt-10 flex gap-4">
                        <Button type="button" variant="primary" onClick={handleAdd}>
                            + Add
                        </Button>
                        <Link
                            to={'/learning/' + categoryname}
                            className="text-xl z-10 rounded-xl bg-transparent px-3.5 py-1.5 border-2 border-primary text-normal text-opacity-60"
                        >
                            Learn!
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="my-32 flex flex-col items-center gap-8">
                    <div className="font-semibold text-2xl">You don't have any flashcards in this category...</div>
                    <Button type="button" variant="primary" onClick={handleAdd}>
                        + Add first flashcard in this category
                    </Button>
                </div>
            )}
            <Link to="/categories" className="text-normal text-opacity-60 flex items-center gap-4">
                <FaReply />
                <span>Back to the flashcards category list</span>
            </Link>
        </main>
    );
}
