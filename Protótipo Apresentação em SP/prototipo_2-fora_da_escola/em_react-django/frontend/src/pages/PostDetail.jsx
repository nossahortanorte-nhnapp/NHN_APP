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
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';  // Importação do react-toastify
import '../css/post_detail.css';

const mediaRoot = 'http://127.0.0.1:8000/media/';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [userProfileId, setUserProfileId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const token = user ? user.access : null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            console.error("Token não encontrado! O usuário precisa estar autenticado.");
        }
    }, [token]);

    const axiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000/api/v1/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const fetchPostData = async () => {
        setLoading(true);
        try {
            const postResponse = await axiosInstance.get(`alimentos/${id}/`);
            setPost(postResponse.data);
            const likesResponse = await axiosInstance.get(`alimentos/${id}/likes/`);
            setLikes(likesResponse.data);
            const userResponse = await axiosInstance.get(`profile/users/me/`);
            setUserProfileId(userResponse.data.id);
            const userHasLiked = likesResponse.data.some(like => like.profile === userResponse.data.id && like.like === true);
            setIsLiked(userHasLiked);
        } catch (error) {
            console.error('Erro ao buscar dados do post, curtidas ou perfil do usuário!', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPostData();
        }
    }, [id, token]);

    const handleLike = async () => {
        if (!post || userProfileId === null) return;
        try {
            if (isLiked) {
                await axiosInstance.post(`alimentos/${id}/unlike/`);
                setIsLiked(false);
                setLikes((prevLikes) =>
                    prevLikes.map(like =>
                        like.profile === userProfileId ? { ...like, like: false } : like
                    )
                );
            } else {
                await axiosInstance.post(`alimentos/${id}/like/`);
                setIsLiked(true);
                const userHasLikedBefore = likes.some(like => like.profile === userProfileId);
                if (userHasLikedBefore) {
                    setLikes((prevLikes) =>
                        prevLikes.map(like =>
                            like.profile === userProfileId ? { ...like, like: true } : like
                        )
                    );
                } else {
                    setLikes((prevLikes) => [
                        ...prevLikes,
                        { profile: userProfileId, like: true }
                    ]);
                }
            }
        } catch (error) {
            console.error('Erro ao curtir ou descurtir o post!', error);
        }
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleArchiveToggle = async () => {
        const shouldArchive = !post.archive; // Inverte o estado atual de 'archive'
        console.log('Iniciando o processo de arquivamento...');
        console.log('ID do post:', id);
        console.log('Novo estado de archive:', shouldArchive);
    
        try {
            // Usando o método PATCH, que foi implementado no backend
            const response = await axiosInstance.patch(`alimentos/${id}/archive/`, {
                archive: shouldArchive
            });
    
            console.log('Resposta do servidor:', response);
    
            // Atualiza o estado do post para refletir a mudança
            setPost((prevPost) => ({
                ...prevPost,
                archive: shouldArchive
            }));
            setShowOptions(false); // Fecha o menu suspenso após a ação

            // Exibe a mensagem de sucesso
            if (shouldArchive) {
                toast.success("Seu Alimento foi arquivado.");
            } else {
                toast.success("Seu Alimento foi desarquivado.");
            }
    
        } catch (error) {
            console.error('Erro ao arquivar/desarquivar o post:', error.response ? error.response.data : error.message);
    
            if (error.response) {
                console.log('Erro no servidor:', error.response.data);
            }
    
            if (error.response && error.response.status === 401) {
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                localStorage.removeItem('token');  // Remove o token expirado
                navigate('/login/');  // Redireciona para a página de login
            } else {
                alert('Erro ao arquivar/desarquivar. Tente novamente.');
            }
        }
    };

    const likeIMG = isLiked ? `${mediaRoot}purple_heart.png` : `${mediaRoot}white_heart.png`;

    const handleOptionClick = (option) => {
        if (option === 'Editar') {
            navigate(`/alimentos/atualizar/${post.id}`);  // Redireciona para o PostUpdate
        } else if (option === 'Excluir') {
            // Lógica para excluir o post
        } else if (option === 'Denunciar') {
            // Lógica para denunciar o post
        }
    };
    console.log("clicou no botao editar######", handleOptionClick)
    

    if (loading || !post) return <p>Carregando...</p>;

    return (
        <div className="container" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <ul className='ul-container'>
                <li className="post-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to={`/nossashortas/${post.profile.id}`} className="profile_name-link">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img 
                                    src={post.profile.photo} 
                                    alt={post.profile.profile_name} 
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                                />
                                <span>{post.profile.profile_name}</span>
                            </div>
                        </Link>
                        <div className="post-options-button" onClick={toggleOptions} style={{ cursor: 'pointer', position: 'relative' }}>
                            &#x22EE;
                            {showOptions && (
                                <div className="dropdown-menu">
                                    <ul>
                                        {post.profile.id === userProfileId ? (
                                            <>
                                                <li>
                                                    {post.archive ? (
                                                        <button onClick={handleArchiveToggle}>Desarquivar</button>
                                                    ) : (
                                                        <button onClick={handleArchiveToggle}>Arquivar</button>
                                                    )}
                                                </li>
                                                <li>
                                                    <button onClick={() => handleOptionClick('Editar')}>Editar</button>
                                                </li>
                                                <li>
                                                    <button onClick={() => handleOptionClick('Excluir')}>Excluir</button>
                                                </li>
                                            </>
                                        ) : (
                                            <li>
                                                <button onClick={() => handleOptionClick('Denunciar')}>Denunciar</button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <h2>{post.title}</h2>
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="full-width" 
                    />
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                        <img
                            src={likeIMG}
                            alt="Curtir"
                            style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                            onClick={handleLike}
                        />
                        <span style={{ marginLeft: '10px' }}>
                            {likes.filter(like => like.like === true).length}
                        </span>
                        <div className='post-date' style={{ marginLeft: 'auto' }}>
                            <p>Postado em {new Date(post.data_postagem).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="post-text-container">
                        <Link to={`/nossashortas/${post.profile.id}`} className="profile_name-link">
                            {post.profile.profile_name}
                        </Link>
                        <span className="post-text"
                            dangerouslySetInnerHTML={{
                                __html: post.text.replace(/\n/g, '<br/>')
                            }}
                        />
                    </div>

                </li>
            </ul>
        </div>
    );
};

export default PostDetail;
