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

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // Import useParams para capturar o UID e o token da URL
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { setEmail } from '../features/auth/authService';  // Importe o serviço atualizado

const ResetEmailPageConfirm = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_email: '',
        re_new_email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { uid, token } = useParams();  // Captura o UID e o token da URL

    const { current_password, new_email, re_new_email } = formData;

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        console.log('Submitting form data:', { ...formData, uid, token });

        if (!current_password || !new_email || !re_new_email) {
            toast.error("Por favor, preencha todos os campos.");
            setIsSubmitting(false);
            return;
        }

        if (new_email !== re_new_email) {
            toast.error("Os e-mails não coincidem.");
            setIsSubmitting(false);
            return;
        }

        const userData = {
            current_password,
            new_email,
            re_new_email
        };

        try {
            console.log('Dispatching setEmail...');
            const response = await setEmail(userData, uid, token);
            console.log('Response from server:', response);
            toast.success("E-mail redefinido com sucesso.");
            navigate("/login");
        } catch (error) {
            console.error("Erro capturado:", error);
            if (error.response) {
                console.error("Erro no response:", error.response);
                toast.error(`Erro ao redefinir o e-mail: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.error("Erro no request:", error.request);
                toast.error("Erro ao redefinir o e-mail: Nenhuma resposta do servidor.");
            } else {
                console.error("Erro desconhecido:", error.message);
                toast.error(`Erro desconhecido: ${error.message}`);
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="container auth__container">
            <h1 className="main__title">Redefinir E-Mail</h1>

            {isSubmitting && <Spinner />}

            <form className="auth__form" onSubmit={handleSubmit}>
                <input 
                    type="password"
                    placeholder="Senha Atual"
                    name="current_password"
                    onChange={handleChange}
                    value={current_password}
                    required
                    autoComplete="current-password"
                />
                <input 
                    type="email"
                    placeholder="Novo E-Mail"
                    name="new_email"
                    onChange={handleChange}
                    value={new_email}
                    required
                />
                <input 
                    type="email"
                    placeholder="Confirmar Novo E-Mail"
                    name="re_new_email"
                    onChange={handleChange}
                    value={re_new_email}
                    required
                />
                <button className="btn btn-lg btn-dark" type="submit" disabled={isSubmitting}>Redefinir E-Mail</button>
            </form>
        </div>
    );
};

export default ResetEmailPageConfirm;
