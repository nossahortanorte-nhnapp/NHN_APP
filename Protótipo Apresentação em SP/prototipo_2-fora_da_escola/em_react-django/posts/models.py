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

import re
from django.db import models
from profiles.models import Profile
from django.db import IntegrityError

class Like(models.Model):
    profile = models.ForeignKey(Profile, related_name='likes', blank=True, on_delete=models.CASCADE)
    post = models.ForeignKey("Post", related_name='post_likes', on_delete=models.CASCADE)  # Alterado o related_name para 'post_likes'
    like = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f'{self.profile} liked {self.post}'
    
class Hashtag(models.Model):
    title = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.title

class Post(models.Model):
    doacao = models.BooleanField(default=False)
    troca = models.BooleanField(default=False)
    venda = models.BooleanField(default=False)
    title = models.CharField(max_length=100)
    text = models.TextField(max_length=3693)
    image = models.ImageField(null=True, blank=True, upload_to='post/')
    data_postagem = models.DateTimeField(auto_now=True)
    profile = models.ForeignKey(Profile, related_name='posts', on_delete=models.CASCADE)
    hashtags = models.ManyToManyField("Hashtag", related_name='posts', blank=True)
    archive = models.BooleanField(default=False)
    likes = models.ManyToManyField("Like", related_name='liked_posts', blank=True)  # Alterado o related_name para 'liked_posts'

    def save(self, *args, **kwargs):
        try:
            # Salva o post antes de adicionar hashtags
            super().save(*args, **kwargs)
            
            # Identifica hashtags no texto
            hashtags_in_text = re.findall(r'#(\w+)', self.text)
            
            # Adiciona hashtags ao campo ManyToMany
            for tag in hashtags_in_text:
                hashtag, created = Hashtag.objects.get_or_create(title=tag.lower())  # Corrigido para 'title'
                self.hashtags.add(hashtag)
            
            # Salva novamente para garantir que as hashtags sejam registradas
            # A verificação abaixo garante que não salvamos novamente se o objeto já foi salvo
            if not self.pk:
                super().save(*args, **kwargs)
        except IntegrityError as e:
            # Registra o erro de integridade
            print(f"IntegrityError: {e}")
            # Você pode adicionar um mecanismo para lidar com o erro, como logging ou notificação
            # Por exemplo, você pode reverter o objeto não salvo ou exibir uma mensagem de erro

    def __str__(self):
        return self.title
