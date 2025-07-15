from django.db import models

class Fundo(models.Model):
    st_cnpj_fundo = models.CharField(max_length=20, unique=True)
    st_classe_fundo = models.CharField(max_length=100)
    st_estrategia_fundo = models.TextField()
    st_obs_fundo = models.TextField(blank=True, null=True)
    relatorios = models.JSONField(default=list, blank=True,
        null=False 
        )
    cod_quantum_fundomaster = models.CharField(max_length=50, blank=True, null=True)
    st_cnpj_fundomaster = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"Fundo {self.st_cnpj_fundo}"