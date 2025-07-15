from rest_framework import serializers
from .models import Fundo

class FundoSerializer(serializers.ModelSerializer):
    relatorios = serializers.ListField(
        child=serializers.CharField(),  # Define que cada item é uma string
        allow_empty=True,               # Permite lista vazia
        required=False,                 # Torna o campo opcional
        default=list                    # Valor padrão é lista vazia
    )

    class Meta:
        model = Fundo
        fields = '__all__'

    def validate_relatorios(self, value):
        """Garante que o valor final seja sempre uma lista, mesmo se vier como null"""
        return value or []  # Converte None/null para lista vazia