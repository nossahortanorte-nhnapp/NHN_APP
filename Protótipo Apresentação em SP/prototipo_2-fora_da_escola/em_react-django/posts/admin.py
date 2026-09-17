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

from django.contrib import admin
from .models import Hashtag, Post, Like

# Register your models here.
@admin.register(Hashtag)
class HashtagAdmin(admin.ModelAdmin):
    list_display = ('title',)  # Alterado para 'title' conforme o modelo

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'profile', 'data_postagem', 'archive', 'doacao', 'troca', 'venda')
    filter_horizontal = ('hashtags',)  # Adiciona uma interface para gerenciar hashtags
    # Opcional: você pode adicionar campos de pesquisa e filtros adicionais
    search_fields = ('title', 'text')
    list_filter = ('archive', 'doacao', 'troca', 'venda')
    
@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('profile', 'like', 'created', 'updated')
    list_filter = ('like', 'created')
    search_fields = ('profile__profile_name',)
