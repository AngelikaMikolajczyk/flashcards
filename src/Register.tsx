import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from './Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

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
                <input id="password" type="password" {...register('password', { required: true })} />
                {errors.password && <span>{errors.password.message}</span>}

                <label htmlFor="confirmPassword">Password</label>
                <input id="confirmPassword" type="password" {...register('confirmPassword', { required: true })} />
                {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

                <Button type="submit" variant="primary">
                    Register
                </Button>
            </form>
        </main>
    );
}
