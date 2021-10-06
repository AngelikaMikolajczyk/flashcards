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

    return (
        <main className="flex flex-grow justify-center items-center">
            <form
                className="w-3/5 h-2/3 border-2 border-secondary rounded-lg flex flex-col"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h1 className="text-primary text-3xl font-bold">Log in</h1>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" {...register('email', { required: true })} />
                {errors.email && <ErrorMessage message={errors.email.message}></ErrorMessage>}

                <label htmlFor="password">Password</label>
                <div className="flex flex-row">
                    <input id="password" type={passwordVisible} {...register('password', { required: true })} />
                    <IconButton onClick={handlePasswordVisible}>
                        {passwordVisible === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </IconButton>
                </div>
                {errors.password && <ErrorMessage message={errors.password.message}></ErrorMessage>}

                {submitErrorMessage ? <ErrorMessage message={submitErrorMessage}></ErrorMessage> : null}

                <div>
                    Don't have account? <Link to="/register">Register now!</Link>
                </div>

                <Button type="submit" variant="primary">
                    Log in
                </Button>
            </form>
        </main>
    );
}
