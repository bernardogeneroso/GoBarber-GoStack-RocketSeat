# Recuperar password

**RF** | Requesitos funcionais

- O utilizador pode recuperar a sua password sendo notificando por e-mail;
- O utilizador pode receber um e-mail com instruções de recuperação de password;
- O utilizador pode alterar a sua password;

**RNF** | Requesitos não funcionais

- Utilizar o Mailtrap para testar os envios no ambiente de dev/desenvolvimento;
- Utilizar o Amazon SES para envios de produção;
- O envio de e-mail precisa de funcionar em segundo plano (background job);

**RN** | Regras de negócio

- O url/link enviado por email de recuperação de password, irá expirar em 2h;
- O utilizador precisa de confirmar a sua nova password;

# Atualização do perfil

**RF** | Requesitos funcionais

- O utilizador pode atualizar o seu nome, email e password

**RN** | Regras de negócio

- O utilizador não pode alterar o seu email para email já em uso;
- Para poder atualizar a sua password, o utilizador deve apresentar a sua senha antiga;
- Para poder atualizar a sua password, o utilizador precisa de confirmar a sua nova password;

# Painel do prestador

**RF** | Requesitos funcionais

- O utilizador pode ver os seus agendamentos de um dia específico;
- O prestador pode receber uma notificação sempre que houver um novo agendamento;
- O prestador pode visualizar as notificações não lidas;

**RNF** | Requesitos não funcionais

- Os agandamentos do prestador no dia devem ser armazenados na cache;
- As notiicações do prestador podem ser armazenadas no MongoDB;
- As notificações do prestador podem ser enviadas em tempo-real utilizando o Socket.IO;

**RN** | Regras de negócio

- A notificação irá ter um mecanismo/status de lida ou não-lida, de controlo para o prestador;


# Agendamento de serviços

**RF** | Requesitos funcionais

- O utilizador pode ver todos os prestadores de serviço;
- O utilizador pode verificar os dias de um mês com pelo menos um horário disponível de um prestador;
- O utilizador pode ver os horários disponíveis num dia específico de um prestador;
- O utilizador pode realizar um novo agendamento com um prestador;

**RNF** | Requesitos não funcionais

- A lista de prestador irá ser armazenada na cache;

**RN** | Regras de negócio

- Cada agendamento irá durar 1h;
- Os agendamentos iram estar disponíveis entre as 8h às 18h (Primeiro às 8h, último às 17h);
- O utilizador não pode agendar num horário ocupado;
- O utilizador não pode agendar num horário passado;
- O utilizador não pode agandar serviços consigo mesmo;
