# Locadora de Veículos - Nível 3

Página de locadora de veículos implementando funcionalidades avançadas de Rent a Car.

## Funcionalidades Implementadas

### Nível 1: CRUD Essencial
- **Reserva**: Formulário para clientes preencherem nome, e-mail e categoria, salvando no banco.
- **Gestão de Frota**: Cadastro e listagem de veículos.
- **Cancelamento**: Operadores podem excluir agendamentos.

### Nível 2: Controle de Acesso e Segurança
- **Login**: Sistema de autenticação com login e senha.
- **Gestão de Usuários**: CRUD de usuários com senhas criptografadas.
- **Proteção de Dados**: Senhas criptografadas com bcrypt.

### Nível 3: Lógica Avançada e Regras de Negócio
- **Regra de Disponibilidade**: Validação para impedir overbooking (veículo ocupado na data).
- **Cálculo Dinâmico**: Preço total estimado baseado na categoria e número de dias.
- **Status de Frota**: Atualização automática do status do veículo para "Reservado" após agendamento.
- **Relatório**: Estatísticas de categorias mais procuradas.

## Estrutura do Banco de Dados

### Tabelas
- `veiculos`: id, modelo, marca, placa, categoria, valor_diaria, status
- `agendamentos`: id, nome_cliente, email_cliente, veiculo_id, data_reserva
- `usuarios`: id, login, senha (criptografada), nivel_acesso

## Como Executar

1. Instalar dependências: `npm install`
2. Configurar banco MySQL e executar o script `db_locadora_new.sql`
3. Executar o servidor: `node index.js`
4. Acessar `http://localhost:3000` no navegador

## Páginas
- `index.html`: Página inicial com formulário de reserva
- `showroom.html`: Exibição de veículos com cálculo de preço
- `login.html`: Autenticação
- `usuarios.html`: Gestão de usuários
- `agendamentos.html`: Gestão de reservas
- `relatorio.html`: Relatório de categorias
- `estoque-veiculos.htm`: Listagem de veículos
- `cadastrarVeiculo.html`: Formulário de cadastro de veículos
