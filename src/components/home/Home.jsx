import React from 'react';
import Main from '../template/Main';

const Home = props => {
    return (
        <Main icon="home" title="Início" subtitle="Home">
            <div className="display-4">Bem Vindo!</div>
            <hr />
            <p className="mb-0">Sistema para exemplificar a construção de um gerenciador
                de patrimonios</p>
        </Main>
    )
}

export default Home;