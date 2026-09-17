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
from .models import Profile, Follower

# Register your models here.
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'profile_name', 'first_name', 'last_name', 'email', 'birth_date', 'created', 'updated')
    readonly_fields = ('created', 'updated')
    fieldsets = (
        (None, {
            'fields': ('user', 'profile_name', 'first_name', 'last_name', 'email', 'photo', 'bio', 'birth_date')
        }),
        ('Horários de Atendimento - Segunda-feira', {
            'fields': ('monday_morning_start', 'monday_morning_end', 'monday_afternoon_start', 'monday_afternoon_end', 
                       'monday_evening_start', 'monday_evening_end', 'monday_night_start', 'monday_night_end')
        }),
        ('Horários de Atendimento - Terça-feira', {
            'fields': ('tuesday_morning_start', 'tuesday_morning_end', 'tuesday_afternoon_start', 'tuesday_afternoon_end', 
                       'tuesday_evening_start', 'tuesday_evening_end', 'tuesday_night_start', 'tuesday_night_end')
        }),
        ('Horários de Atendimento - Quarta-feira', {
            'fields': ('wednesday_morning_start', 'wednesday_morning_end', 'wednesday_afternoon_start', 'wednesday_afternoon_end', 
                       'wednesday_evening_start', 'wednesday_evening_end', 'wednesday_night_start', 'wednesday_night_end')
        }),
        ('Horários de Atendimento - Quinta-feira', {
            'fields': ('thursday_morning_start', 'thursday_morning_end', 'thursday_afternoon_start', 'thursday_afternoon_end', 
                       'thursday_evening_start', 'thursday_evening_end', 'thursday_night_start', 'thursday_night_end')
        }),
        ('Horários de Atendimento - Sexta-feira', {
            'fields': ('friday_morning_start', 'friday_morning_end', 'friday_afternoon_start', 'friday_afternoon_end', 
                       'friday_evening_start', 'friday_evening_end', 'friday_night_start', 'friday_night_end')
        }),
        ('Horários de Atendimento - Sábado', {
            'fields': ('saturday_morning_start', 'saturday_morning_end', 'saturday_afternoon_start', 'saturday_afternoon_end', 
                       'saturday_evening_start', 'saturday_evening_end', 'saturday_night_start', 'saturday_night_end')
        }),
        ('Horários de Atendimento - Domingo', {
            'fields': ('sunday_morning_start', 'sunday_morning_end', 'sunday_afternoon_start', 'sunday_afternoon_end', 
                       'sunday_evening_start', 'sunday_evening_end', 'sunday_night_start', 'sunday_night_end')
        }),
        ('Informações adicionais', {
            'fields': ('created', 'updated'),
        }),
    )

admin.site.register(Profile, ProfileAdmin)
admin.site.register(Follower)
