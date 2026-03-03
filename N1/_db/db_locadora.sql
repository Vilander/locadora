-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 28/02/2026 às 01:06
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_locadora`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `rac_agendamento`
--

CREATE TABLE `rac_agendamento` (
  `idAg` int(11) NOT NULL,
  `clienteAg` varchar(100) NOT NULL,
  `emailAg` varchar(30) NOT NULL,
  `veiculoAg` int(11) NOT NULL,
  `dataAg` datetime NOT NULL,
  `status` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `rac_agendamento`
--

INSERT INTO `rac_agendamento` (`idAg`, `clienteAg`, `emailAg`, `veiculoAg`, `dataAg`, `status`) VALUES
(1, 'Carlos Silva', 'carlos@email.com', 1, '2026-03-10 09:00:00', 1),
(2, 'Fernanda Souza', 'fernanda@email.com', 2, '2026-03-12 14:30:00', 1),
(3, 'Ricardo Lima', 'ricardo@email.com', 3, '2026-03-15 08:00:00', 1),
(4, 'VILANDER ADALBERTO DA SILVA COSTA', 'vilander.costa@gmail.com', 2, '2026-02-27 20:10:36', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `rac_usuarios`
--

CREATE TABLE `rac_usuarios` (
  `idUsu` int(11) NOT NULL,
  `nomeUsu` varchar(100) NOT NULL,
  `loginUsu` varchar(50) NOT NULL,
  `senhaUsu` varchar(255) NOT NULL,
  `nivelAcessoUsu` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `rac_usuarios`
--

INSERT INTO `rac_usuarios` (`idUsu`, `nomeUsu`, `loginUsu`, `senhaUsu`, `nivelAcessoUsu`) VALUES
(1, 'Administrador', 'admin', '$2b$10$hashadminexemplo', 1),
(2, 'Funcionário João', 'joao', '$2b$10$hashjoaoexemplo', 2),
(3, 'Funcionária Maria', 'maria', '$2b$10$hashmariaexemplo', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `rac_veiculos`
--

CREATE TABLE `rac_veiculos` (
  `idVeic` int(11) NOT NULL,
  `modeloVeic` varchar(50) NOT NULL,
  `marcaVeic` varchar(50) NOT NULL,
  `placaVeic` varchar(10) NOT NULL,
  `categoriaVeic` varchar(50) NOT NULL,
  `diariaVeic` decimal(10,0) NOT NULL,
  `fotoVeic` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `rac_veiculos`
--

INSERT INTO `rac_veiculos` (`idVeic`, `modeloVeic`, `marcaVeic`, `placaVeic`, `categoriaVeic`, `diariaVeic`, `fotoVeic`) VALUES
(1, 'Onix', 'Chevrolet', 'ABC1A23', 'Básico', 120, 'https://images.unsplash.com/photo-1459603677915-a62079ffd002?q=80&w=1234&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(2, 'Corolla', 'Toyota', 'DEF4B56', 'Família', 220, 'https://images.unsplash.com/photo-1459603677915-a62079ffd002?q=80&w=1234&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
(3, 'BMW 320i', 'BMW', 'GHI7C89', 'Luxo', 450, 'https://images.unsplash.com/photo-1459603677915-a62079ffd002?q=80&w=1234&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `rac_agendamento`
--
ALTER TABLE `rac_agendamento`
  ADD PRIMARY KEY (`idAg`),
  ADD KEY `fk_agendamento_veiculo` (`veiculoAg`);

--
-- Índices de tabela `rac_usuarios`
--
ALTER TABLE `rac_usuarios`
  ADD PRIMARY KEY (`idUsu`);

--
-- Índices de tabela `rac_veiculos`
--
ALTER TABLE `rac_veiculos`
  ADD PRIMARY KEY (`idVeic`),
  ADD UNIQUE KEY `placaVeic` (`placaVeic`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `rac_agendamento`
--
ALTER TABLE `rac_agendamento`
  MODIFY `idAg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `rac_usuarios`
--
ALTER TABLE `rac_usuarios`
  MODIFY `idUsu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `rac_veiculos`
--
ALTER TABLE `rac_veiculos`
  MODIFY `idVeic` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `rac_agendamento`
--
ALTER TABLE `rac_agendamento`
  ADD CONSTRAINT `fk_agendamento_veiculo` FOREIGN KEY (`veiculoAg`) REFERENCES `rac_veiculos` (`idVeic`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
