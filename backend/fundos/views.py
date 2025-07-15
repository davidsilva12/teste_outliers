from django.shortcuts import render
from rest_framework import viewsets

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Fundo
from .serializers import FundoSerializer

@api_view(['POST'])
def criar_fundo(request):
    try:
        serializer = FundoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class FundoViewSet(viewsets.ModelViewSet):
    queryset = Fundo.objects.all()
    serializer_class = FundoSerializer