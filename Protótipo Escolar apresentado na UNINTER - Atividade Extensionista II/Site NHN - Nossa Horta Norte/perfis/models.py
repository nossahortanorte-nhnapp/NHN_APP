from django.db import models
from django.contrib.auth.models import User


class Perfil(models.Model):
    nome = models.CharField(max_length=255, null=False)
    telefone = models.CharField(max_length=15, null=True, blank=True)
    endereco_maps = models.CharField(max_length=255, null=True, blank=True)
    imagem_perfil = models.ImageField(null=True, blank=True, upload_to='uploads/fotoperfil/')
    imagem_capa = models.ImageField(null=True, blank=True, upload_to='uploads/fotocapa/')
    cor = models.CharField(max_length=10, default='#455A64')
    contatos = models.ManyToManyField('self')

    usuario = models.OneToOneField(User, related_name='perfil', on_delete=models.CASCADE)

    @property
    def email(self):
        return self.usuario.email

    def convidar(self, perfil_convidado):
        convite = Convite(solicitante=self,convidado = perfil_convidado)
        convite.save()

    def desfazer_amizade(self, perfil_amizade):
        self.contatos.remove(perfil_amizade.id)


class Convite(models.Model):
    solicitante = models.ForeignKey(Perfil,on_delete=models.CASCADE,related_name='convites_feitos' )
    convidado = models.ForeignKey(Perfil, on_delete= models.CASCADE, related_name='convites_recebidos')

    def aceitar(self):
        self.convidado.contatos.add(self.solicitante)
        self.solicitante.contatos.add(self.convidado)
        self.delete()

    def rejeitar(self):
        self.delete()


class Post(models.Model):

    RELACAO_PRODUTO = [
        ("VENDA", "VENDA - Alimento disponível para venda"),
        ("TROCA", "TROCA - Alimento disponível para troca"),
        ("DOAÇÃO", "DOAÇÃO - Alimento disponível para doação")
    ]

    relacao = models.CharField(verbose_name = "Relação", max_length = 10, choices=RELACAO_PRODUTO, default="VENDA")
    titulo = models.CharField(max_length=250)
    text = models.TextField()
    data_postagem = models.DateTimeField(auto_now=True)
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='posts')
    imagem = models.ImageField(null=True, blank=True, upload_to='uploads/postagem/')
