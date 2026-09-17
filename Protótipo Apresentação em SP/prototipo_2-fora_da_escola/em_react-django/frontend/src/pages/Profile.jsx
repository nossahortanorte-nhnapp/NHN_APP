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

// Profile.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { getProfileInfo } from '../features/auth/authService';
import { toast } from 'react-toastify';
import '../css/profile.css';
import { useDispatch, useSelector } from 'react-redux';
import { resetEmailConfirm, resetPassword, getUserInfo } from '../features/auth/authSlice';

const backend_domain = 'http://localhost:8000';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [alimentosCount, setAlimentosCount] = useState(0);
    const [editing, setEditing] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const cropperRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { isError, isSuccess, message } = useSelector((state) => state.auth);
    const [isEmailButtonVisible, setIsEmailButtonVisible] = useState(true);
    const [isPasswordButtonVisible, setIsPasswordButtonVisible] = useState(true);
    const [following, setFollowing] = useState([]);
    const [showFollowing, setShowFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [showFollowers, setShowFollowers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFollowingMap, setIsFollowingMap] = useState({}); // Armazena o estado de seguir para cada perfil
    const [loggedInProfileId, setLoggedInProfileId] = useState(null); // ID do perfil logado
    const [isHovered, setIsHovered] = useState(null);
    const [activeTab, setActiveTab] = useState('disponiveis'); // Default to 'Disponíveis' tab
    const availablePosts = posts.filter(post => !post.archive);
    const archivedPosts = posts.filter(post => post.archive);
    

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                
                
                const token = getToken();
                
    
                if (!token) {
                    
                    navigate('/login/');
                    return;
                }
    
                
                const response = await axios.get(`${backend_domain}/api/v1/profile/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                
                if (response.status === 200 && response.data) {
                    const data = response.data;
                    
                    setProfile(data);
                    setLoggedInProfileId(data.id);
                
                    
                
                    // Fetch following and followers
                    
                    fetchFollowingAndFollowers(data.id);
                }
            } catch (error) {
                console.error('Erro ao carregar perfil', error.response ? error.response.data : error.message);
            }
        };
    
        
        fetchProfileData();
    }, [navigate]);
    
    

    const fetchFollowingAndFollowers = async (profileId) => {
        try {
            const followingResponse = await axios.get(`${backend_domain}/api/v1/profile/${profileId}/following/`);
            const followersResponse = await axios.get(`${backend_domain}/api/v1/profile/${profileId}/followers/`);

            // Filtrar o próprio perfil da lista de seguidores e seguidos
            setFollowing(followingResponse.data.filter(p => p.id !== profileId));
            setFollowers(followersResponse.data.filter(p => p.id !== profileId));

            // Mapear perfis seguidos
            const followingMap = {};
            followingResponse.data.forEach(profile => {
                followingMap[profile.id] = true;
            });
            setIsFollowingMap(followingMap);
        } catch (error) {
            console.error('Erro ao buscar perfis seguidos e seguidores', error);
            setErrorMessage('Erro ao carregar os perfis seguidos ou seguidores.');
        }
    };


    const handleFollow = async (profileId) => {
        try {
            const token = getToken();
            const response = await axios.post(`${backend_domain}/api/v1/profile/follow/${profileId}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const updatedIsFollowingMap = { ...isFollowingMap };
            let updatedFollowing = [...following];
    
            if (response.status === 201) {
                // Agora está seguindo o perfil
                updatedIsFollowingMap[profileId] = true;
                const newFollowedProfile = followers.find(profile => profile.id === profileId);
                if (newFollowedProfile) {
                    updatedFollowing.push(newFollowedProfile); // Adiciona o perfil aos seguidos
                }
            } else if (response.status === 204) {
                // Deixou de seguir o perfil
                updatedIsFollowingMap[profileId] = false;
                updatedFollowing = updatedFollowing.filter(profile => profile.id !== profileId); // Remove o perfil dos seguidos
            }
    
            // Atualiza o estado
            setIsFollowingMap(updatedIsFollowingMap);
            setFollowing(updatedFollowing); // Atualiza o array following imediatamente
        } catch (error) {
            console.error('Erro ao seguir/deixar de seguir', error);
        }
    };
    


    useEffect(() => {
        if (loggedInProfileId) {  // Verifica se o ID do perfil logado foi definido
            axios.get(`${backend_domain}/api/v1/profile/${loggedInProfileId}/followers/`)
                .then(response => {
                    
                    setFollowers(response.data);
                })
                .catch(error => {
                    console.error('Ocorreu um erro ao buscar os seguidores!', error);
                    setErrorMessage('Erro ao carregar os seguidores.');
                });
        }
    }, [loggedInProfileId]);  // Adiciona o `loggedInProfileId` como dependência
    
    

    const filteredFollowing = following.filter(profile => 
        profile.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFollowers = followers.filter(profile => 
        profile.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (loggedInProfileId) {  // Verifica se o ID do perfil logado foi definido
            axios.get(`${backend_domain}/api/v1/profile/${loggedInProfileId}/following/`)
                .then(response => {
                    
                    setFollowing(response.data);
                })
                .catch(error => {
                    console.error('Ocorreu um erro ao buscar os perfis seguidos!', error);
                    setErrorMessage('Erro ao carregar os perfis seguidos.');
                });
        }
    }, [loggedInProfileId]);  // Adiciona o `loggedInProfileId` como dependência
    
    

    useEffect(() => {
        if (!userInfo.profile) {
            dispatch(getUserInfo());
        }
    }, [dispatch, userInfo.profile]);

    useEffect(() => {
        const emailResetClicked = localStorage.getItem('emailResetClicked');
        const passwordResetClicked = localStorage.getItem('passwordResetClicked');
        
        if (emailResetClicked) {
            setIsEmailButtonVisible(false);
        }
        
        if (passwordResetClicked) {
            setIsPasswordButtonVisible(false);
        }
    }, []);

    const handlePasswordReset = () => {
        setIsPasswordButtonVisible(false);
        localStorage.setItem('passwordResetClicked', 'true');

        const email = profile.user.email;
        if (email) {
            dispatch(resetPassword({ email }))
                .unwrap()
                .then(() => {
                    toast.success('Um link para redefinir sua senha foi enviado para o seu e-mail.');
                })
                .catch((error) => {
                    toast.error('Erro ao tentar enviar o link de redefinição de senha.');
                });
        } else {
            toast.error('Email do perfil não encontrado.');
        }
    };

    const handleEmailReset = () => {
        setIsEmailButtonVisible(false);
        localStorage.setItem('emailResetClicked', 'true');

        const userData = {
            email: profile.user.email
        };

        dispatch(resetEmailConfirm(userData))
            .then(() => {
                toast.success("Um e-mail de redefinição de email foi enviado para seu email.");
            })
            .catch((error) => {
                console.error("Erro ao enviar e-mail de redefinição:", error);
                toast.error("Falha ao enviar o e-mail de redefinição.");
            });
    };

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success("Um e-mail de redefinição de email foi enviado para seu email com sucesso!");
        }
    }, [isError, isSuccess, message]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfileInfo();
            

                if (data.photo && !data.photo.startsWith('http')) {
                    data.photo = `${backend_domain}${data.photo}`;
                }
                
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                setErrorMessage('Erro ao carregar o perfil.');
            }
        };

        fetchProfile();
    }, []);


    useEffect(() => {
        axios.get(`${backend_domain}/api/v1/alimentos/minhahorta/`)
            .then(response => {
                
                setPosts(response.data);
                            
                const alimentos = response.data.filter(post => !post.archive);
                setAlimentosCount(alimentos.length);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao buscar as postagens!', error);
                setErrorMessage('Erro ao carregar as postagens.');
            });
    }, []);

    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.access : null;
        
        return token;
    };

    const handleCrop = () => {
        const cropper = cropperRef.current.cropper;
        cropper.getCroppedCanvas({
            width: 693,
            height: 693,
        }).toBlob((blob) => {
            
            setCroppedImage(blob);
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            setProfile({ ...profile, photo: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const token = getToken();

        if (!token) {
            console.error('Token não encontrado!');
            alert('Você precisa fazer login novamente.');
            navigate('/login/');
            return;
        }

        const formData = new FormData();
        formData.append('first_name', profile.first_name);
        formData.append('last_name', profile.last_name);
        formData.append('profile_name', profile.profile_name);
        formData.append('bio', profile.bio);
        formData.append('birth_date', profile.birth_date);
        if (croppedImage) {
            formData.append('photo', croppedImage, profile.profile_name + '.jpg');
            
        }

        try {
            
            await axios.put(`${backend_domain}/api/v1/profile/update/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            toast.success('Perfil atualizado com sucesso!');
            setEditing(false);
            navigate('/minhahorta/');
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error.response ? error.response.data : error.message);
            toast.success('Erro ao atualizar o perfil. Por favor, tente novamente.');
            if (error.response && error.response.status === 401) {
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                localStorage.removeItem('token');
                navigate('/login/');
            }
        }
    };



    const handleCancel = () => {
        setEditing(false);
        setShowFollowing(false);
        setShowFollowers(false);
        setSuccessMessage('');
        setErrorMessage('');
        const fetchProfile = async () => {
            try {
                const data = await getProfileInfo();
                
                if (data.photo && !data.photo.startsWith('http')) {
                    data.photo = `${backend_domain}${data.photo}`;
                }
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
            }
        };
        fetchProfile();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    };

    if (!profile) return <div>Carregando...</div>;

    return (
        <div className="container">
            <br/>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="profile-container-profile-1">
                {editing ? (
                    <form onSubmit={handleSubmit}>
                        <p>
                            <br/><br/><br/><span className="label-text">Nome da Horta:</span>
                            <input
                                type="text"
                                value={profile.profile_name}
                                className="name-profile-field"
                                onChange={(e) => {
                                    
                                    setProfile({ ...profile, profile_name: e.target.value });
                                }}
                                required
                            />
                        </p>
                        <div className="flex-container">
                            <p>
                                <span className="label-text">Nome:</span>
                                <input
                                    type="text"
                                    value={profile.first_name}
                                    className="left-aligned input-field"
                                    onChange={(e) => {
                                        
                                        setProfile({ ...profile, first_name: e.target.value });
                                    }}
                                    required
                                />
                            </p>
                            <p>
                                <span className="label-text">Sobrenome:</span>
                                <input
                                    type="text"
                                    value={profile.last_name}
                                    className="left-aligned input-field"
                                    onChange={(e) => {
                                        
                                        setProfile({ ...profile, last_name: e.target.value });
                                    }}
                                    required
                                />
                            </p>
                        </div>
                        <p>
                            <span className="label-text">Biografia:</span>
                            <textarea
                                value={profile.bio}
                                className="bio-field"
                                onChange={(e) => {
                                    
                                    setProfile({ ...profile, bio: e.target.value });
                                }}
                                required
                            />
                        </p>
                        <p>
                            <span className="label-text">Data Nascimento:</span>
                            <input
                                type="date"
                                value={profile.birth_date}
                                className="birth-field"
                                onChange={(e) => {
                                    
                                    setProfile({ ...profile, birth_date: e.target.value });
                                }}
                                required
                            />
                        </p>
                        <p>
                            <span className="label-text">Carregar imagem:</span>
                            <input
                                type="file"
                                className="choose-file"
                                onChange={handleImageChange}
                            />
                        </p>
                        {profile.photo && (
                            <Cropper
                                src={profile.photo}
                                style={{ height: 400, width: '100%' }}
                                initialAspectRatio={1}
                                aspectRatio={1}
                                guides={false}
                                crop={handleCrop}
                                ref={cropperRef}
                            />
                        )}
                        <button className="btn btn-lg btn-dark" type="button" onClick={handleCancel}>Cancelar edição</button>
                        <button className="btn btn-lg btn-dark" type="submit">Salvar</button> 
                    </form> 
                ) : showFollowing ? (
                    <div className="followed-profiles">
                        <div className="fixed-top-container">
                            <a href="#" className="back-link" onClick={(e) => {
                                e.preventDefault();
                                handleCancel();
                            }}>
                                ⬅️ Voltar
                            </a>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar horta que estou seguindo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-profile-following"
                        />
                        
                        
                        {filteredFollowing.map((profile) => (
                            <div key={profile.id} className="profile-list-item-following">
                                <a href={profile.photo} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={profile.photo}
                                        alt={`${profile.first_name}'s Avatar`}
                                        className="profile-img-avatar-following"
                                    />
                                </a>
                                <div className="profile-details-following">
                                    <Link to={`/nossashortas/${profile.id}`}>
                                        <p className="profile-name-following">{profile.profile_name} - por {profile.first_name} {profile.last_name}</p>
                                        <p className="profile-bio-following">{profile.bio}</p>
                                    </Link>
                                    <div className="follow-container">
                                    {loggedInProfileId !== profile.id && (
                                        <button
                                            className={
                                            isFollowingMap[profile.id] 
                                                ? (isHovered === profile.id ? "following-button" : "unfollow-button")
                                                : "follow-button"
                                            }
                                            onClick={() => handleFollow(profile.id)}
                                            onMouseEnter={() => setIsHovered(profile.id)}
                                            onMouseLeave={() => setIsHovered(null)}
                                        >
                                            {isHovered === profile.id 
                                            ? (isFollowingMap[profile.id] ? "Deixar de seguir" : "Seguir") 
                                            : (isFollowingMap[profile.id] ? "Seguindo" : "Seguir")}
                                        </button>
                                    )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    
                    


                    </div>
                ) : showFollowers ? (
                    <div className="followed-profiles">
                        <div className="fixed-top-container">
                            <a href="#" className="back-link" onClick={(e) => {
                                e.preventDefault();
                                handleCancel();
                            }}>
                                ⬅️ Voltar
                            </a>
                            
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar horta que me segue..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-profile-followers"
                        />
                        
                        
                        {filteredFollowers.map((profile) => (
                            <div key={profile.id} className="profile-list-item-followers">
                                <a href={profile.photo} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={profile.photo}
                                        alt={`${profile.first_name}'s Avatar`}
                                        className="profile-img-avatar-followers"
                                    />
                                </a>
                                <div className="profile-details-followers">
                                    <Link to={`/nossashortas/${profile.id}`}>
                                        <p className="profile-name-followers">{profile.profile_name} - por {profile.first_name} {profile.last_name}</p>
                                        <p className="profile-bio-followers">{profile.bio}</p>
                                    </Link>
                                    <div className="follow-container">
                                    {loggedInProfileId !== profile.id && (
                                        <button
                                            className={
                                            isFollowingMap[profile.id] 
                                                ? (isHovered === profile.id ? "following-button" : "unfollow-button")
                                                : "follow-button"
                                            }
                                            onClick={() => handleFollow(profile.id)}
                                            onMouseEnter={() => setIsHovered(profile.id)}
                                            onMouseLeave={() => setIsHovered(null)}
                                        >
                                            {isHovered === profile.id 
                                            ? (isFollowingMap[profile.id] ? "Deixar de seguir" : "Seguir") 
                                            : (isFollowingMap[profile.id] ? "Seguindo" : "Seguir")}
                                        </button>
                                    )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    
                    


                    </div>
                ) : (
                    <>
                        <div className="profile-details">
                            <div className="profile-info-perfil">
                                {profile.photo && (
                                    <a href={profile.photo} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={profile.photo}
                                            alt={`${profile.first_name}'s Avatar`}
                                            className="profile-img-avatar-perfil"
                                        />
                                    </a>
                                )}
                            </div>
                            <div className="profile-name-text">Horta {profile.profile_name}</div>
                            <div className="links-container">
                                <Link 
                                    to="#alimentos-list" 
                                    className="alimentos-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const element = document.getElementById('alimentos-list');
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    <div className="alimentos-info">
                                        <span>{alimentosCount}</span>
                                        <span>Alimentos</span>
                                    </div>
                                </Link>
                                <Link 
                                    to="#" 
                                    className="seguindo-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowFollowing(true);
                                    }}
                                >
                                    <div className="seguindo-info">
                                        <span>{following.length}</span>
                                        <span>Seguindo</span>
                                    </div>
                                </Link>
                                <Link 
                                    to="#" 
                                    className="seguidores-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowFollowers(true);
                                    }}
                                >
                                    <div className="seguidores-info">
                                        <span>{followers.length}</span>
                                        <span>Seguidores</span>
                                    </div>
                                </Link>
                            </div>
                            {errorMessage && <p>{errorMessage}</p>}
                            
                            <div className="profile-data-container">
                                <dl className="profile-data-list">
                                    <dt>Horta ID:</dt>
                                    <dd className="db-text">{profile.id}</dd>

                                    <dt>Proprietária(o):</dt>
                                    <dd className="db-text">{profile.first_name} {profile.last_name}</dd>

                                    <dt>Email:</dt>
                                    <dd className="db-text">{profile.user.email}</dd>

                                    <dt>Telefone:</dt>
                                    <dd className="db-text">(XX)00000-0000 Preciso colocar o Telefone aqui ainda</dd>

                                    <dt>Bio:</dt>
                                    <dd className="db-text">{profile.bio}</dd>

                                    <dt>Aniversário:</dt>
                                    <dd className="db-text">{formatDate(profile.birth_date)}</dd>

                                    <dt>Criado em:</dt>
                                    <dd className="db-text">{formatDate(profile.created)}</dd>

                                    <dt>Atualizado em:</dt>
                                    <dd className="db-text">{formatDate(profile.updated)}</dd>
                                </dl>

                                <button className="btn btn-lg btn-dark" onClick={() => setEditing(true)}>
                                    Editar Perfil
                                </button>

                                {isEmailButtonVisible && (
                                    <button className="btn btn-lg btn-dark" onClick={handleEmailReset}>
                                        Alterar E-Mail
                                    </button>
                                )}

                                {isPasswordButtonVisible && (
                                    <button className="btn btn-lg btn-dark" onClick={handlePasswordReset}>
                                        Alterar Senha
                                    </button>
                                )}
                            </div>
                        </div>

                    </>
                )}
            </div>
            {!showFollowing && !editing && !showFollowers && (
                <div className="posts-container" id="alimentos-list">
                    <hr />
                    <h1>Meus Alimentos</h1>
                    
                    {/* Tab container - Movido logo abaixo do título */}
                    <div className="tab-container-aliment">
                        <button
                            className={`tab-button ${activeTab === 'disponiveis' ? 'active' : ''}`}
                            onClick={() => setActiveTab('disponiveis')}
                        >
                            Disponíveis
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'arquivados' ? 'active' : ''}`}
                            onClick={() => setActiveTab('arquivados')}
                        >
                            Arquivados
                        </button>
                    </div>
                
                    {/* Renderiza os posts com base na aba ativa */}
                    {activeTab === 'disponiveis' && (
                        <div className="posts-grid">
                            {availablePosts.map(post => (
                                <Link key={post.id} to={`/alimentos/${post.id}`} className="post-item">
                                    <img
                                        src={post.image.startsWith('http') ? post.image : `${backend_domain}${post.image}`}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                
                    {activeTab === 'arquivados' && (
                        <div className="posts-grid">
                            {archivedPosts.map(post => (
                                <Link key={post.id} to={`/alimentos/${post.id}`} className="post-item">
                                    <img
                                        src={post.image.startsWith('http') ? post.image : `${backend_domain}${post.image}`}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            
            )}
        </div>
    );
};

export default Profile;

