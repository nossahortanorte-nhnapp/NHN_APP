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

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/post_list.css';

const mediaRoot = 'http://127.0.0.1:8000/media/';
const MAX_TEXT_LENGTH = 100;  // Define the maximum preview length for the post text

const Alimentos = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('todas');
    const [followingProfiles, setFollowingProfiles] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState({}); // Store expanded state per post

    useEffect(() => {
        const source = axios.CancelToken.source();

        // Fetch posts
        axios.get('http://127.0.0.1:8000/api/v1/alimentos/', { cancelToken: source.token })
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                } else {
                    console.error('Ocorreu um erro ao buscar as postagens!', error);
                }
            });

        // Fetch following profiles
        axios.get('http://127.0.0.1:8000/api/v1/profile/following/', { cancelToken: source.token })
            .then(response => {
                setFollowingProfiles(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar perfis seguidos', error);
            });

        return () => {
            source.cancel('Component unmounted, request canceled.');
        };
    }, []);

    const formatDateTime = (dateString) => {
        const postDate = new Date(dateString);
        const today = new Date();

        const isToday = postDate.toDateString() === today.toDateString();
        if (isToday) {
            return `Hoje às ${postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return postDate.toLocaleString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    };

    const filterPosts = (post) => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return post.profile.profile_name.toLowerCase().includes(lowercasedSearchTerm) ||
            post.title.toLowerCase().includes(lowercasedSearchTerm) ||
            (post.doacao && 'doacao'.includes(lowercasedSearchTerm)) ||
            (post.troca && 'troca'.includes(lowercasedSearchTerm)) ||
            (post.venda && 'venda'.includes(lowercasedSearchTerm)) ||
            post.text.toLowerCase().includes(lowercasedSearchTerm);
    };

    const availablePosts = posts.filter(post => !post.archive).filter(filterPosts);

    const followedPosts = posts
        .filter(post => !post.archive)
        .filter(post => followingProfiles.some(profile => profile.id === post.profile.id))
        .filter(filterPosts);

    const toggleExpanded = (postId) => {
        setExpandedPosts(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const getDisplayedText = (text, isExpanded) => {
        if (isExpanded || text.length <= MAX_TEXT_LENGTH) {
            return text;
        }
        return text.slice(0, MAX_TEXT_LENGTH) + '...';
    };

    return (
        <div className="profile-container-post-list">
            <div className="tab-container">
                <button 
                    className={`tab-button ${activeTab === 'todas' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('todas')}
                >
                    Todas hortas
                </button>
                <button 
                    className={`tab-button ${activeTab === 'sigo' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('sigo')}
                >
                    Hortas que sigo
                </button>
            </div>

            {activeTab === 'todas' && (
                <div className="posts-container">
                    <input
                        type="text"
                        placeholder="Buscar Alimentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-post-list"
                    />

                    <div className="posts-list-grid">
                        {availablePosts.map(post => {
                            const isExpanded = expandedPosts[post.id];
                            const displayedText = getDisplayedText(post.text, isExpanded);

                            return (
                                <div key={post.id} className="post-item">
                                    <Link to={`/nossashortas/${post.profile.id}`} className="post-header">
                                        <img 
                                            src={post.profile.photo} 
                                            alt={post.profile.profile_name} 
                                            className="profile-image"
                                        />
                                        <span className="profile-name">{post.profile.profile_name}</span>
                                    </Link>
                                    <Link to={`/alimentos/${post.id}`}>
                                        <h2 className="post-title">{post.title}</h2>

                                        <div className="post-options">
                                            {post.doacao && (
                                                <div className="option">
                                                    <img
                                                        src={`${mediaRoot}doacao.png`}
                                                        alt="Doação"
                                                        className="option-image"
                                                    />
                                                    <p>Doação</p>
                                                </div>
                                            )}
                                            {post.troca && (
                                                <div className="option">
                                                    <img
                                                        src={`${mediaRoot}troca.png`}
                                                        alt="Troca"
                                                        className="option-image"
                                                    />
                                                    <p>Troca</p>
                                                </div>
                                            )}
                                            {post.venda && (
                                                <div className="option">
                                                    <img
                                                        src={`${mediaRoot}compra.png`}
                                                        alt="Venda"
                                                        className="option-image"
                                                    />
                                                    <p>Venda</p>
                                                </div>
                                            )}
                                        </div>

                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            className="full-width" 
                                        />
                                    </Link>
                                    <div className="post-text-container">
                                        <Link to={`/nossashortas/${post.profile.id}`} className="profile_name-link">
                                            {post.profile.profile_name}
                                        </Link>
                                        <span className="post-text">
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: displayedText.replace(/\n/g, '<br/>')
                                                }}
                                            />
                                            {post.text.length > MAX_TEXT_LENGTH && (
                                                <a href="#" onClick={(e) => { e.preventDefault(); toggleExpanded(post.id); }} className="view-more-link">
                                                    {isExpanded ? ' ver menos' : ' ver mais'}
                                                </a>
                                            )}
                                        </span>
                                    </div>
                                    <p className="post-date">Última atualização {formatDateTime(post.data_postagem)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'sigo' && (
                <div className="posts-container">
                    <input
                        type="text"
                        placeholder="Buscar Alimentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-post-list"
                    />

                    <div className="posts-list-grid">
                        {followedPosts.length > 0 ? followedPosts.map(post => {
                            const isExpanded = expandedPosts[post.id];
                            const displayedText = getDisplayedText(post.text, isExpanded);

                            return (
                                <div key={post.id} className="post-item">
                                    <Link to={`/nossashortas/${post.profile.id}`} className="post-header">
                                        <img 
                                            src={post.profile.photo} 
                                            alt={post.profile.profile_name} 
                                            className="profile-image"
                                        />
                                        <span className="profile-name">{post.profile.profile_name}</span>
                                    </Link>
                                    <Link to={`/alimentos/${post.id}`}>
                                        <h2 className="post-title">{post.title}</h2>

                                        <div className="post-options">
                                            {post.doacao && (
                                                <div className="option">
                                                    <img
                                                        src={`${mediaRoot}doacao.png`}
                                                        alt="Doação"
                                                        className="option-image"
                                                    />
                                                    <p>Doação</p>
                                                </div>
                                            )}
                                            {post.troca && (
                                                <div className="option">
                                                    <img
                                                        src={`${mediaRoot}troca.png`}
                                                        alt="Troca"
                                                        className="option-image"
                                                    />
                                                    <p>Troca</p>
                                                </div>
                                            )}
                                            {post.venda && (
                                                <div className="option">
                                                    <img
                                                        src={`${mediaRoot}compra.png`}
                                                        alt="Venda"
                                                        className="option-image"
                                                    />
                                                    <p>Venda</p>
                                                </div>
                                            )}
                                        </div>

                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            className="full-width" 
                                        />
                                    </Link>
                                    <div className="post-text-container">
                                        <Link to={`/nossashortas/${post.profile.id}`} className="profile_name-link">
                                            {post.profile.profile_name}
                                        </Link>
                                        <span className="post-text">
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: displayedText.replace(/\n/g, '<br/>')
                                                }}
                                            />
                                            {post.text.length > MAX_TEXT_LENGTH && (
                                                <a href="#" onClick={(e) => { e.preventDefault(); toggleExpanded(post.id); }} className="view-more-link">
                                                    {isExpanded ? ' ver menos' : ' ver mais'}
                                                </a>
                                            )}
                                        </span>
                                    </div>
                                    <p className="post-date">Última atualização {formatDateTime(post.data_postagem)}</p>
                                </div>
                            );
                        }) : (
                            <p>Nenhuma postagem de alimentos das hortas seguidas foi encontrada.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alimentos;
