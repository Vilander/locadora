-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26/02/2026 às 01:48
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
  `dataAg` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `diariaVeic` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD PRIMARY KEY (`idVeic`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `rac_agendamento`
--
ALTER TABLE `rac_agendamento`
  MODIFY `idAg` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `rac_usuarios`
--
ALTER TABLE `rac_usuarios`
  MODIFY `idUsu` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `rac_veiculos`
--
ALTER TABLE `rac_veiculos`
  MODIFY `idVeic` int(11) NOT NULL AUTO_INCREMENT;

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
