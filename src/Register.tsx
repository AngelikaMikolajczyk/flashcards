import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from './Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { IconButton } from './IconButton';
import { supabase } from './supabaseClient';
import { useHistory } from 'react-router';
import { ErrorMessage } from './ErrorMessage';
import { Link } from 'react-router-dom';
import { Heading } from './Heading';

type Inputs = {
    email: string;
    password: string;
};

type UnknownError = {
    error_description?: string;
    message?: string;
};

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup
            .string()
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/, {
                message:
                    'password has to contains minimum 6 and maximum 20 characters, at least one letter, one number and one special character: @$!%*#?&',
                excludeEmptyString: true,
            })
            .required(),
    })
    .required();

export function Register() {
    const [passwordVisible, setPasswordVisible] = useState('password');

    const history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const { user, session, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });
            console.log({ user, session, error });
            // user return data like: email, email_change_confirm_status, id
            if (error) throw error;
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    };

    function handlePasswordVisible() {
        if (passwordVisible === 'password') {
            setPasswordVisible('text');
        } else {
            setPasswordVisible('password');
        }
    }

    function handleCancel() {
        history.push('/');
    }

    return (
        <main className="flex grow justify-center items-center">
            <form
                className="w-2/5 border-2 border-secondary dark:border-dark-secondary rounded-lg flex flex-col items-start p-11 shadow-lg"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Heading variant="primary">Register</Heading>
                <div className="py-14 flex flex-col gap-10 w-full">
                    <div className="flex flex-col relative" style={{ width: 'calc(80% - 40px)' }}>
                        <input
                            id="email"
                            type="text"
                            {...register('email', { required: true })}
                            className="font-bold dark:bg-gray-600 text-normal dark:text-dark-normal text-opacity-60 border border-inactive  rounded-lg h-12 p-4 focus-within:border-primary dark:focus-within:border-dark-primary appearance-none focus:outline-none"
                            placeholder=" "
                        />
                        <label
                            htmlFor="email"
                            className="text-base pl-4 text-inactive absolute top-3 duration-300 origin-0"
                        >
                            Email
                        </label>
                        {errors.email && errors.email.message && (
                            <ErrorMessage
                                className="text-sm pl-4 pt-1 text-red-600 dark:text-red-400"
                                message={errors.email.message}
                            ></ErrorMessage>
                        )}
                    </div>

                    <div className="w-4/5">
                        <div className="flex flex-row">
                            <div className="flex flex-col relative grow">
                                <input
                                    id="password"
                                    type={passwordVisible}
                                    {...register('password', { required: true })}
                                    className="font-bold dark:bg-gray-600 text-normal dark:text-dark-normal text-opacity-60 border border-inactive rounded-lg h-12 p-4 focus:border-primary dark:focus-within:border-dark-primary appearance-none focus:outline-none"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="password"
                                    className="text-base pl-4 text-inactive absolute top-3 duration-300 origin-0"
                                >
                                    Password
                                </label>
                            </div>
                            <IconButton onClick={handlePasswordVisible} className="opacity-60 pl-4">
                                {passwordVisible === 'password' ? (
                                    <AiFillEye className="w-6 h-6 dark:text-dark-normal" />
                                ) : (
                                    <AiFillEyeInvisible className="w-6 h-6 dark:text-dark-normal" />
                                )}
                            </IconButton>
                        </div>

                        {errors.password && errors.password.message && (
                            <ErrorMessage
                                className="text-sm pl-4 pt-1 text-red-600 dark:text-red-400"
                                style={{ width: 'calc(100% - 40px)' }}
                                message={errors.password.message}
                            ></ErrorMessage>
                        )}
                    </div>
                </div>

                <div className="flex gap-8">
                    <Button type="submit" variant="primary">
                        Register
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
                <div className="text-opacity-60 text-normal dark:text-dark-normal pt-4 font-bold">
                    Already have account?{' '}
                    <Link to="/login" className="text-primary dark:text-dark-primary">
                        Log in
                    </Link>
                </div>
            </form>
        </main>
    );
}
