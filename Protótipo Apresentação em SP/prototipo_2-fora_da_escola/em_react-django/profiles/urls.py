# NHN_APP — Conectando Produtores e Consumidores de Orgânicos In-Natura
# Copyright (C) 2023–2026 Enio Alves Borges & Colaboradores do Projeto NHN_APP
#
# Este programa é um software livre; você pode redistribuí-lo e/ou modificá-lo
# sob os termos da Licença Pública Geral GNU Affero (GNU AGPLv3) conforme publicada
# pela Free Software Foundation, versão 3 da Licença.
#
# Este programa é distribuído na expectativa de ser útil, mas SEM QUALQUER
# GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO ou ADEQUAÇÃO A UM
# PROPÓSITO EM PARTICULAR. Veja a Licença Pública Geral GNU Affero para mais detalhes.
#
# Você deve ter recebido uma cópia da Licença Pública Geral GNU Affero junto com
# este programa. Se não, veja <https://www.gnu.org/licenses/>.

from django.urls import path
from .views import ProfileDetail, ProfileList, ProfileListDetail, ProfileUpdateView, FollowingList, FollowersList, FollowingListId, FollowersListId, FollowUnfollowView, IsFollowingView

urlpatterns = [
    path('', ProfileDetail.as_view(), name='profile-detail'),  # Detalhes do perfil logado
    path('s/', ProfileList.as_view(), name='profile-list'),  # Lista de perfis
    path('s/<int:pk>/', ProfileListDetail.as_view(), name='profile-detail'),  # Detalhes de um perfil específico
    path('update/', ProfileUpdateView.as_view(), name='profile-update'),  # Atualização do perfil logado
    path('<int:profile_id>/following/', FollowingListId.as_view(), name='following-list-id'),  # Perfis que o perfil específico está seguindo
    path('<int:profile_id>/followers/', FollowersListId.as_view(), name='followers-list-id'),  # Perfis que seguem o perfil específico
    path('follow/<int:profile_id>/', FollowUnfollowView.as_view(), name='follow-unfollow'),  # Seguir/Deixar de seguir um perfil
    path('is_following/<int:profile_id>/', IsFollowingView.as_view(), name='is-following'),  # Verificar se está seguindo um perfil específico

    # Nova rota para atualizar horários de atendimento
    path('update_schedule/', ProfileUpdateView.as_view(), name='profile-update-schedule'),  # Atualizar os horários de atendimento do perfil logado
]
