import { createContext, useContext, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Header } from './Header';
import { Home } from './Home';
import { Register } from './Register';
import { Login } from './Login';
import { ResetPassword } from './ResetPassword';
import { Account } from './Account';
import { supabase } from './supabaseClient';
import { Categories } from './Categories';
import { CreateFlashcard } from './CreateFlashcard';
import { Flashcards } from './Flashcards';

interface AuthContextValue {
    isAuth: boolean;
    setAuthState: (isAuth: boolean) => void;
}

const authContextDefaultValue: AuthContextValue = {
    isAuth: false,
    setAuthState: () => null,
};

export const AuthContext = createContext<AuthContextValue>(authContextDefaultValue);

export function useAuth() {
    return useContext(AuthContext);
}

function App() {
    const [isAuth, setIsAuth] = useState(supabase.auth.user() !== null);

    function setAuthState(isAuth: boolean) {
        setIsAuth(isAuth);
    }

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            console.log(event, session);

            if (event === 'SIGNED_IN') {
                setAuthState(true);
            }
            if (event === 'SIGNED_OUT') {
                setAuthState(false);
            }
        });
    }, []);

    return (
        <div className="App font-nunito box-border h-screen flex flex-col bg-pattern">
            <AuthContext.Provider value={{ isAuth, setAuthState }}>
                <Header />
                <Switch>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset-password">
                        <ResetPassword />
                    </Route>
                    <Route path="/my-account">
                        <Account />
                    </Route>
                    <Route path="/categories">
                        <Categories />
                    </Route>
                    <Route path="/category/:categoryname">
                        <Flashcards />
                    </Route>
                    <Route path="/new-flashcard">
                        <CreateFlashcard />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
