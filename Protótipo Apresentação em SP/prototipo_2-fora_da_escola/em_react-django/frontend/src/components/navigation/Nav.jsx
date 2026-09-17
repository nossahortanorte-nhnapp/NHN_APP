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

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        // Limpa as flags no localStorage
        localStorage.removeItem('emailResetClicked');
        localStorage.removeItem('passwordResetClicked');
        
        dispatch(logout());
        dispatch(reset());
        navigate("/");
    };

    // Função para alternar a visibilidade do menu
    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    // Fechar o menu ao clicar fora dele
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <nav className="navbar">
            <NavLink className="logo" to="/">
                <img src="vite.svg" alt="Logo" width="45" height="45" title="NHNapp" />
            </NavLink>
            <ul className="nav-links">
                {user ?
                    <>
                        <NavLink className='nav-childs' to="/alimentos/postar/">Postar +</NavLink>
                        <NavLink className='nav-childs' to="/alimentos">Alimentos</NavLink>
                        <NavLink className='nav-childs' to="/minhahorta">Minha Horta</NavLink>
                        <NavLink className='nav-childs' to="/nossashortas">Nossas Hortas</NavLink>
                        <NavLink className='nav-childs' to="#">Educação</NavLink>
                        <div 
                            className="menu-button" 
                            onClick={toggleMenu}
                        >
                            Menu
                        </div>
                        {isMenuOpen && (
                            <div className="hidden-links" ref={menuRef}>
                                <NavLink className='nav-childs' to="/">Perguntas da Comunidade</NavLink>
                                <NavLink className='nav-childs' to="/">Doações</NavLink>
                                <NavLink className='nav-childs' to="/">Publicidades</NavLink>
                                <NavLink className='nav-childs' to="/" onClick={handleLogout}>Sair</NavLink>
                            </div>
                        )}
                    </>
                    :
                    <>
                        <NavLink className='nav-childs' to="/sobre">Sobre nós</NavLink>
                        <div 
                            className="menu-button" 
                            onClick={toggleMenu}
                        >
                            Menu
                        </div>
                        {isMenuOpen && (
                            <div className="hidden-links" ref={menuRef}>
                                <NavLink className='nav-childs' to="/">Perguntas da Comunidade</NavLink>
                                <NavLink className='nav-childs' to="/">Doações</NavLink>
                                <NavLink className='nav-childs' to="/">Publicidades</NavLink>
                            </div>
                        )}
                    </>
                }
            </ul>
        </nav>
    );
};

export default Nav;
