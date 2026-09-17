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

# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from profiles.serializers import ProfileMeSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

class UserDetailSerializer(serializers.ModelSerializer):
    profile = ProfileMeSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'profile']

class ResetEmailSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    new_email = serializers.EmailField(write_only=True)
    re_new_email = serializers.EmailField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        
        # Verifica se a senha atual está correta
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({"current_password": "Senha atual incorreta."})

        # Verifica se os novos e-mails coincidem
        if data['new_email'] != data['re_new_email']:
            raise serializers.ValidationError({"new_email": "Os e-mails não coincidem."})

        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.email = self.validated_data['new_email']
        user.save()
        return user
