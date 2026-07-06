-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "curso" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "areas" TEXT NOT NULL DEFAULT '[]',
    "tipos" TEXT NOT NULL DEFAULT '[]',
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "urlOrigem" TEXT NOT NULL,
    "hashDedup" TEXT NOT NULL,
    "fonte" TEXT NOT NULL,
    "instituicao" TEXT,
    "prazoInscricao" DATETIME,
    "modalidade" TEXT,
    "local" TEXT,
    "valorBolsa" TEXT,
    "requisitos" TEXT NOT NULL DEFAULT '[]',
    "areas" TEXT NOT NULL DEFAULT '[]',
    "coletadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SavedOpportunity" (
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "salvoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "opportunityId"),
    CONSTRAINT "SavedOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedOpportunity_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_hashDedup_key" ON "Opportunity"("hashDedup");
