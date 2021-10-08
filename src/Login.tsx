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

const schema = yup
    .object({
        email: yup.string().required(),
        password: yup.string().required(),
    })
    .required();

export function Login() {
    const [passwordVisible, setPasswordVisible] = useState('password');
    const [submitErrorMessage, setSubmitErrorMessage] = useState(null);
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
            const { user, session, error } = await supabase.auth.signIn({
                email: data.email,
                password: data.password,
            });

            console.log({ user, session, error });
            // user return data like: email, email_change_confirm_status, id
            if (error) throw error;
            history.push('/');
        } catch (error) {
            console.log(error.error_description || error.message);
            setSubmitErrorMessage(error.error_description?.toString() || error.message?.toString());
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
        <main className="flex flex-grow justify-center items-center">
            <form
                className="w-2/5 border-2 border-secondary rounded-lg flex flex-col items-start p-11"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Heading variant="primary">Log in</Heading>
                <div className="py-14 flex flex-col gap-10 w-full">
                    <div className="flex flex-col relative" style={{ width: 'calc(80% - 40px)' }}>
                        <input
                            id="email"
                            type="text"
                            {...register('email', { required: true })}
                            className="font-bold text-normal text-opacity-60 border border-inactive rounded-lg h-12 p-4 focus-within:border-primary appearance-none focus:outline-none"
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
                                message={errors.email.message}
                                className="text-sm pl-4 pt-1 text-red-600"
                            ></ErrorMessage>
                        )}
                    </div>

                    <div className="w-4/5">
                        <div className="flex flex-row">
                            <div className="flex flex-col relative flex-grow">
                                <input
                                    id="password"
                                    type={passwordVisible}
                                    {...register('password', { required: true })}
                                    className="font-bold text-normal text-opacity-60 border border-inactive rounded-lg h-12 p-4 focus:border-primary appearance-none focus:outline-none"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="password"
                                    className="text-base pl-4 text-inactive absolute top-3 duration-300 origin-0"
                                >
                                    Password
                                </label>
                                <Link to="/reset-password" className="absolute -right-0 -bottom-8 text-primary">
                                    Reset password?
                                </Link>
                            </div>
                            <IconButton onClick={handlePasswordVisible} className="opacity-60 pl-4">
                                {passwordVisible === 'password' ? (
                                    <AiFillEye className="w-6 h-6" />
                                ) : (
                                    <AiFillEyeInvisible className="w-6 h-6" />
                                )}
                            </IconButton>
                        </div>
                        {errors.password && errors.password.message && (
                            <ErrorMessage
                                message={errors.password.message}
                                className="text-sm pl-4 pt-1 text-red-600"
                            ></ErrorMessage>
                        )}
                    </div>

                    {submitErrorMessage ? (
                        <ErrorMessage
                            message={submitErrorMessage}
                            className="text-sm pl-4 pt-1 text-red-600"
                        ></ErrorMessage>
                    ) : null}
                </div>

                <div className="flex gap-8 mt-auto">
                    <Button type="submit" variant="primary">
                        Log in
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>

                <div className="text-opacity-60 text-normal pt-4 font-bold">
                    Don't have account?{' '}
                    <Link to="/register" className="text-primary">
                        Register now!
                    </Link>
                </div>
            </form>
        </main>
    );
}
