import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../components/home/Home";
import Login from "../components/login/Login";
import axios, { HttpStatusCode } from "axios";
import UserCrud from "../components/Entidades/user/UserCrud";
import CategoriaCrud from "../components/Entidades/categoria/CategoriaCrud";
import FornecedorCrud from "../components/Entidades/fornecedor/FornecedorCrud";

import PatrimonioList from "../components/Entidades/patrimonio/PatrimonioList";
import PatrimonioCreate from "../components/Entidades/patrimonio/PatrimonioCreate";
import PatrimonioDetails from "../components/Entidades/patrimonio/PatrimonioDetails";

import DepartamentoCRUD from "../components/Entidades/departamento/DepartamentoCRUD";
import TipoOcorrenciaCRUD from "../components/Entidades/tipoOcorrencia/TipoOcorrenciaCRUD";
import OcorrenciaCrud from "../components/Entidades/ocorrencia/OcorrenciaCRUD";

export const isAuthenticated = () => {
    // Implemente a lógica de verificação do token aqui
    // Retorne true se o token for válido e false caso contrário
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }
    axios('http://localhost:3333/api/verifytoken', {
        headers: {
            Authorization: 'Bearer ' + token 
        }
    })
        .then(resp => {
            return resp.status === HttpStatusCode.Ok;
        })
        .catch(error => {
            return false;
        });
    return true;
};

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const Rotas = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <UserCrud />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/categorias"
                element={
                    <ProtectedRoute>
                        <CategoriaCrud />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/fornecedores"
                element={
                    <ProtectedRoute>
                        <FornecedorCrud />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/patrimonios"
                element={
                    <ProtectedRoute>
                        <PatrimonioList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/patrimonios/criar"
                element={
                    <ProtectedRoute>
                        <PatrimonioCreate />
                    </ProtectedRoute>
                }
            /> 
            <Route
                path="/patrimonios/detalhe/:id"
                element={
                    <ProtectedRoute>
                        <PatrimonioDetails />
                    </ProtectedRoute>
                }
            /> 
            <Route
                path="/departamentos"
                element={
                    <ProtectedRoute>
                        <DepartamentoCRUD />
                    </ProtectedRoute>
                }
            /> 
            <Route
                path="/ocorrenciatipos"
                element={
                    <ProtectedRoute>
                        <TipoOcorrenciaCRUD />
                    </ProtectedRoute>
                }
            /> 
            <Route
                path="/ocorrencias"
                element={
                    <ProtectedRoute>
                        <OcorrenciaCrud />
                    </ProtectedRoute>
                }
            /> 
            <Route path="/*" element={<Navigate to="/home" />} />
        </Routes>
    );
};

export default Rotas;