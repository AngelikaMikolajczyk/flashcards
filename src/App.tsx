import { Switch, Route } from 'react-router-dom';
import { Header } from './Header';
import { Home } from './Home';
import { Register } from './Register';

function App() {
    return (
        <div className="App font-nunito box-border h-screen flex flex-col bg-pattern">
            <Header />
            <Switch>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
