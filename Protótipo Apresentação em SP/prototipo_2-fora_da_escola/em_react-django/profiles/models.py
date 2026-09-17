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

from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from users.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_name = models.CharField(max_length=50, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    photo = models.ImageField(default='profile_avatar.jpeg', upload_to='profile/')
    bio = models.TextField(default='Escreva sua bio...', max_length=100)
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)

    # Horários de atendimento para cada dia da semana
    monday_morning_start = models.TimeField(blank=True, null=True)
    monday_morning_end = models.TimeField(blank=True, null=True)
    monday_afternoon_start = models.TimeField(blank=True, null=True)
    monday_afternoon_end = models.TimeField(blank=True, null=True)
    monday_evening_start = models.TimeField(blank=True, null=True)
    monday_evening_end = models.TimeField(blank=True, null=True)
    monday_night_start = models.TimeField(blank=True, null=True)
    monday_night_end = models.TimeField(blank=True, null=True)
    
    tuesday_morning_start = models.TimeField(blank=True, null=True)
    tuesday_morning_end = models.TimeField(blank=True, null=True)
    tuesday_afternoon_start = models.TimeField(blank=True, null=True)
    tuesday_afternoon_end = models.TimeField(blank=True, null=True)
    tuesday_evening_start = models.TimeField(blank=True, null=True)
    tuesday_evening_end = models.TimeField(blank=True, null=True)
    tuesday_night_start = models.TimeField(blank=True, null=True)
    tuesday_night_end = models.TimeField(blank=True, null=True)

    wednesday_morning_start = models.TimeField(blank=True, null=True)
    wednesday_morning_end = models.TimeField(blank=True, null=True)
    wednesday_afternoon_start = models.TimeField(blank=True, null=True)
    wednesday_afternoon_end = models.TimeField(blank=True, null=True)
    wednesday_evening_start = models.TimeField(blank=True, null=True)
    wednesday_evening_end = models.TimeField(blank=True, null=True)
    wednesday_night_start = models.TimeField(blank=True, null=True)
    wednesday_night_end = models.TimeField(blank=True, null=True)

    thursday_morning_start = models.TimeField(blank=True, null=True)
    thursday_morning_end = models.TimeField(blank=True, null=True)
    thursday_afternoon_start = models.TimeField(blank=True, null=True)
    thursday_afternoon_end = models.TimeField(blank=True, null=True)
    thursday_evening_start = models.TimeField(blank=True, null=True)
    thursday_evening_end = models.TimeField(blank=True, null=True)
    thursday_night_start = models.TimeField(blank=True, null=True)
    thursday_night_end = models.TimeField(blank=True, null=True)

    friday_morning_start = models.TimeField(blank=True, null=True)
    friday_morning_end = models.TimeField(blank=True, null=True)
    friday_afternoon_start = models.TimeField(blank=True, null=True)
    friday_afternoon_end = models.TimeField(blank=True, null=True)
    friday_evening_start = models.TimeField(blank=True, null=True)
    friday_evening_end = models.TimeField(blank=True, null=True)
    friday_night_start = models.TimeField(blank=True, null=True)
    friday_night_end = models.TimeField(blank=True, null=True)

    saturday_morning_start = models.TimeField(blank=True, null=True)
    saturday_morning_end = models.TimeField(blank=True, null=True)
    saturday_afternoon_start = models.TimeField(blank=True, null=True)
    saturday_afternoon_end = models.TimeField(blank=True, null=True)
    saturday_evening_start = models.TimeField(blank=True, null=True)
    saturday_evening_end = models.TimeField(blank=True, null=True)
    saturday_night_start = models.TimeField(blank=True, null=True)
    saturday_night_end = models.TimeField(blank=True, null=True)

    sunday_morning_start = models.TimeField(blank=True, null=True)
    sunday_morning_end = models.TimeField(blank=True, null=True)
    sunday_afternoon_start = models.TimeField(blank=True, null=True)
    sunday_afternoon_end = models.TimeField(blank=True, null=True)
    sunday_evening_start = models.TimeField(blank=True, null=True)
    sunday_evening_end = models.TimeField(blank=True, null=True)
    sunday_night_start = models.TimeField(blank=True, null=True)
    sunday_night_end = models.TimeField(blank=True, null=True)

    @receiver(post_save, sender=User)
    def create_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance, email=instance.email, first_name=instance.first_name, last_name=instance.last_name)

    @receiver(post_save, sender=User)
    def save_profile(sender, instance, **kwargs):
        instance.profile.save()

    def __str__(self):
        return f'{self.user.email}'

class Follower(models.Model):
    follower = models.ForeignKey(Profile, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(Profile, related_name='followers', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f'{self.follower.profile_name} follows {self.following.profile_name}'
