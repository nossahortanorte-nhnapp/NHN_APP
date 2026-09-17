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
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Para mostrar notificações
import '../css/PostUpdate.css';

const mediaRoot = 'http://127.0.0.1:8000/media/';

const PostUpdate = () => {
    const { id } = useParams();
    const [post, setPost] = useState({
        doacao: false,
        troca: false,
        venda: false,
        title: '',
        text: ''
    });
    const [loading, setLoading] = useState(false);
    
    const { user } = useSelector((state) => state.auth);
    const token = user ? user.access : null;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const axiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000/api/v1/',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    useEffect(() => {
        if (token) {
            fetchPostData();
        }
    }, [token, id]);

    const fetchPostData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`alimentos/${id}/`);
            setPost(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados do post!", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPost({
            ...post,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('title', post.title);
            formData.append('text', post.text);
            formData.append('doacao', post.doacao);
            formData.append('troca', post.troca);
            formData.append('venda', post.venda);
            
            if (post.image instanceof File) {
                formData.append('image', post.image); // Somente anexa a imagem se for um arquivo
            }
    
            await axiosInstance.patch(`alimentos/update/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Post atualizado com sucesso!");
            navigate(`/alimentos/${id}/`);
        } catch (error) {
            console.error("Erro ao atualizar o post!", error.response ? error.response.data : error.message);
            toast.error("Erro ao atualizar o post.");
        }
    };
    
    

    const handleCancel = () => {
        navigate(`/alimentos/${id}/`); // Redireciona de volta ao PostDetail sem salvar as alterações
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="post-update-container">
            <h1>Editar Postagem do Alimento</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Nome do Alimento:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
                <div className="checkbox-container">
                    <label className='checkbox-container-label'>
                        <img className='checkbox-container-img' src={`${mediaRoot}doacao.png`} alt="Doação" />
                        Doação <input type="checkbox" name="doacao" checked={post.doacao} onChange={handleChange} />
                    </label>
                    <label className='checkbox-container-label'>
                        <img className='checkbox-container-img' src={`${mediaRoot}troca.png`} alt="Troca" />
                        Troca <input type="checkbox" name="troca" checked={post.troca} onChange={handleChange} />
                    </label>
                    <label className='checkbox-container-label'>
                        <img className='checkbox-container-img' src={`${mediaRoot}compra.png`} alt="Venda" />
                        Venda <input type="checkbox" name="venda" checked={post.venda} onChange={handleChange} />
                    </label>
                </div>

                <div>
                    <img
                        className="imagePost"
                        src={post.image}
                        alt="Imagem do Alimento"
                        onClick={openModal} // Abre o modal ao clicar
                        style={{ cursor: 'pointer' }} // Aponta que é clicável
                    />

                    {isModalOpen && (
                        <div className="modal" onClick={closeModal}> {/* Fecha o modal ao clicar fora da imagem */}
                            <div className="modal-content">
                                <img onClick={closeModal} src={post.image} alt="Imagem do Alimento Ampliada" className="modal-image" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="text">Descrição:</label>
                    <textarea
                        id="text"
                        name="text"
                        value={post.text}
                        onChange={handleChange}
                        className="textarea"
                    />
                </div>
                <div className="button-group">
                    <button type="button" onClick={handleUpdate} className="btn-update">Atualizar</button>
                    <button type="button" onClick={handleCancel} className="btn-cancel">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default PostUpdate;
