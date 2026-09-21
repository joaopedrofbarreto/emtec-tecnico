-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "valorBase" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regiao" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "fatorPreco" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Regiao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaixaUtilizacao" (
    "id" SERIAL NOT NULL,
    "quantidadeInicial" INTEGER NOT NULL,
    "quantidadeFinal" INTEGER,
    "acrescimo" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "FaixaUtilizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regra" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "prioridade" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "condicoes" JSONB NOT NULL,
    "acao" JSONB NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Regra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Servico_codigo_key" ON "Servico"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_codigo_key" ON "Categoria"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Regiao_codigo_key" ON "Regiao"("codigo");
