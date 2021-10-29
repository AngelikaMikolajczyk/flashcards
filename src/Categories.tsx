import { Heading } from './Heading';
import { FaRegSadCry } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { FaLeanpub } from 'react-icons/fa';

interface FlashcardsCategoryRowProps {
    categoryName: string;
    categoryId: number;
    categoryValue: number;
    unit: 'item' | 'items' | null;
}

function FlashcardsCategoryRow({ categoryName, categoryId, categoryValue, unit }: FlashcardsCategoryRowProps) {
    return (
        <li key={categoryId} className="flex text-xl gap-20">
            <span className="font-bold">{categoryName}</span>
            <span>
                {categoryValue ?? 0} {unit}
            </span>
            <span className="font-bold text-secondary">
                <FaLeanpub />
                Learn!
            </span>
        </li>
    );
}

export function Categories() {
    const [categories, setCategories] = useState<{ name: string; id: number }[] | undefined>();
    const [flashcards, setFlashcards] = useState<{ id: number; category_id: number }[] | undefined>();

    useEffect(() => {
        async function fetchCategories() {
            try {
                let { data: categoryData, error: categoryError } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('user_id', supabase.auth.user()?.id);
                setCategories(categoryData ?? undefined);
                if (categoryError) throw categoryError;

                let { data: flashcardsData, error: flashcardsError } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('user_id', supabase.auth.user()?.id);
                setFlashcards(flashcardsData ?? undefined);
                if (flashcardsError) throw flashcardsError;
            } catch (error) {
                console.log(error.error_description || error.message);
            }
        }
        fetchCategories();
    }, []);

    //  Record<number, number> <==> {[category_id: number]: number}

    if (!flashcards) return null;

    const flashcardsCount = flashcards.reduce<Record<number, number>>((acc, currentValue) => {
        if (!acc[currentValue.category_id]) {
            acc[currentValue.category_id] = 1;
        } else {
            acc[currentValue.category_id] += 1;
        }
        return acc;
    }, {});

    return (
        <main className="flex flex-grow flex-col items-center mx-auto w-2/5 pt-14">
            <Heading variant="primary">Your FlashCards categories</Heading>
            {!categories ? (
                <>
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
                </>
            ) : (
                <div className="w-2/5 my-10">
                    <ul className="flex flex-col gap-10">
                        {categories.map((category) => {
                            return (
                                <FlashcardsCategoryRow
                                    categoryName={category.name}
                                    categoryId={category.id}
                                    categoryValue={flashcardsCount[category.id] ?? 0}
                                    unit={
                                        flashcardsCount ? (flashcardsCount[category.id] === 1 ? 'item' : 'items') : null
                                    }
                                />
                            );
                        })}
                    </ul>
                </div>
            )}
        </main>
    );
}
