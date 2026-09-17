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

// ProfileList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profilessData } from '../features/lib/lib_profiles';
import axios from 'axios'; // Para fazer a requisição à API
import '../css/profile_list.css'; // Certifique-se de que o caminho está correto

const backend_domain = 'http://localhost:8000'; // Defina o domínio do backend

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInProfileId, setLoggedInProfileId] = useState(null); // Armazena o ID do perfil logado
  const [isFollowingMap, setIsFollowingMap] = useState({}); // Armazena o estado de seguir para cada perfil
  const [isHovered, setIsHovered] = useState(null);

  // Função para obter o token do localStorage
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.access : null;
    return token;
  };

  // Função para buscar se o perfil logado já segue o perfil listado
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

  // Função para seguir/deixar de seguir
  const handleFollow = async (profileId) => {
    const token = getToken();
    if (token) {
      try {
        const response = await axios.post(`${backend_domain}/api/v1/profile/follow/${profileId}/`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const newIsFollowingMap = { ...isFollowingMap };
        if (response.status === 201) {
          newIsFollowingMap[profileId] = true; // Agora está seguindo
        } else if (response.status === 204) {
          newIsFollowingMap[profileId] = false; // Deixou de seguir
        }
        setIsFollowingMap(newIsFollowingMap);
      } catch (error) {
        console.error("Erro ao seguir/deixar de seguir:", error);
      }
    }
  };

  // Função para obter o ID do perfil logado via API
  const fetchLoggedInProfileId = async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await axios.get(`${backend_domain}/api/v1/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoggedInProfileId(response.data.id); // Supondo que a API retorne o ID do perfil logado
      } catch (error) {
        console.error('Erro ao buscar o perfil logado:', error);
      }
    }
  };

  useEffect(() => {
    const getProfiles = async () => {
      const profilesData = await profilessData();
      setProfiles(profilesData);

      // Verifica para cada perfil se o usuário logado já está seguindo
      const isFollowingMapInitial = {};
      await Promise.all(profilesData.map(async (profile) => {
        const isFollowing = await checkIfFollowing(profile.id);
        isFollowingMapInitial[profile.id] = isFollowing;
      }));
      setIsFollowingMap(isFollowingMapInitial);
    };

    // Obter o ID do perfil logado via API e buscar a lista de perfis
    fetchLoggedInProfileId();
    getProfiles();
  }, []);

  // Filtra os perfis excluindo o do usuário logado
  const filteredProfiles = profiles
    .filter(profile => profile.id !== loggedInProfileId) // Exclui o perfil logado
    .filter(profile =>
      profile.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="profile-list-container">
      <input
        type="text"
        placeholder="Buscar Hortas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input-profile-list"
      />
      <div className="profile-list-grid-list-container">
        {filteredProfiles.map(profile => (
          <div key={profile.id} className="profile-list-item-list-container">
            <a href={profile.photo} target="_blank" rel="noopener noreferrer">
              <img 
                src={profile.photo}
                className="profile-img-avatar-perfil-list-container"
                alt={`${profile.first_name} ${profile.last_name}`}
              />
            </a>
            <div className="profile-details-list-container">
              <Link to={`/nossashortas/${profile.id}`}>
                <p className="profile-name-list-container">{profile.profile_name} - por {profile.first_name} {profile.last_name}</p>
                <p className="profile-bio-list-container">{profile.bio}</p>
              </Link>
            </div>
            <div className="follow-container">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileList;
