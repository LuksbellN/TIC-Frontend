import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../components/home/Home";
import UserCrud from "../components/user/UserCrud";
import Login from "../components/login/Login";
import axios, { HttpStatusCode } from "axios";

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
            <Route path="/*" element={<Navigate to="/home" />} />
        </Routes>
    );
};

export default Rotas;