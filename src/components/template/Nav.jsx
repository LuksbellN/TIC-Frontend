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
                <Link to="/fornecedores">
                    <i className="fa fa-building"></i> Fornecedores
                </Link>
                <Link to="/patrimonios">
                    <i className="fa fa-archive"></i> Patrimonios
                </Link>
                <Link to="/ocorrenciatipos">
                    <i className="fa fa-exclamation-triangle"></i> Tipos de Ocorrência
                </Link>
                <Link to="/departamentos">
                    <i className="fa fa-university"></i> Departamentos
                </Link>
                <Link to="/ocorrencias">
                    <i className="fa fa-exclamation-circle"></i> Ocorrencias
                </Link>
            </nav>
        </aside>
    )
}

export default Nav