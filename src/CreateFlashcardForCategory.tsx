import { Link, useParams } from 'react-router-dom';
import { Heading } from './Heading';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './Button';
import { FaReply } from 'react-icons/fa';
import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Inputs = {
    front: string;
    back: string;
};

type UnknownError = {
    error_description?: string;
    message?: string;
};

const schema = yup
    .object({
        front: yup.string().required(),
        back: yup.string().required(),
    })
    .required();

export function CreateFlashcardForCategory() {
    let { categoryname } = useParams<{ categoryname: string }>();
    const [categoryId, setCategoryId] = useState<{ id: number }[] | undefined>();

    const notify = () => toast(`Your flashcard for ${categoryname} category has been added successfully!`);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        async function fetchCategoryData() {
            try {
                let { data: categoryData, error } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('user_id', supabase.auth.user()?.id)
                    .eq('name', categoryname);

                if (error) throw error;

                if (categoryData) {
                    setCategoryId(categoryData);
                }
            } catch (error) {
                const supabaseError = error as UnknownError;
                console.log(supabaseError.error_description || supabaseError.message);
            }
        }
        fetchCategoryData();
    }, [categoryname]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            if (categoryId) {
                const { error } = await supabase.from('flashcards').insert([
                    {
                        front: data.front,
                        back: data.back,
                        user_id: supabase.auth.user()?.id,
                        category_id: categoryId[0].id,
                    },
                ]);

                if (error) throw error;
            }
            reset();
            notify();
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    };

    return (
        <main className="flex flex-grow flex-col items-center mx-auto pt-14">
            <Heading variant="primary">
                Create FlashCard for <span className="text-secondary">{categoryname}</span> category
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col p-20">
                    <div className="flex justify-center gap-8">
                        <div className="flex flex-col">
                            <label htmlFor="front" className="font-semibold text-normal text-opacity-60 text-xl">
                                front:
                            </label>
                            <textarea
                                id="front"
                                {...register('front', { required: true })}
                                rows={6}
                                cols={40}
                                placeholder="e.x. study"
                                className="text-xl font-sriracha border-2 border-secondary rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.front && errors.front.message && (
                                <ErrorMessage
                                    message={errors.front.message}
                                    className="text-sm pl-4 pt-1 text-red-600"
                                ></ErrorMessage>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="back" className="font-semibold text-normal text-opacity-60 text-xl">
                                back:
                            </label>
                            <textarea
                                id="back"
                                {...register('back', { required: true })}
                                rows={6}
                                cols={40}
                                placeholder="e.x. uczyć się"
                                className="text-xl font-sriracha border-2 border-secondary rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.back && errors.back.message && (
                                <ErrorMessage
                                    message={errors.back.message}
                                    className="text-sm pl-4 pt-1 text-red-600"
                                ></ErrorMessage>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 pt-24">
                        <Button type="submit" variant="primary">
                            Create
                        </Button>
                        <Button type="reset" variant="secondary">
                            Clear fields
                        </Button>
                    </div>
                </div>
            </form>
            <Link to="/categories" className="text-normal text-opacity-60 flex items-center gap-4">
                <FaReply />
                <span>Back to the flashcards category list</span>
            </Link>
            <ToastContainer
                position="bottom-center"
                autoClose={2500}
                hideProgressBar={true}
                closeOnClick={false}
                closeButton={false}
                toastClassName={() => 'bg-primary text-white font-semibold rounded text-center p-1 bg-opacity-90'}
            />
        </main>
    );
}
