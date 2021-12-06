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

type EmailFormInputs = {
    email: string;
};

type PasswordFormInputs = {
    newPassword: string;
    confirmNewPassword: string;
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
        confirmNewPassword: yup
            .string()
            .oneOf([yup.ref('newPassword')], 'passwords must match')
            .required(),
    })
    .required();

const emialDefaultValues = {
    email: '',
};

const passwordDefaultValues = {
    newPassword: '',
    confirmNewPassword: '',
};

function EmailForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(emailFormSchema),
        defaultValues: emialDefaultValues,
    });

    const currentUser = useRef<User | null>(null);

    useEffect(() => {
        const user = supabase.auth.user();
        reset({
            email: user && user.email ? user.email : '',
        });
        currentUser.current = user;
        console.log(user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit: SubmitHandler<EmailFormInputs> = async (data) => {
        try {
            let updateError;
            if (emialDefaultValues.email !== data.email) {
                const { user, error } = await supabase.auth.update({ email: data.email });
                updateError = error;
                console.log({ user, error });
            }
            if (updateError) throw updateError;
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
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
                {errors.email && errors.email.message && (
                    <ErrorMessage
                        className="text-sm pl-4 pt-1 text-red-600"
                        message={errors.email.message}
                    ></ErrorMessage>
                )}
            </div>
            <Button type="submit" variant="primary">
                Save new email
            </Button>
        </form>
    );
}

function PasswordForm() {
    const [newPasswordVisible, setNewPasswordVisible] = useState<'password' | 'text'>('password');
    const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState<'password' | 'text'>('password');
    const [isConfirmPasswordDisabled, setIsConfirmPasswordDisabled] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(passwordFormSchema),
        defaultValues: passwordDefaultValues,
    });

    const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
        try {
            let updateError;

            if (data.newPassword !== '') {
                const { user, error } = await supabase.auth.update({ password: data.newPassword });
                updateError = error;
                console.log({ user, error });
            }

            if (updateError) throw updateError;
        } catch (error) {
            const supabaseError = error as UnknownError;
            console.log(supabaseError.error_description || supabaseError.message);
        }
    };

    function handleNewPasswordVisible() {
        if (newPasswordVisible === 'password') {
            setNewPasswordVisible('text');
        } else {
            setNewPasswordVisible('password');
        }
    }

    function handleConfirmNewPasswordVisible() {
        if (confirmNewPasswordVisible === 'password') {
            setConfirmNewPasswordVisible('text');
        } else {
            setConfirmNewPasswordVisible('password');
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
                    <div className="flex flex-col relative flex-grow">
                        <input
                            id="newPassword"
                            type={newPasswordVisible}
                            {...{
                                ...registerPassword,
                                onChange: (e) => {
                                    if (e.currentTarget.value) {
                                        setIsConfirmPasswordDisabled(false);
                                    } else {
                                        setIsConfirmPasswordDisabled(true);
                                    }

                                    registerPassword.onChange(e);
                                },
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
                        className="text-sm pl-4 pt-1 text-red-600"
                        style={{ width: 'calc(100% - 40px)' }}
                        message={errors.newPassword.message}
                    ></ErrorMessage>
                )}
            </div>
            <div className="w-4/5">
                <div className="flex flex-row">
                    <div className="flex flex-col relative flex-grow">
                        <input
                            id="confirmNewPassword"
                            type={confirmNewPasswordVisible}
                            {...register('confirmNewPassword', { required: true })}
                            className="font-bold text-normal dark:text-dark-normal text-opacity-60 border border-inactive rounded-lg h-12 p-4 focus:border-primary dark:focus:border-dark-primary dark:bg-gray-600 appearance-none focus:outline-none"
                            placeholder=" "
                            disabled={isConfirmPasswordDisabled}
                        />
                        <label
                            htmlFor="confirmNewPassword"
                            className="text-base pl-4 text-inactive absolute top-3 duration-300 origin-0"
                        >
                            Confirm new password
                        </label>
                    </div>
                    <IconButton onClick={handleConfirmNewPasswordVisible} className="opacity-60 pl-4">
                        {confirmNewPasswordVisible === 'password' ? (
                            <AiFillEye className="w-6 h-6 dark:text-dark-normal" />
                        ) : (
                            <AiFillEyeInvisible className="w-6 h-6 dark:text-dark-normal" />
                        )}
                    </IconButton>
                </div>
                {errors.confirmNewPassword && errors.confirmNewPassword.message && (
                    <ErrorMessage
                        className="text-sm pl-4 pt-1 text-red-600"
                        style={{ width: 'calc(100% - 40px)' }}
                        message={errors.confirmNewPassword.message}
                    ></ErrorMessage>
                )}
            </div>
            <Button type="submit" variant="primary">
                Save new password
            </Button>
        </form>
    );
}

export function Account() {
    const history = useHistory();

    function handleCancel() {
        history.push('/');
    }

    return (
        <main className="flex flex-grow justify-center items-center">
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
