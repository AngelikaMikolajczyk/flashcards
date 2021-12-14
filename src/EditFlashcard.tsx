import { useHistory, useLocation, useParams } from 'react-router';
import { Heading } from './Heading';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// import { ToastContainer, toast } from 'react-toastify';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { FaReply } from 'react-icons/fa';
import _ from 'lodash';
import { supabase } from './supabaseClient';

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

export function EditFlashcard() {
    const { categoryname } = useParams<{ categoryname: string }>();
    let location = useLocation<{ flashcardId: number; front: string; back: string; categoryId: number }>();
    const history = useHistory();

    // const notify = () => toast(`Your flashcard for ${categoryname} category has been edited successfully!`);

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        reset,
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            front: location.state.front,
            back: location.state.back,
        },
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const { error } = await supabase
                .from('flashcards')
                .update([
                    {
                        front: data.front,
                        back: data.back,
                    },
                ])
                .eq('id', location.state.flashcardId);
            if (error) throw error;
            // notify();
            history.push('/categories/' + categoryname, { categoryId: location.state.categoryId });
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    };

    function handleUndo() {
        reset();
    }

    return (
        <main className="flex grow flex-col items-center mx-auto pt-14">
            <Heading variant="primary">
                Edit FlashCard in category{' '}
                <span className="text-secondary dark:text-dark-secondary">{categoryname}</span>
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col p-20">
                    <div className="flex justify-center gap-8">
                        <div className="flex flex-col">
                            <label
                                htmlFor="front"
                                className="font-semibold text-normal dark:text-dark-normal text-opacity-60 text-xl"
                            >
                                front:
                            </label>
                            <textarea
                                id="front"
                                {...register('front', { required: true })}
                                rows={6}
                                cols={40}
                                // placeholder="e.x. study"
                                className="text-xl font-sriracha dark:text-dark-normal dark:bg-gray-600 border-2 border-secondary dark:border-dark-secondary rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                            />
                            {errors.front && errors.front.message && (
                                <ErrorMessage
                                    message={errors.front.message}
                                    className="text-sm pl-4 pt-1 text-red-600 dark:text-red-400"
                                ></ErrorMessage>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="back"
                                className="font-semibold text-normal dark:text-dark-normal text-opacity-60 text-xl"
                            >
                                back:
                            </label>
                            <textarea
                                id="back"
                                {...register('back', { required: true })}
                                rows={6}
                                cols={40}
                                // placeholder="e.x. uczyć się"
                                className="text-xl font-sriracha dark:text-dark-normal dark:bg-gray-600 border-2 border-secondary dark:border-dark-secondary rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                            />
                            {errors.back && errors.back.message && (
                                <ErrorMessage
                                    message={errors.back.message}
                                    className="text-sm pl-4 pt-1 text-red-600 dark:text-red-400"
                                ></ErrorMessage>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 pt-24">
                        <Button
                            type="submit"
                            variant={_.isEmpty(dirtyFields) ? 'disabled' : 'primary'}
                            disabled={_.isEmpty(dirtyFields)}
                        >
                            Save changes
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleUndo}>
                            Undo changes
                        </Button>
                    </div>
                </div>
            </form>
            <Link
                to={{ pathname: '/categories/' + categoryname, state: { categoryId: location.state.categoryId } }}
                className="text-normal dark:text-dark-normal text-opacity-60 flex items-center gap-4"
            >
                <FaReply />
                <span>Back to the flashcards category list</span>
            </Link>
            {/* <ToastContainer
                position="bottom-center"
                autoClose={2500}
                hideProgressBar={true}
                closeOnClick={false}
                closeButton={false}
                toastClassName={() => 'bg-primary dark:bg-dark-primary text-white font-semibold rounded text-center p-1 bg-opacity-90'}
            /> */}
        </main>
    );
}
