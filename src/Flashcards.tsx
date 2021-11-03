import { useEffect, useState } from 'react';
import { FaEdit, FaReply, FaTrashAlt } from 'react-icons/fa';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Heading } from './Heading';
import { supabase } from './supabaseClient';

interface FlashcardsRowProps {
    itemNumber: number;
    front: string;
    back: string;
    onDelete: () => void;
}

function FlashcardsRow({ itemNumber, front, back, onDelete }: FlashcardsRowProps) {
    return (
        <li className="grid grid-cols-flashcard text-xl w-full">
            <span className="border-1 border-dark-grey px-10 py-6">{itemNumber}.</span>
            <span className="font-sriracha text-primary border-1 border-dark-grey px-10 py-6">{front}</span>
            <span className="font-sriracha text-primary border-1 border-dark-grey px-10 py-6">{back}</span>
            <span className="border-1 border-dark-grey px-10 py-6 flex gap-4 items-center cursor-pointer">
                <Button type="button" variant="tertiary">
                    <FaEdit className="text-secondary mb-1" />
                    Edit
                </Button>
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

export function Flashcards() {
    let { categoryname } = useParams();
    let location = useLocation();
    let [flashcards, setFlashcards] = useState<{ id: number; front: string; back: string }[] | undefined>();

    async function handleDelete(flashcardId) {
        try {
            const { data, error } = await supabase.from('flashcards').delete().eq('id', flashcardId);
            setFlashcards((flashcards) => {
                return flashcards?.filter((flashcard) => flashcard.id !== flashcardId);
            });
            console.log(data);
        } catch (error) {
            console.log(error.error_description || error.message);
        }
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

                setFlashcards(flashcardsData);
            } catch (error) {
                console.log(error.error_description || error.message);
            }
        }
        fetchFlashcards();
    }, []);

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
                                />
                            );
                        })}
                    </ul>
                    <div className="mt-10 flex gap-4">
                        <Button type="button" variant="primary">
                            + Add
                        </Button>
                        <Button type="button" variant="secondary">
                            Learn!
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="my-32 flex flex-col items-center gap-8">
                    <div className="font-semibold text-2xl">You don't have any flashcards in this category...</div>
                    <Button type="button" variant="primary">
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
