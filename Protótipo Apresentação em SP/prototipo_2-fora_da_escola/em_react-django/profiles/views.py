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

# profiles/views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile, Follower
from .serializers import ProfileListSerializer, ProfileMeSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class IsFollowingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, profile_id):
        user_profile = request.user.profile
        target_profile = Profile.objects.get(id=profile_id)
        
        is_following = Follower.objects.filter(follower=user_profile, following=target_profile).exists()
        
        return Response({"is_following": is_following}, status=status.HTTP_200_OK)



# View para listar quem o perfil selecionado está seguindo
class FollowingListId(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileListSerializer

    def get_queryset(self):
        # Pega o perfil selecionado (pelo ID)
        profile_id = self.kwargs['profile_id']
        selected_profile = Profile.objects.get(id=profile_id)
        # Retorna os perfis que o perfil selecionado está seguindo
        return Profile.objects.filter(followers__follower=selected_profile)

# View para listar os seguidores do perfil selecionado
class FollowersListId(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileListSerializer

    def get_queryset(self):
        # Pega o perfil selecionado (pelo ID)
        profile_id = self.kwargs['profile_id']
        selected_profile = Profile.objects.get(id=profile_id)
        # Retorna os perfis que seguem o perfil selecionado
        return Profile.objects.filter(following__following=selected_profile)


class FollowingList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileListSerializer

    def get_queryset(self):
        user_profile = self.request.user.profile
        return Profile.objects.filter(followers__follower=user_profile)

class FollowersList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileListSerializer

    def get_queryset(self):
        user_profile = self.request.user.profile
        return Profile.objects.filter(following__following=user_profile)

class FollowUnfollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_profile = request.user.profile
        profile_id = self.kwargs['profile_id']
        target_profile = Profile.objects.get(id=profile_id)

        if user_profile == target_profile:
            return Response({"detail": "Você não pode seguir a si mesmo."}, status=status.HTTP_400_BAD_REQUEST)

        follow_instance, created = Follower.objects.get_or_create(follower=user_profile, following=target_profile)
        
        if created:
            return Response({"detail": "Agora você está seguindo este perfil."}, status=status.HTTP_201_CREATED)
        else:
            follow_instance.delete()
            return Response({"detail": "Você deixou de seguir este perfil."}, status=status.HTTP_204_NO_CONTENT)


class ProfileDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtém o perfil do usuário logado
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileMeSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_404_NOT_FOUND)


class ProfileList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileListSerializer

class ProfileListDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileListSerializer
    lookup_field = 'id'

# View para atualizar o perfil do usuário logado
class ProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileMeSerializer

    def get_object(self):
        # Retorna o perfil do usuário logado
        return self.request.user.profile
