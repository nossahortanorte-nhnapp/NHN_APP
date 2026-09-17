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

from rest_framework import serializers
from .models import Profile
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']

class ProfileMeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'profile_name', 'first_name', 'last_name', 'user', 'photo', 'bio', 'birth_date', 'created', 'updated',
            'monday_morning_start', 'monday_morning_end', 'monday_afternoon_start', 'monday_afternoon_end',
            'monday_evening_start', 'monday_evening_end', 'monday_night_start', 'monday_night_end',
            'tuesday_morning_start', 'tuesday_morning_end', 'tuesday_afternoon_start', 'tuesday_afternoon_end',
            'tuesday_evening_start', 'tuesday_evening_end', 'tuesday_night_start', 'tuesday_night_end',
            'wednesday_morning_start', 'wednesday_morning_end', 'wednesday_afternoon_start', 'wednesday_afternoon_end',
            'wednesday_evening_start', 'wednesday_evening_end', 'wednesday_night_start', 'wednesday_night_end',
            'thursday_morning_start', 'thursday_morning_end', 'thursday_afternoon_start', 'thursday_afternoon_end',
            'thursday_evening_start', 'thursday_evening_end', 'thursday_night_start', 'thursday_night_end',
            'friday_morning_start', 'friday_morning_end', 'friday_afternoon_start', 'friday_afternoon_end',
            'friday_evening_start', 'friday_evening_end', 'friday_night_start', 'friday_night_end',
            'saturday_morning_start', 'saturday_morning_end', 'saturday_afternoon_start', 'saturday_afternoon_end',
            'saturday_evening_start', 'saturday_evening_end', 'saturday_night_start', 'saturday_night_end',
            'sunday_morning_start', 'sunday_morning_end', 'sunday_afternoon_start', 'sunday_afternoon_end',
            'sunday_evening_start', 'sunday_evening_end', 'sunday_night_start', 'sunday_night_end'
        ]

class ProfileListSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='profile-detail', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'photo', 'profile_name', "first_name", "last_name", 'bio', 'email', 'url', 'birth_date', 'created', 'updated',
            'monday_morning_start', 'monday_morning_end', 'monday_afternoon_start', 'monday_afternoon_end',
            'monday_evening_start', 'monday_evening_end', 'monday_night_start', 'monday_night_end',
            'tuesday_morning_start', 'tuesday_morning_end', 'tuesday_afternoon_start', 'tuesday_afternoon_end',
            'tuesday_evening_start', 'tuesday_evening_end', 'tuesday_night_start', 'tuesday_night_end',
            'wednesday_morning_start', 'wednesday_morning_end', 'wednesday_afternoon_start', 'wednesday_afternoon_end',
            'wednesday_evening_start', 'wednesday_evening_end', 'wednesday_night_start', 'wednesday_night_end',
            'thursday_morning_start', 'thursday_morning_end', 'thursday_afternoon_start', 'thursday_afternoon_end',
            'thursday_evening_start', 'thursday_evening_end', 'thursday_night_start', 'thursday_night_end',
            'friday_morning_start', 'friday_morning_end', 'friday_afternoon_start', 'friday_afternoon_end',
            'friday_evening_start', 'friday_evening_end', 'friday_night_start', 'friday_night_end',
            'saturday_morning_start', 'saturday_morning_end', 'saturday_afternoon_start', 'saturday_afternoon_end',
            'saturday_evening_start', 'saturday_evening_end', 'saturday_night_start', 'saturday_night_end',
            'sunday_morning_start', 'sunday_morning_end', 'sunday_afternoon_start', 'sunday_afternoon_end',
            'sunday_evening_start', 'sunday_evening_end', 'sunday_night_start', 'sunday_night_end'
        ]
