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

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Post, Hashtag, Like
from .serializers import PostSerializer, HashtagSerializer, LikeSerializer
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Post, Like

class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id, *args, **kwargs):
        post = get_object_or_404(Post, id=id)
        profile = request.user.profile

        # Check if the user has already liked the post
        like, created = Like.objects.get_or_create(profile=profile, post=post)
        if created or not like.like:
            like.like = True
            like.save()
            return Response({'message': 'Post curtido com sucesso.'}, status=status.HTTP_200_OK)
        return Response({'message': 'Você já curtiu este post.'}, status=status.HTTP_400_BAD_REQUEST)

class UnLikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id, *args, **kwargs):
        post = get_object_or_404(Post, id=id)
        profile = request.user.profile

        # Check if the user has liked the post
        like = get_object_or_404(Like, profile=profile, post=post)
        if like.like:
            like.like = False
            like.save()
            return Response({'message': 'Post descurtido com sucesso.'}, status=status.HTTP_200_OK)
        return Response({'message': 'Você ainda não curtiu este post.'}, status=status.HTTP_400_BAD_REQUEST)


class LikesPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        # Verifica se o post existe
        post = get_object_or_404(Post, id=id)

        # Obtém todos os likes associados ao post
        likes = Like.objects.filter(post=post)

        # Serializa os likes
        serializer = LikeSerializer(likes, many=True)

        # Retorna a lista de likes
        return Response(serializer.data, status=status.HTTP_200_OK)


class PostCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            serializer = PostSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(profile=request.user.profile)  # Adiciona o perfil ao serializer
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Internal Server Error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-data_postagem')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class PostListUserLogedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(profile=user.profile).order_by('-data_postagem')


class PostByHashtagList(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        hashtag = self.kwargs['hashtag']
        return Post.objects.filter(hashtags__title__iexact=hashtag)  # Ajustado para 'title'

class PostArchiveToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id, *args, **kwargs):
        post = get_object_or_404(Post, id=id)

        # Verifica se o usuário é o dono do post
        if post.profile != request.user.profile:
            return Response({'error': 'Você não tem permissão para alterar este post.'}, status=status.HTTP_403_FORBIDDEN)

        # Atualiza o campo 'archive'
        post.archive = request.data.get('archive')
        post.save()

        return Response({'message': 'Post atualizado com sucesso.', 'archive': post.archive}, status=status.HTTP_200_OK)

class PostUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id, *args, **kwargs):
        post = get_object_or_404(Post, id=id)

        # Verifica se o usuário é o dono do post
        if post.profile != request.user.profile:
            return Response({'error': 'Você não tem permissão para editar este post.'}, status=status.HTTP_403_FORBIDDEN)

        # Serializa os dados recebidos para validar e atualizar
        serializer = PostSerializer(post, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Post atualizado com sucesso.', 'post': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
