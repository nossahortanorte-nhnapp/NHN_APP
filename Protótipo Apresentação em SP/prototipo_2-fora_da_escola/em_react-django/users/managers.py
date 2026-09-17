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

from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):

    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("Você deve inserir um e-mail valido"))

    
    def create_user(self, first_name, last_name, email, password, **extra_fields):

        if not first_name:
            raise ValueError(_("Os usuários devem enviar um primeiro nome"))
        
        if not last_name:
            raise ValueError(_("Os usuários devem enviar um sobrenome"))
        
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Usuário base: e endereço de e-mail são obrigatórios"))
        
        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        user.save()
        
        return user
        
    
    def create_superuser(self, first_name, last_name, email, password, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Os superusuários devem ter is_superuser=True"))
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Os superusuários devem ter is_staff=True"))
        
        if not password:
            raise ValueError(_("Os superusuários devem ter uma senha"))
        

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Usuário Admin: o endereço de e-mail é obrigatório"))
        
        user = self.create_user(first_name, last_name, email, password, **extra_fields)

        user.save()
                
        return user