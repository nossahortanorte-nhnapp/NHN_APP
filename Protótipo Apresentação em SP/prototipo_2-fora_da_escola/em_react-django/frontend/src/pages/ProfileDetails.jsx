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
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { profilessData } from '../features/lib/lib_profiles';
import '../css/profile_details.css';


const backend_domain = 'http://127.0.0.1:8000';

const ProfileDetails = () => {
  const { id } = useParams(); // ID do perfil sendo visualizado
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [alimentosCount, setAlimentosCount] = useState(0);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFollowingMap, setIsFollowingMap] = useState({}); // Armazena o estado de seguir para cada perfil
  const [loggedInProfileId, setLoggedInProfileId] = useState(null); // ID do perfil logado
  const [isHovered, setIsHovered] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Função para obter o token do localStorage
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.access : null;
  };

  // Função para buscar o perfil logado
  const fetchLoggedInProfileId = async () => {
    try {
      console.log("Iniciando fetchLoggedInProfileId...");
  
      const token = getToken();
      console.log("Token obtido:", token);
  
      if (!token) {
        console.log("Token não encontrado, redirecionando para login...");
        return; // Adicione um retorno para não continuar se não houver token
      }
  
      console.log("Fazendo requisição para obter o ID do perfil logado...");
      const response = await axios.get(`${backend_domain}/api/v1/profile/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Resposta completa recebida:", response);
      if (response.status === 200 && response.data) {
        const data = response.data;
        console.log("ID do perfil logado recebido:", data.id);
        setLoggedInProfileId(data.id);
      } else {
        console.log("Nenhum dado de perfil logado encontrado, status:", response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar o perfil logado', error.response ? error.response.data : error.message);
    }
  };
  

  // Função para verificar se o perfil está sendo seguido
  const checkIfFollowing = async (profileId) => {
    const token = getToken();
    if (token) {
      try {
        const response = await axios.get(`${backend_domain}/api/v1/profile/is_following/${profileId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.is_following;
      } catch (error) {
        console.error(`Erro ao verificar se está seguindo o perfil ${profileId}:`, error);
        return false;
      }
    }
    return false;
  };

 // Função para seguir/deixar de seguir um perfil
// Função para seguir/deixar de seguir um perfil
const handleFollow = async (profileId) => {
  const token = getToken();
  if (token) {
    try {
      const response = await axios.post(`${backend_domain}/api/v1/profile/follow/${profileId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newIsFollowingMap = { ...isFollowingMap }; // Mantenha o estado anterior
      if (response.status === 201) {
        // Agora está seguindo o perfil
        newIsFollowingMap[profileId] = true;
        setFollowers((prev) => [...prev, profile]); // Adiciona o perfil à lista de seguidores
      } else if (response.status === 204) {
        // Deixou de seguir o perfil
        newIsFollowingMap[profileId] = false;

        // Atualiza o estado de `followers` removendo o perfil
        setFollowers((prev) => prev.filter((follower) => follower.id !== profileId));
      }

      console.log('Atualizando o estado de isFollowingMap:', newIsFollowingMap);
      setIsFollowingMap(newIsFollowingMap);

      // Recarregar os perfis seguidos e seguidores, se necessário
      // await fetchFollowingAndFollowers();
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
    }
  }
};


// Função para buscar os perfis seguidos e seguidores
const fetchFollowingAndFollowers = async () => {
  try {
    const followingData = await axios.get(`${backend_domain}/api/v1/profile/${id}/following/`);
    const followersData = await axios.get(`${backend_domain}/api/v1/profile/${id}/followers/`);

    setFollowing(followingData.data);
    setFollowers(followersData.data);

    // Verificar se está seguindo cada perfil, incluindo o perfil acessado
    const isFollowingMapInitial = { ...isFollowingMap }; // Mantenha o estado anterior
    const allProfiles = followingData.data.concat(followersData.data);

    // Adicione o perfil que está sendo visualizado para garantir que ele também seja verificado
    if (!allProfiles.some(profile => profile.id === parseInt(id))) {
      allProfiles.push({ id: parseInt(id) }); // Adiciona o perfil acessado
    }

    await Promise.all(allProfiles.map(async (profile) => {
      const isFollowing = await checkIfFollowing(profile.id);
      isFollowingMapInitial[profile.id] = isFollowing;
    }));

    console.log("isFollowingMap inicializado:", isFollowingMapInitial);
    setIsFollowingMap(isFollowingMapInitial); // Atualize o estado com a fusão dos novos valores
  } catch (error) {
    console.error('Erro ao buscar os perfis seguidos ou seguidores!', error);
  }
};




  // Função para buscar o perfil atual
  const fetchProfile = async () => {
    try {
      const profiles = await profilessData();
      const profileData = profiles.find((p) => p.id === parseInt(id));
      if (profileData) {
        if (profileData.photo && !profileData.photo.startsWith('http')) {
          profileData.photo = `${backend_domain}${profileData.photo}`;
        }
        setProfile(profileData);
      } else {
        console.error('Perfil não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao buscar o perfil!', error);
    }
  };

  // Verificar se o perfil atual está sendo seguido quando o componente é montado
  useEffect(() => {
    fetchProfile();
    fetchLoggedInProfileId(); // Obter o ID do perfil logado
    fetchFollowingAndFollowers(); // Buscar perfis seguidos e seguidores
  }, [id]);

  const handleCancel = () => {
    setShowFollowing(false);
    setShowFollowers(false);
    setSearchTerm('');
  };

  const handleProfileClick = () => {
    setShowFollowing(false);
    setShowFollowers(false);
  };

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
    axios.get(`${backend_domain}/api/v1/alimentos/`)
      .then(response => {
        // Filtra os posts para manter apenas os que não estão arquivados
        const filteredPosts = response.data.filter(post => parseInt(post.profile.id) === parseInt(id) && !post.archive);
        setPosts(filteredPosts);
        setAlimentosCount(filteredPosts.length); // Atualiza a contagem de alimentos com os posts não arquivados
      })
      .catch(error => {
        console.error('Erro ao buscar as postagens!', error);
      });
  }, [id]);
  

  if (!profile) {
    return <p>Horta não encontrada.</p>;
  }

  return (
    <div className="container">
      {showFollowing ? (
        <div className="followed-profiles">
          <div className="fixed-top-container">
            <Link to="#" className="back-link" onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}>
              ⬅️ Voltar
            </Link>
            <input
              type="text"
              placeholder="Buscar horta que ele está seguindo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-profile-details"
            />
          </div>
          <div className="following-list-container">
            <div className="profile-list-grid-following">
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
                    <Link to={`/nossashortas/${profile.id}`} onClick={handleProfileClick}>
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
          </div>
        </div>
      ) : showFollowers ? (
        <div className="followed-profiles">
          <div className="fixed-top-container">
            <Link to="#" className="back-link" onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}>
              ⬅️ Voltar
            </Link>
            <input
              type="text"
              placeholder="Buscar horta que segue ele"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-profile-details"
            />
          </div>
          <div className="followers-list-container">
            <div className="profile-list-grid-followers">
              {filteredFollowers.map((profile) => (
                <div key={profile.id} className="profile-list-item-followers">
                  <a href={profile.photo} target="_blank" rel="noopener noreferrer">
                    <img
                      src={profile.photo}
                      alt={`${profile.profile_name}`}
                      className="profile-img-avatar-followers"
                    />
                  </a>
                  <div className="profile-details-followers">
                    <Link to={`/nossashortas/${profile.id}`} onClick={handleProfileClick}>
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
          </div>
        </div>
      ) : null}
      {!showFollowing && !showFollowers && (
        <>
          <div className="profile-container-profile-details">
          {profile.photo && (
            <img
              className="profile-img-avatar"
              src={profile.photo}
              alt={`${profile.first_name} ${profile.last_name}'s profile photo`}
              onClick={() => setIsModalOpen(true)} // Abre o modal ao clicar
              style={{ cursor: 'pointer' }} // Opcional: altera o cursor para indicar que é clicável
            />
          )}
          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>×</button> */}
                <img onClick={() => setIsModalOpen(false)}
                  src={profile.photo}
                  alt={`${profile.first_name} ${profile.last_name}'s profile photo`}
                  className="modal-image"
                />
              </div>
            </div>
          )}

            <div className="follow-container-profile">
              {loggedInProfileId !== profile.id && (
                <button
                  className={
                    isFollowingMap[profile.id] 
                      ? (isHovered === profile.id ? "following-button" : "unfollow-button")
                      : "follow-button"
                  }
                  onClick={() => {
                    console.log(`Clicou no botão de seguir/deixar de seguir para o perfil: ${profile.id}`);
                    handleFollow(profile.id); // Verifica o perfil a ser seguido/deixado de seguir
                  }}
                  onMouseEnter={() => {
                    console.log(`Mouse entrou no botão do perfil: ${profile.id}`);
                    setIsHovered(profile.id);
                  }}
                  onMouseLeave={() => {
                    console.log(`Mouse saiu do botão do perfil: ${profile.id}`);
                    setIsHovered(null);
                  }}
                >
                  {isHovered === profile.id 
                    ? (isFollowingMap[profile.id] ? "Deixar de seguir" : "Seguir") 
                    : (isFollowingMap[profile.id] ? "Seguindo" : "Seguir")}
                </button>
              )}
            </div>

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
              <Link to="#" className="seguindo-link" onClick={() => setShowFollowing(true)}>
                <div className="seguindo-info">
                  <span>{following.length}</span>
                  <span>Seguindo</span>
                </div>
              </Link>

              <Link to="#" className="seguidores-link" onClick={() => setShowFollowers(true)}>
                <div className="seguidores-info">
                  <span>{followers.length}</span>
                  <span>Seguidores</span>
                </div>
              </Link>
            </div>
            <h1>Horta {profile.profile_name} ID: {profile.id}</h1>
            <p>por {profile.first_name} {profile.last_name}</p>
            <p>Email: Preciso colocar o e-mail aqui ainda</p>
            <p>Telefone: Preciso colocar o Telefone aqui ainda</p>
            <p>Bio: *** {profile.bio} ***</p>
            <p>Aniversário: {profile.birth_date}</p>
            <p>Criado em: {profile.created}</p>
            <p>Atualizado em: {profile.updated}</p>
          </div>
          <div className="posts-container" id="alimentos-list">
            <h1>Alimentos</h1>
            <div className="posts-grid">
              {posts
                .filter(post => !post.archive)  // Filtra os posts que não estão arquivados
                .map(post => (
                  <Link key={post.id} to={`/alimentos/${post.id}`} className="post-item">
                    <img
                      src={post.image.startsWith('http') ? post.image : `${backend_domain}${post.image}`}
                      alt={post.title}
                      className="post-image"
                    />
                  </Link>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDetails;
