import { useEffect, useRef, useState } from 'react';
import { Heading } from './Heading';
import { supabase } from './supabaseClient';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from './ErrorMessage';
import { IconButton } from './IconButton';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Button } from './Button';
import { User } from '@supabase/supabase-js';
import { SuccessMessage } from './SuccessMessage';
import { RequestStatus } from './types';

type EmailFormInputs = {
    email: string;
};

type PasswordFormInputs = {
    newPassword: string;
};

type UnknownError = {
    error_description?: string;
    message?: string;
};

const emailFormSchema = yup
    .object({
        email: yup.string().email().required(),
    })
    .required();

const passwordFormSchema = yup
    .object({
        newPassword: yup
            .string()
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/, {
                message:
                    'password has to contains minimum 6 and maximum 20 characters, at least one letter, one number and one special character: @$!%*#?&',
                excludeEmptyString: true,
            })
            .required(),
    })
    .required();

const emailDefaultValues = {
    email: '',
};

const passwordDefaultValues = {
    newPassword: '',
};

function EmailForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(emailFormSchema),
        defaultValues: emailDefaultValues,
    });

    const [requestUpdateEmailStatus, setRequestUpdateEmailStatus] = useState<RequestStatus>('idle');

    const currentUser = useRef<User | null>(null);

    useEffect(() => {
        const user = supabase.auth.user();
        reset({
            email: user && user.email ? user.email : '',
        });
        currentUser.current = user;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit: SubmitHandler<EmailFormInputs> = async (data) => {
        try {
            if (currentUser.current!.email !== data.email) {
                setRequestUpdateEmailStatus('pending');
                const { user, error } = await supabase.auth.update({ email: data.email });
                console.log({ user, error });

                if (error) throw error;

                setRequestUpdateEmailStatus('success');
            }
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
            setRequestUpdateEmailStatus('error');
        }
    };

    return (
        <form className="flex flex-col items-start py-4 gap-8" onSubmit={handleSubmit(onSubmit)}>
            <Heading variant="normal">New email address</Heading>
            <div className="flex flex-col relative" style={{ width: 'calc(80% - 40px)' }}>
                <input
                    id="email"
                    type="text"
                    {...register('email', { required: true })}
                    className="font-bold text-normal dark:text-dark-normal text-opacity-60 border border-inactive rounded-lg h-12 p-4 focus-within:border-primary dark:focus-within:border-dark-primary dark:bg-gray-600 appearance-none focus:outline-none"
                    placeholder=" "
                />
                <label htmlFor="email" className="text-base pl-4 text-inactive absolute top-3 duration-300 origin-0">
                    Email
                </label>

                {errors.email && errors.email.message && <ErrorMessage message={errors.email.message} />}
            </div>
            <Button type="submit" variant="primary">
                Save new email
            </Button>
            {requestUpdateEmailStatus === 'success' ?? <SuccessMessage message="New email has been saved" />}
            {requestUpdateEmailStatus === 'error' ?? (
                <ErrorMessage message="There was an error during updating email" />
            )}
        </form>
    );
}

function PasswordForm() {
    const [newPasswordVisible, setNewPasswordVisible] = useState<'password' | 'text'>('password');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(passwordFormSchema),
        defaultValues: passwordDefaultValues,
    });

    const [requestUpdatePasswordStatus, setRequestUpdatePasswordStatus] = useState<RequestStatus>('idle');

    const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
        try {
            if (data.newPassword !== '') {
                setRequestUpdatePasswordStatus('pending');
                const { user, error } = await supabase.auth.update({ password: data.newPassword });
                console.log({ user, error });

                if (error) throw error;

                setRequestUpdatePasswordStatus('success');
            }
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
            setRequestUpdatePasswordStatus('error');
        }
    };

    function handleNewPasswordVisible() {
        if (newPasswordVisible === 'password') {
            setNewPasswordVisible('text');
        } else {
            setNewPasswordVisible('password');
        }
    }

    const registerPassword = register('newPassword', {
        required: true,
    });

    return (
        <form className="flex flex-col items-start py-4 gap-8" onSubmit={handleSubmit(onSubmit)}>
            <Heading variant="normal">New password</Heading>
            <div className="w-4/5">
                <div className="flex flex-row">
                    <div className="flex flex-col relative grow">
                        <input
                            id="newPassword"
                            type={newPasswordVisible}
                            {...{
                                ...registerPassword,
                            }}
                            className="font-bold text-normal dark:text-dark-normal text-opacity-60 border border-inactive rounded-lg h-12 p-4 focus:border-primary dark:focus:border-dark-primary dark:bg-gray-600 appearance-none focus:outline-none"
                            placeholder=" "
                        />
                        <label
                            htmlFor="newPassword"
                            className="text-base pl-4 text-inactive absolute top-3 duration-300 origin-0"
                        >
                            New password
                        </label>
                    </div>
                    <IconButton onClick={handleNewPasswordVisible} className="opacity-60 pl-4">
                        {newPasswordVisible === 'password' ? (
                            <AiFillEye className="w-6 h-6 dark:text-dark-normal" />
                        ) : (
                            <AiFillEyeInvisible className="w-6 h-6 dark:text-dark-normal" />
                        )}
                    </IconButton>
                </div>
                {errors.newPassword && errors.newPassword.message && (
                    <ErrorMessage
                        className="text-sm pl-4 pt-1 text-red-600 dark:text-red-400"
                        style={{ width: 'calc(100% - 40px)' }}
                        message={errors.newPassword.message}
                    ></ErrorMessage>
                )}
            </div>
            <Button type="submit" variant="primary">
                Save new password
            </Button>
            {requestUpdatePasswordStatus === 'success' ? (
                <SuccessMessage message="New password has been saved!" />
            ) : null}
            {requestUpdatePasswordStatus === 'error' ? (
                <ErrorMessage
                    message="There was an error during updating password!"
                    className="bg-red-200 pr-4 pb-2 pt-2 rounded-lg dark:text-red-500"
                />
            ) : null}
        </form>
    );
}

export function Account() {
    const history = useHistory();

    function handleCancel() {
        history.push('/');
    }

    return (
        <main className="flex grow justify-center items-center">
            <div className="w-2/5 border-2 border-secondary dark:border-dark-secondary rounded-lg flex flex-col items-start p-11 shadow-lg">
                <Heading variant="primary">My account</Heading>
                <div className="py-8 flex flex-col gap-10 w-full">
                    <EmailForm />
                    <PasswordForm />
                </div>

                <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </main>
    );
}
