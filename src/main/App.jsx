import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import Logo from '../components/template/Logo';
import Nav from '../components/template/Nav';
import Rotas from './Routes';
import Footer from '../components/template/Footer';
import Login from '../components/login/Login';

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

const AppContent = () => {
    const location = useLocation();
    const hideMenuAndFooter = location.pathname === '/login';

    return (
        <div>
                {!hideMenuAndFooter && (

                    <div className="app">
                        <Logo />
                        <Nav />
                        <Rotas />
                        <Footer />
                    </div>
                )}
            {hideMenuAndFooter && <Login />}

        </div>
    );
};

export default App;
