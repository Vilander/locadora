-- phpMyAdmin SQL Dump
-- version 5.2.1
-- Host: 127.0.0.1:3306
-- Tempo de geração: 05/03/2026 às 22:20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

-- Desabilita a checagem de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

-- --------------------------------------------------------
-- APAGANDO AS TABELAS (Limpando lixos e antigas)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rac_agendamento`;

DROP TABLE IF EXISTS `agendamentos`;

DROP TABLE IF EXISTS `usuarios`;

DROP TABLE IF EXISTS `veiculos`;

-- Tabelas principais na ordem correta (filhas antes das mães)
DROP TABLE IF EXISTS `rac_agendamentos`;

DROP TABLE IF EXISTS `rac_usuarios`;

DROP TABLE IF EXISTS `rac_veiculos`;

DROP TABLE IF EXISTS `rac_categoria`;

DROP TABLE IF EXISTS `rac_niveis`;

-- --------------------------------------------------------
-- Estrutura para tabela `rac_categoria` (Sufixo: Cat)
-- --------------------------------------------------------
CREATE TABLE `rac_categoria` (
    `idCat` int(11) NOT NULL,
    `nomeCat` varchar(50) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `rac_categoria` (`idCat`, `nomeCat`)
VALUES (1, 'Básico'),
    (2, 'Família'),
    (3, 'Luxo');

-- --------------------------------------------------------
-- Estrutura para tabela `rac_niveis` (Sufixo: Niv)
-- --------------------------------------------------------
CREATE TABLE `rac_niveis` (
    `idNiv` int(11) NOT NULL,
    `nomeNiv` varchar(50) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `rac_niveis` (`idNiv`, `nomeNiv`)
VALUES (1, 'Administrador'),
    (2, 'Operador');

-- --------------------------------------------------------
-- Estrutura para tabela `rac_veiculos` (Sufixo: Vei)
-- --------------------------------------------------------
CREATE TABLE `rac_veiculos` (
    `idVei` int(11) NOT NULL,
    `modeloVei` varchar(50) NOT NULL,
    `marcaVei` varchar(50) NOT NULL,
    `placaVei` varchar(10) NOT NULL,
    `idCatVei` int(11) NOT NULL,
    `diariaVei` decimal(10, 2) NOT NULL,
    `statusVei` varchar(20) DEFAULT 'Disponível'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `rac_veiculos` (
        `idVei`,
        `modeloVei`,
        `marcaVei`,
        `placaVei`,
        `idCatVei`,
        `diariaVei`,
        `statusVei`
    )
VALUES (
        1,
        'Onix',
        'Chevrolet',
        'ABC1A23',
        1,
        99.00,
        'Disponível'
    ),
    (
        2,
        'Corolla',
        'Toyota',
        'DEF4B56',
        2,
        150.00,
        'Disponível'
    ),
    (
        3,
        'BMW 320i',
        'BMW',
        'GHI7C89',
        3,
        299.00,
        'Disponível'
    ),
    (
        4,
        'Fusca',
        'VW',
        'ABX1234',
        1,
        120.00,
        'Disponível'
    );

-- --------------------------------------------------------
-- Estrutura para tabela `rac_agendamentos` (Sufixo: Age)
-- --------------------------------------------------------
CREATE TABLE `rac_agendamentos` (
    `idAge` int(11) NOT NULL,
    `clienteAge` varchar(100) NOT NULL,
    `emailAge` varchar(100) NOT NULL,
    `veiculoAge` int(11) NOT NULL,
    `dataAge` date NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `rac_agendamentos` (
        `idAge`,
        `clienteAge`,
        `emailAge`,
        `veiculoAge`,
        `dataAge`
    )
VALUES (
        1,
        'Carlos Silva',
        'carlos@email.com',
        1,
        '2026-03-10'
    ),
    (
        2,
        'Fernanda Souza',
        'fernanda@email.com',
        2,
        '2026-03-12'
    );

-- --------------------------------------------------------
-- Estrutura para tabela `rac_usuarios` (Sufixo: Usu)
-- --------------------------------------------------------
CREATE TABLE `rac_usuarios` (
    `idUsu` int(11) NOT NULL,
    `loginUsu` varchar(50) NOT NULL,
    `senhaUsu` varchar(255) NOT NULL,
    `nivelAcessoUsu` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `rac_usuarios` (
        `idUsu`,
        `loginUsu`,
        `senhaUsu`,
        `nivelAcessoUsu`
    )
VALUES (
        1,
        'admin',
        '$2a$12$NWX7UKteZWlEhqVypk0jV.Pm4QKeQO6puGe.RMZqTRxpxmpbCNEBO',
        1
    ),
    (
        2,
        'operador',
        '$2b$10$f8n4xcCr9..LxMUqVtku1OrUX8GgPkdCXwc3qsrr54XZkIaMCATI2',
        2
    );

-- --------------------------------------------------------
-- Índices para tabelas despejadas
-- --------------------------------------------------------
ALTER TABLE `rac_categoria` ADD PRIMARY KEY (`idCat`);

ALTER TABLE `rac_niveis` ADD PRIMARY KEY (`idNiv`);

ALTER TABLE `rac_veiculos`
ADD PRIMARY KEY (`idVei`),
ADD UNIQUE KEY `placaVei` (`placaVei`),
ADD KEY `fk_vei_cat` (`idCatVei`);

ALTER TABLE `rac_agendamentos`
ADD PRIMARY KEY (`idAge`),
ADD KEY `fk_age_vei` (`veiculoAge`);

ALTER TABLE `rac_usuarios`
ADD PRIMARY KEY (`idUsu`),
ADD UNIQUE KEY `loginUsu` (`loginUsu`),
ADD KEY `fk_usu_niv` (`nivelAcessoUsu`);

-- --------------------------------------------------------
-- AUTO_INCREMENT para tabelas despejadas
-- --------------------------------------------------------
ALTER TABLE `rac_categoria`
MODIFY `idCat` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 4;

ALTER TABLE `rac_niveis`
MODIFY `idNiv` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 3;

ALTER TABLE `rac_veiculos`
MODIFY `idVei` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

ALTER TABLE `rac_agendamentos`
MODIFY `idAge` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 3;

ALTER TABLE `rac_usuarios`
MODIFY `idUsu` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 3;

-- --------------------------------------------------------
-- Restrições para tabelas despejadas
-- --------------------------------------------------------
ALTER TABLE `rac_veiculos`
ADD CONSTRAINT `fk_veiculos_categoria` FOREIGN KEY (`idCatVei`) REFERENCES `rac_categoria` (`idCat`) ON UPDATE CASCADE;

ALTER TABLE `rac_agendamentos`
ADD CONSTRAINT `fk_agendamentos_veiculos` FOREIGN KEY (`veiculoAge`) REFERENCES `rac_veiculos` (`idVei`) ON UPDATE CASCADE;

ALTER TABLE `rac_usuarios`
ADD CONSTRAINT `fk_usuarios_niveis` FOREIGN KEY (`nivelAcessoUsu`) REFERENCES `rac_niveis` (`idNiv`) ON UPDATE CASCADE;

-- Reabilita a checagem de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;