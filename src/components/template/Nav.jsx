import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Nav = props => {
    return (
        <aside className="menu">
            <nav>
                <Link to="/home">
                    <i className="fa fa-home"></i> Início
                </Link>
                <Link to="/users">
                    <i className="fa fa-users"></i> Usuários
                </Link>
                <Link to="/categorias">
                    <i className="fa fa-tags"></i> Categorias
                </Link>
            </nav>
        </aside>
    )
}

export default Nav