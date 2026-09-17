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

# nhn_app/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include('djoser.urls')),  # URLs de autenticação
    path("api/v1/auth/", include('djoser.urls.jwt')),  # Autenticação JWT
    path('api/v1/auth/', include('djoser.urls.authtoken')),

    # URLs do aplicativo users (e-mail)
    path('api/v1/users/', include('users.urls')),

    # URLs do aplicativo profiles
    path('api/v1/profile/', include('profiles.urls')),  # Perfis

    # URLs do aplicativo posts (alimentos)
    path('api/v1/alimentos/', include('posts.urls')),  # Posts/alimentos
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
