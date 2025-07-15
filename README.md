# teste_outliers

README - Projeto de Cadastro de Fundos

Minha Contribuição
Desenvolvi duas partes principais da stack conforme solicitado:

1. Backend (Django REST Framework)
Implementei o model Fundo com todos os campos requeridos

Criei o FundoViewSet com endpoints RESTful

Desenvolvi serializers com validações customizadas

Configurei o PostgreSQL para produção e SQLite para desenvolvimento

2. Frontend (Next.js + TypeScript)
Construí o formulário de cadastro com React Hook Form

Implementei validações em tempo real com Yup

Conectei com a API Django usando Axios

Adicionei máscaras para CNPJ e tratamento de erros

Como Executar o Projeto
Pré-requisitos
Node.js 18+

Python 3.10+

PostgreSQL (opcional para produção)

Passo a Passo
Backend

bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend

bash
cd frontend
npm install
npm run dev
Acessar Aplicação

Frontend: http://localhost:3000

API: http://localhost:8000/api/fundos/

Como Testei/Validei

Testes no Backend

- bash
- python manage.py test fundos
- Coleção de testes cobrindo todos os endpoints
- Validação de status codes e responses

Testes no Frontend

- Validações de formulário
- Testes de campos obrigatórios
- Validação de formato do CNPJ
- Verificação de erros de submit
- Testes de integração
- Conexão com API local e remota
- Tratamento de erros de rede
- Verificação cross-browser (Chrome, Firefox, Edge)


