import { Heading } from './Heading';
import { FaRegQuestionCircle, FaRegSadCry, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { FaLeanpub } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import { IconButton } from './IconButton';
import { Flashcard, Category, RequestStatus } from './types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FlashcardsCategoryRowProps {
    categoryName: string;
    categoryId: number;
    categoryValue: number;
    unit: 'item' | 'items' | null;
    onDelete: () => void;
    knowingPercentage: number;
}

type UnknownError = {
    error_description?: string;
    message?: string;
};

function FlashcardsCategoryRow({
    categoryName,
    categoryId,
    categoryValue,
    unit,
    onDelete,
    knowingPercentage,
}: FlashcardsCategoryRowProps) {
    const notifySuccess = () =>
        toast.success('Your flashcard category has been deleted successfully with all flashcards within!', {
            className: () => 'bg-green-50 text-green-700 font-semibold rounded text-center p-1 bg-opacity-90 my-4',
        });
    const notifyError = () =>
        toast.error('There was an error during deleting category!', {
            className: () => 'bg-red-50 text-red-600 font-semibold rounded text-center p-1 bg-opacity-90 my-4',
        });

    async function handleDeleteCategory() {
        try {
            const { error: flashcardsError } = await supabase.from('flashcards').delete().eq('category_id', categoryId);

            if (flashcardsError) throw flashcardsError;

            const { error } = await supabase.from('categories').delete().eq('id', categoryId);

            if (error) throw error;

            notifySuccess();

            onDelete();
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
            notifyError();
        }
    }

    return (
        <li className="grid grid-cols-category text-xl w-full dark:text-dark-normal">
            <Link
                to={{ pathname: '/categories/' + categoryName, state: { categoryId: categoryId } }}
                className="font-bold border border-primary dark:border-dark-primary px-10 py-6"
            >
                {categoryName}
            </Link>
            <span className="border border-primary dark:border-dark-primary px-10 py-6 dark:text-inactive">
                {categoryValue ?? 0} {unit}
            </span>
            <span className="border border-primary dark:border-dark-primary px-10 py-6 dark:text-inactive">
                {knowingPercentage}% learned
            </span>
            <Link
                to={{ pathname: '/learning/' + categoryName, state: { categoryId: categoryId } }}
                className="font-bold text-secondary dark:text-dark-secondary border border-primary dark:border-dark-primary px-10 py-6 flex gap-4 items-center cursor-pointer"
            >
                <FaLeanpub />
                Learn!
            </Link>
            <IconButton
                className="relative font-bold text-primary dark:text-dark-primary border border-primary dark:border-dark-primary px-10 py-6 flex gap-4 items-center cursor-pointer"
                onClick={handleDeleteCategory}
            >
                <FaTrashAlt />
                Delete
                <span className="absolute top-5 right-7">
                    <p data-tip data-for="deleteCategory">
                        <FaRegQuestionCircle className="w-3" />
                    </p>
                    <ReactTooltip
                        id="deleteCategory"
                        className="custom-color-no-arrow"
                        textColor="#FFFFFF"
                        backgroundColor="#FF928B"
                        effect="solid"
                    >
                        <span>Delete category and all flashcards within</span>
                    </ReactTooltip>
                </span>
            </IconButton>
        </li>
    );
}

export function Categories() {
    const [categories, setCategories] = useState<Category[] | undefined>();
    const [flashcards, setFlashcards] = useState<Flashcard[] | undefined>();
    const [dateNow, setDateNow] = useState<Date>(new Date());
    const [requestCategoriesStatus, setRequestRequestStatus] = useState<RequestStatus>('idle');

    useEffect(() => {
        async function fetchCategories() {
            try {
                setRequestRequestStatus('pending');

                let { data: categoryData, error: categoryError } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('user_id', supabase.auth.user()?.id);

                if (categoryError) throw categoryError;

                if (categoryData) {
                    setCategories(categoryData);
                }

                let { data: flashcardsData, error: flashcardsError } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('user_id', supabase.auth.user()?.id);

                if (flashcardsError) throw flashcardsError;

                if (flashcardsData) {
                    setFlashcards(flashcardsData);
                }

                setRequestRequestStatus('success');
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
                setRequestRequestStatus('error');
            }
        }
        fetchCategories();
    }, [dateNow]);

    function updateDateState() {
        setDateNow(new Date());
    }

    //  Record<number, number> <==> {[category_id: number]: number}

    const flashcardsCount =
        flashcards?.reduce<Record<number, number>>((acc, currentValue) => {
            if (!acc[currentValue.category_id]) {
                acc[currentValue.category_id] = 1;
            } else {
                acc[currentValue.category_id] += 1;
            }
            return acc;
        }, {}) ?? {};

    if (!categories) {
        return null;
    }

    const flashcardsKnowledgeLevel =
        flashcards?.reduce<Record<number, number>>((acc, currentValue) => {
            if (!acc[currentValue.category_id]) {
                if (currentValue.is_known) {
                    acc[currentValue.category_id] = 1;
                }
            } else {
                if (currentValue.is_known) {
                    acc[currentValue.category_id] += 1;
                }
            }
            return acc;
        }, {}) ?? {};

    function knowingPercentageCount(categoryId: number) {
        return Math.round((flashcardsKnowledgeLevel[categoryId] / flashcardsCount[categoryId]) * 100);
    }

    return (
        <main className="flex grow flex-col items-center mx-auto pt-14">
            <Heading variant="primary">Your FlashCards categories</Heading>
            {requestCategoriesStatus === 'success' ? (
                categories.length === 0 ? (
                    <div className="flex flex-col gap-8 my-16 text-xl">
                        <div className="flex gap-2 items-center dark:text-dark-normal">
                            <span>You don't have any flashcards yet</span>
                            <FaRegSadCry />
                        </div>
                        <div className="dark:text-dark-normal">
                            Go and create your first flashcard{' '}
                            <Link to="/new-flashcard" className="text-primary dark:text-dark-primary font-bold">
                                here
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="my-10">
                        <ul className="flex flex-col border-2 border-primary dark:border-dark-primary">
                            {categories.map((category) => {
                                return (
                                    <FlashcardsCategoryRow
                                        categoryName={category.name}
                                        categoryId={category.id}
                                        categoryValue={flashcardsCount[category.id] ?? 0}
                                        unit={
                                            flashcardsCount
                                                ? flashcardsCount[category.id] === 1
                                                    ? 'item'
                                                    : 'items'
                                                : null
                                        }
                                        key={category.id}
                                        onDelete={updateDateState}
                                        knowingPercentage={
                                            flashcardsKnowledgeLevel[category.id]
                                                ? knowingPercentageCount(category.id)
                                                : 0
                                        }
                                    />
                                );
                            })}
                        </ul>
                    </div>
                )
            ) : null}
            {requestCategoriesStatus === 'error' ? (
                <div className="flex flex-col gap-8 my-16 text-xl dark:text-dark-normal items-center">
                    <div className="flex gap-2 items-center">
                        An error occured while downloading your flashcards <FaRegSadCry />
                    </div>
                    <div>Please try again later...</div>
                </div>
            ) : null}
            <ToastContainer
                position="bottom-center"
                autoClose={2500}
                hideProgressBar={true}
                closeOnClick={false}
                closeButton={false}
                toastClassName={() =>
                    'bg-primary dark:bg-dark-primary text-white font-semibold rounded text-center p-1 bg-opacity-90'
                }
            />
        </main>
    );
}
