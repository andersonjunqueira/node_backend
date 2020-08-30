# MATCHDOG Backend Application

## Introdução

Esse projetos foi criado com base em: https://github.com/dev-mastery/comments-api

## Executando a aplicação

### Iniciando o DB

Usando o Docker, inicie uma instância do MongoDB ```docker run --name mongo -d -p 27017:27017 mongo:4.0.12-xenial```

### Iniciando o Server

Requisitos: NodeJS v8+

```
npm install
npm start
```
### Configurando a aplicação 

O arquivo .env contém configurações básicas do sistema 

* **MD_ENV**: Um marcador para o ambiente de execução, valores possíveis: dev
* **MD_BASE_URL**: A URL padrão do ambiente de sistema, por exemplo: http://localhost:3000/
* **MD_API_ROOT**: O dominio para os endpoints, por exemplo: /api 
* **MD_DB_URL**: URL do banco de dados, por exemplo: mongodb://localhost:27017
* **MD_DB_NAME**: O nome do banco de dados 
* **MD_SMTP_FROM_NAME**: O nome do remetente dos emails enviados pelo sistema
* **MD_SMTP_FROM_EMAIL**: O email do remetente dos emails enviados pelo sistema
* **MD_SMTP_HOST**: Host usado para enviar os emails
* **MD_SMTP_PORT**: Porta usada para enviar os emails
* **MD_SMTP_USER**: Usuário para autenticação no serviço de e-mail
* **MD_SMTP_PASSWORD**: e-mail para autenticação no serviço de e-mail
* **MD_PASSWORD_RULES**: regras para a a validação dos emails, por exemplo: minlength:4,maxlength:10,digits:1,special:1,caps:1

