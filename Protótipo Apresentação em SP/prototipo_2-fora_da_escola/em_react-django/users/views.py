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

# users/views.py
import logging
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator

User = get_user_model()

logger = logging.getLogger(__name__)

def decode_uid(uidb64):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        return uid
    except (TypeError, ValueError, OverflowError):
        raise ValidationError("Invalid UID")

class ResetEmailView(APIView):
    permission_classes = [AllowAny]  # Permite o acesso sem autenticação

    def post(self, request, *args, **kwargs):
        current_password = request.data.get("current_password")
        new_email = request.data.get("new_email")
        re_new_email = request.data.get("re_new_email")
        
        # Validando os campos
        if not current_password or not new_email or not re_new_email:
            logger.error("Todos os campos são obrigatórios.")
            return Response({"detail": "Todos os campos são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        if new_email != re_new_email:
            logger.error("Os e-mails não coincidem.")
            return Response({"detail": "Os e-mails não coincidem."}, status=status.HTTP_400_BAD_REQUEST)

        # Verificando se o UID e o token são válidos
        uidb64 = kwargs.get('uid')
        token = kwargs.get('token')
        
        try:
            uid = decode_uid(uidb64)
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            logger.error(f"Erro ao decodificar UID ou usuário não encontrado: {str(e)}")
            return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        if not default_token_generator.check_token(user, token):
            logger.error("Token inválido ou expirado.")
            return Response({"detail": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)

        # Verificando a senha atual
        if not check_password(current_password, user.password):
            logger.error("Senha atual incorreta.")
            return Response({"detail": "Senha atual incorreta."}, status=status.HTTP_400_BAD_REQUEST)

        # Atualizando o e-mail do usuário
        logger.info(f"Atualizando e-mail de {user.email} para {new_email}")
        user.email = new_email
        
        try:
            user.save(update_fields=["email"])
            logger.info(f"E-mail atualizado com sucesso para {user.email}")
            return Response({"detail": "E-mail redefinido com sucesso."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erro ao salvar o e-mail no banco de dados: {str(e)}")
            return Response({"detail": "Erro ao salvar o e-mail."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
