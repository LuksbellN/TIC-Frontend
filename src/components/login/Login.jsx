import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const baseUrl = 'http://localhost:3333/api'

    const handleLogin = (e) => {
        e.preventDefault();

        axios['post'](baseUrl + '/login', { email, senha })
            .then(resp => {
                if (resp.data.data) {
                    localStorage.setItem('token', resp.data.data)
                    navigate("/");
                } else {
                    // Tratamento de erro de login inválido
                    console.log("Credenciais inválidas");
                }
            })
    };

    return (
        <div className="page-container">
            <div className="login-card bg-white p-4 rounded">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Digite seu email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" className="form-control" id="password" placeholder="Digite sua senha" value={senha} onChange={e => setSenha(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-success w-100">Login</button>
                </form>
            </div>
        </div>

    );
};

export default Login;