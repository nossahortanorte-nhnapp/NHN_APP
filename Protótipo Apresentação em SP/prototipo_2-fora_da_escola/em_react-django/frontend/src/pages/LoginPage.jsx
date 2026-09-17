// NHN_APP — Conectando Produtores e Consumidores de Orgânicos In-Natura
// Copyright (C) 2023–2026 Enio Alves Borges & Colaboradores do Projeto NHN_APP
//
// Este programa é um software livre; você pode redistribuí-lo e/ou modificá-lo
// sob os termos da Licença Pública Geral GNU Affero (GNU AGPLv3) conforme publicada
// pela Free Software Foundation, versão 3 da Licença.
//
// Este programa é distribuído na expectativa de ser útil, mas SEM QUALQUER
// GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO ou ADEQUAÇÃO A UM
// PROPÓSITO EM PARTICULAR. Veja a Licença Pública Geral GNU Affero para mais detalhes.
//
// Você deve ter recebido uma cópia da Licença Pública Geral GNU Affero junto com
// este programa. Se não, veja <https://www.gnu.org/licenses/>.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { login, reset, getUserInfo } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from "../components/Spinner";
import axios from 'axios'; // Certifique-se de importar o axios

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password };
        dispatch(login(userData));
    };

    useEffect(() => {
        const checkUserProfilePhoto = async () => {
            try {
                console.log("Iniciando a verificação da foto de perfil...");
                
                const token = user ? user.access : null;
                console.log("Token obtido:", token);
    
                const response = await axios.get('http://localhost:8000/api/v1/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log("Resposta do perfil do usuário:", response.data);
    
                const userProfile = response.data;
                console.log("Foto de perfil do usuário:", userProfile.photo);
    
                if (userProfile.photo === '/media/profile_avatar.jpeg') {
                    console.log("Redirecionando para /minhahorta");
                    navigate("/minhahorta");
                } else {
                    console.log("Redirecionando para /alimentos");
                    navigate("/alimentos");
                }
            } catch (error) {
                console.error('Erro ao obter o perfil do usuário:', error);
                toast.error('Erro ao redirecionar. Tente novamente.');
            }
        };
    
        if (isError) {
            console.log("Erro no login:", message);
            toast.error(message);
        }
    
        if (isSuccess || user) {
            console.log("Login bem-sucedido ou usuário já logado.");
            checkUserProfilePhoto(); // Verifica a foto de perfil após o login
        }
    
        console.log("Resetando estado de autenticação e obtendo informações do usuário.");
        dispatch(reset());
        dispatch(getUserInfo());
    
    }, [isError, isSuccess, user, navigate, dispatch]);
    

    return (
        <>
            <div className="container auth__container">
                <h1 className="main__title">
                    Entrar<BiLogInCircle />
                </h1>

                {isLoading && <Spinner />}

                <form className="auth__form">
                    <input
                        type="text"
                        placeholder="E-mail"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        required
                    />
                    <Link to="/reset-password">Esqueceu a senha ?</Link>

                    <button className="btn btn-primary" type="submit" onClick={handleSubmit}>
                        Entrar
                    </button>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
