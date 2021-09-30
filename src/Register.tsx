import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from './Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { IconButton } from './IconButton';

type Inputs = {
    email: string;
    password: string;
    confirmPassword: string;
};

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup
            .string()
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/, {
                message:
                    'Password has to contains minimum 6 characters and maximum 20 characters, at least one letter, one number and one special character: "@$!%*#?&"',
                excludeEmptyString: true,
            })
            .required(),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required(),
    })
    .required();

export function Register() {
    const [passwordVisible, setPasswordVisible] = useState('password');
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState('password');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

    function handlePasswordVisible() {
        if (passwordVisible === 'password') {
            setPasswordVisible('text');
        } else {
            setPasswordVisible('password');
        }
    }

    function handleConfirmPasswordVisible() {
        if (confirmPasswordVisible === 'password') {
            setConfirmPasswordVisible('text');
        } else {
            setConfirmPasswordVisible('password');
        }
    }

    return (
        <main className="flex flex-grow justify-center items-center">
            <form
                className="w-3/5 h-2/3 border-2 border-secondary rounded-lg flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <label htmlFor="email">Email</label>
                <input id="email" type="text" {...register('email', { required: true })} />
                {errors.email && <span>{errors.email.message}</span>}

                <label htmlFor="password">Password</label>
                <div className="flex flex-row">
                    <input id="password" type={passwordVisible} {...register('password', { required: true })} />
                    <IconButton onClick={handlePasswordVisible}>
                        {passwordVisible === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </IconButton>
                </div>
                {errors.password && <span>{errors.password.message}</span>}

                <label htmlFor="confirmPassword">Password</label>
                <div className="flex flex-row">
                    <input
                        id="confirmPassword"
                        type={confirmPasswordVisible}
                        {...register('confirmPassword', { required: true })}
                    />
                    <IconButton onClick={handleConfirmPasswordVisible}>
                        {confirmPasswordVisible === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </IconButton>
                </div>
                {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

                <Button type="submit" variant="primary">
                    Register
                </Button>
            </form>
        </main>
    );
}
