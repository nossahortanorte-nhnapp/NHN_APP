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
from posts.views import PostListView, PostDetailView, PostListUserLogedView, PostCreateView, PostByHashtagList, LikesPostView, LikePostView, UnLikePostView, PostArchiveToggleView, PostUpdateView

urlpatterns = [
    path('', PostListView.as_view(), name='food-list'),
    path('postar/', PostCreateView.as_view(), name='post-food'),
    path('<int:id>/archive/', PostArchiveToggleView.as_view(), name='post-archive-toggle'),
    path('<int:id>/', PostDetailView.as_view(), name='food-detail'),
    path('update/<int:id>/', PostUpdateView.as_view(), name='post-update'),
    path('<int:id>/like/', LikePostView.as_view(), name='like-post'),
    path('<int:id>/unlike/', UnLikePostView.as_view(), name='unlike-post'),
    path('<int:id>/likes/', LikesPostView.as_view(), name='likes-post'),

    path('minhahorta/', PostListUserLogedView.as_view(), name='post-list-user-logged'),

    path('hashtags/<str:hashtag>/', PostByHashtagList.as_view(), name='post-by-hashtag'),
    

]
