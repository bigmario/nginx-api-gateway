-- CreateEnum
CREATE TYPE "identityPrefix" AS ENUM ('J', 'G', 'V', 'E', 'C');

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "lastName" VARCHAR(512) NOT NULL,
    "identityCard" VARCHAR(32) NOT NULL,
    "identityCardprefix" "identityPrefix" NOT NULL,
    "primaryPhone" VARCHAR(32) NOT NULL,
    "secondaryPhone" VARCHAR(32),
    "imgUrl" VARCHAR(5140),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "sessionId" BIGINT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "password" VARCHAR(2048) NOT NULL,
    "lastAccess" TIMESTAMP(3),
    "timesLoggedIn" INTEGER NOT NULL DEFAULT 0,
    "typeId" SMALLINT,
    "rolId" SMALLINT,
    "statusId" SMALLINT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_type" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(512),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "session_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_rol" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(1024),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "typeId" SMALLINT NOT NULL,

    CONSTRAINT "session_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_status" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(1024),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "session_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sessionId_key" ON "user"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "session_email_key" ON "session"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "session_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "session_rol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "session_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_rol" ADD CONSTRAINT "session_rol_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "session_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
