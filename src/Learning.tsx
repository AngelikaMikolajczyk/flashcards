import { useEffect, useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Heading } from './Heading';
import { supabase } from './supabaseClient';

type UnknownError = {
    error_description?: string;
    message?: string;
};

type Site = 'front' | 'back' | 'frontForTheFirstTime';

export function Learning() {
    const { categoryname } = useParams<{ categoryname: string }>();
    let [flashcards, setFlashcards] = useState<
        { id: number; front: string; back: string; is_known: boolean; is_reviewed: boolean }[] | undefined
    >();
    let location = useLocation<{ categoryId: number }>();
    const [site, setSite] = useState<Site>('frontForTheFirstTime');
    let [currentFlashcard, setCurrentFlashcard] = useState<
        { id: number; front: string; back: string; is_known: boolean; is_reviewed: boolean } | undefined
    >();

    useEffect(() => {
        async function fetchFlashcards() {
            try {
                const { data, error } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('user_id', supabase.auth.user()?.id)
                    .eq('category_id', location.state.categoryId);

                if (error) throw error;

                if (data) {
                    setFlashcards(data);
                    if (!currentFlashcard) {
                        setCurrentFlashcard(data[0]);
                    }
                }
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
            }
        }
        fetchFlashcards();
    }, [currentFlashcard, location.state.categoryId]);

    function reviewedFlashcardsCount(
        flashcards: { id: number; front: string; back: string; is_known: boolean; is_reviewed: boolean }[]
    ) {
        return flashcards.filter((flashcard) => flashcard.is_reviewed === true);
    }

    function knownedFlashcardsCount(
        flashcards: { id: number; front: string; back: string; is_known: boolean; is_reviewed: boolean }[]
    ) {
        return flashcards.filter((flashcard) => flashcard.is_known === true);
    }

    function handleTurnFlashcard() {
        async function setFlashcardIsReviewed() {
            try {
                const { error } = await supabase
                    .from('flashcards')
                    .update({ is_reviewed: true })
                    .eq('id', currentFlashcard?.id);

                if (error) throw error;
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
            }
        }
        if (site === 'frontForTheFirstTime') {
            setSite('back');
            setFlashcardIsReviewed();
        } else if (site === 'back') {
            setSite('front');
        } else {
            setSite('back');
        }
    }

    function drawIndexNumber() {
        return Math.floor(Math.random() * flashcards?.length);
    }

    function handleShuffleFalshcard() {
        const index = drawIndexNumber();

        setCurrentFlashcard(flashcards[index]);
        setSite('frontForTheFirstTime');
    }

    function handleNotKnow() {
        async function setFlashcardIsNotKnown() {
            try {
                const { error } = await supabase
                    .from('flashcards')
                    .update({ is_known: false })
                    .eq('id', currentFlashcard?.id);

                if (error) throw error;
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
            }
        }

        if (currentFlashcard?.is_known) {
            setFlashcardIsNotKnown();
        }
        const index = drawIndexNumber();
        setCurrentFlashcard(flashcards[index]);
        setSite('frontForTheFirstTime');
    }

    function handleKnow() {
        async function setFlashcardIsKnown() {
            try {
                const { error } = await supabase
                    .from('flashcards')
                    .update({ is_known: true })
                    .eq('id', currentFlashcard?.id);

                if (error) throw error;
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
            }
        }

        if (!currentFlashcard?.is_known) {
            setFlashcardIsKnown();
        }

        const index = drawIndexNumber();
        setCurrentFlashcard(flashcards[index]);
        setSite('frontForTheFirstTime');
    }

    return (
        <main className="flex flex-grow flex-col items-center mx-auto pt-14">
            <div className="flex justify-between w-full items-end">
                <Heading variant="primary">Learning:</Heading>
                <span className="text-secondary text-4xl font-bold">{categoryname}</span>
            </div>
            <div className="grid grid-cols-2 py-10">
                <span className="text-xl">
                    {flashcards ? flashcards.length : 0}{' '}
                    {flashcards ? (flashcards.length === 1 ? 'flashcard' : 'flashcards') : 'flashcards'} in this
                    category
                </span>
                <span className="text-xl">
                    {flashcards ? reviewedFlashcardsCount(flashcards).length : 0}{' '}
                    {flashcards
                        ? reviewedFlashcardsCount(flashcards).length === 1
                            ? 'flashcard'
                            : 'flashcards'
                        : 'flashcards'}{' '}
                    reviewed in this category
                </span>
                <span className="text-xl">
                    {flashcards ? knownedFlashcardsCount(flashcards).length : 0}{' '}
                    {flashcards
                        ? knownedFlashcardsCount(flashcards).length === 1
                            ? 'flashcard'
                            : 'flashcards'
                        : 'flashcards'}{' '}
                    learned
                </span>
                <span className="text-xl">
                    {flashcards ? flashcards.length - knownedFlashcardsCount(flashcards).length : 0}{' '}
                    {flashcards
                        ? flashcards.length - knownedFlashcardsCount(flashcards).length === 1
                            ? 'flashcard'
                            : 'flashcards'
                        : 'flashcards'}{' '}
                    still to learn
                </span>
            </div>
            <div className="flex flex-col w-full items-center py-8">
                <span className="font-semibold text-normal text-opacity-60 text-xl">
                    {site === 'frontForTheFirstTime' ? 'front' : site}:
                </span>
                <span
                    className={`text-3xl text-normal text-opacity-80 font-sriracha border-3 border-secondary rounded-xl p-4 w-2/3 text-center py-12 ${
                        site === 'front' || 'frontForTheFirstTime' ? 'bg-flashcard' : 'bg-secondary'
                    }`}
                >
                    {currentFlashcard ? currentFlashcard[site === 'frontForTheFirstTime' ? 'front' : site] : null}
                </span>
            </div>
            <div className="grid grid-cols-2 w-full gap-4 justify-items-center py-8">
                <Button type="button" variant="primary" onClick={handleTurnFlashcard}>
                    Turn
                </Button>
                <Button type="button" variant="secondary" onClick={handleShuffleFalshcard}>
                    Shuffle
                </Button>
                <Button
                    type="button"
                    variant={site === 'frontForTheFirstTime' ? 'disabled' : 'success'}
                    onClick={handleKnow}
                >
                    I know
                </Button>
                <Button
                    type="button"
                    variant={site === 'frontForTheFirstTime' ? 'disabled' : 'failed'}
                    onClick={handleNotKnow}
                >
                    I don't know
                </Button>
            </div>
            <Link to="/categories" className="text-normal text-opacity-60 flex items-center gap-4 pt-20">
                <FaReply />
                <span>Back to the flashcards category list</span>
            </Link>
        </main>
    );
}
