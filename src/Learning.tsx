import { useEffect, useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Heading } from './Heading';
import { supabase } from './supabaseClient';
import { Flashcard } from './types';

type UnknownError = {
    error_description?: string;
    message?: string;
};

type Site = 'front' | 'back' | 'frontForTheFirstTime';

function filterUnknownFlashcards(flashcards: Flashcard[]) {
    return flashcards.filter((flashcard) => flashcard.is_known === false);
}

export function Learning() {
    const { categoryname } = useParams<{ categoryname: string }>();
    const location = useLocation<{ categoryId: number }>();

    const [flashcards, setFlashcards] = useState<Flashcard[] | undefined>();
    const [site, setSite] = useState<Site>('frontForTheFirstTime');
    const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | undefined>();
    const [dateNow, setDateNow] = useState<Date>(new Date());

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
                        setCurrentFlashcard(filterUnknownFlashcards(data)[0]);
                    }
                }
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
            }
        }
        fetchFlashcards();
    }, [currentFlashcard, location.state.categoryId, dateNow]);

    if (flashcards === undefined) {
        return <>Loading...</>;
    }

    function reviewedFlashcardsCount(
        flashcards: { id: number; front: string; back: string; is_known: boolean; is_reviewed: boolean }[]
    ) {
        return flashcards.filter((flashcard) => flashcard.is_reviewed === true);
    }

    async function handleTurnFlashcard() {
        if (site === 'frontForTheFirstTime') {
            setSite('back');
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
        } else if (site === 'back') {
            setSite('front');
        } else {
            setSite('back');
        }
    }

    function drawIndexNumber(f = flashcards) {
        if (!f) {
            return -1;
        }
        return Math.floor(Math.random() * filterUnknownFlashcards(f).length);
    }

    function handleShuffleFalshcard() {
        const index = drawIndexNumber();
        setCurrentFlashcard(filterUnknownFlashcards(flashcards!)[index]);
        setSite('frontForTheFirstTime');
    }

    function handleNotKnow() {
        const index = drawIndexNumber();
        setCurrentFlashcard(filterUnknownFlashcards(flashcards!)[index]);
        setSite('frontForTheFirstTime');
    }

    async function handleKnow() {
        try {
            const { error } = await supabase
                .from('flashcards')
                .update({ is_known: true })
                .eq('id', currentFlashcard?.id);

            if (error) throw error;

            setCurrentFlashcard((prevCurrentFlashcard) => {
                const withoutCurrentFlashcard = flashcards!.filter(
                    (flashcard) => flashcard.id !== prevCurrentFlashcard?.id
                );
                const index = drawIndexNumber(withoutCurrentFlashcard);
                return filterUnknownFlashcards(withoutCurrentFlashcard)[index];
            });
            setSite('frontForTheFirstTime');
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    }

    async function handleResetFlashcardsSet() {
        try {
            const { error } = await supabase
                .from('flashcards')
                .update({ is_known: false, is_reviewed: false })
                .eq('user_id', supabase.auth.user()?.id)
                .eq('category_id', location.state.categoryId);

            if (error) throw error;

            setDateNow(new Date());
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    }

    console.log(currentFlashcard);

    return (
        <main className="flex grow flex-col items-center mx-auto pt-14">
            <div className="flex justify-between w-full items-end">
                <Heading variant="primary">Learning:</Heading>
                <span className="text-secondary dark:text-dark-secondary text-4xl font-bold">{categoryname}</span>
            </div>
            {currentFlashcard ? (
                <>
                    <div className="grid grid-cols-2 py-10">
                        <span className="text-xl dark:text-dark-normal">
                            {flashcards ? flashcards.length : 0}{' '}
                            {flashcards ? (flashcards.length === 1 ? 'flashcard' : 'flashcards') : 'flashcards'} in this
                            category
                        </span>
                        <span className="text-xl dark:text-dark-normal">
                            {flashcards ? reviewedFlashcardsCount(flashcards).length : 0}{' '}
                            {flashcards
                                ? reviewedFlashcardsCount(flashcards).length === 1
                                    ? 'flashcard'
                                    : 'flashcards'
                                : 'flashcards'}{' '}
                            reviewed in this category
                        </span>
                        <span className="text-xl dark:text-dark-normal">
                            {flashcards ? flashcards.length - filterUnknownFlashcards(flashcards).length : 0}{' '}
                            {flashcards
                                ? flashcards.length - filterUnknownFlashcards(flashcards).length === 1
                                    ? 'flashcard'
                                    : 'flashcards'
                                : 'flashcards'}{' '}
                            learned
                        </span>
                        <span className="text-xl dark:text-dark-normal">
                            {flashcards ? filterUnknownFlashcards(flashcards).length : 0}{' '}
                            {flashcards
                                ? filterUnknownFlashcards(flashcards).length === 1
                                    ? 'flashcard'
                                    : 'flashcards'
                                : 'flashcards'}{' '}
                            still to learn
                        </span>
                    </div>
                    <div className="flex flex-col w-full items-center py-8">
                        <span className="font-semibold text-normal dark:text-dark-normal text-opacity-60 text-xl">
                            {site === 'frontForTheFirstTime' ? 'front' : site}:
                        </span>
                        <span
                            className={`text-3xl text-normal dark:text-dark-normal text-opacity-80 font-sriracha border-3 border-secondary dark:border-dark-secondary rounded-xl p-4 w-2/3 text-center py-12 ${
                                site === ('front' || 'frontForTheFirstTime')
                                    ? 'bg-flashcard dark:bg-dark-flashcard'
                                    : 'bg-secondary dark:bg-dark-secondary'
                            }`}
                        >
                            {currentFlashcard
                                ? currentFlashcard[site === 'frontForTheFirstTime' ? 'front' : site]
                                : null}
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
                </>
            ) : (
                <div className="pt-14 flex flex-col gap-14">
                    <Heading variant="normal">You have learned all flashcards in this category!</Heading>
                    <div className="flex flex-col gap-8 items-center">
                        <div className="font-bold text-xl text-normal dark:text-dark-normal text-opacity-60">
                            Do you want to learn again?
                        </div>
                        <Button type="button" variant="primary" onClick={handleResetFlashcardsSet}>
                            Yes, reset this set
                        </Button>
                    </div>
                </div>
            )}
            <Link
                to="/categories"
                className="text-normal dark:text-dark-normal text-opacity-60 flex items-center gap-4 pt-14"
            >
                <FaReply />
                <span>Back to the flashcards category list</span>
            </Link>
        </main>
    );
}
