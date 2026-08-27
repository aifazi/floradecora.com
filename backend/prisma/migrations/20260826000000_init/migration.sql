-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('new', 'contacted', 'won', 'lost');

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(30),
    "project_type" VARCHAR(80),
    "message" TEXT NOT NULL,
    "ip" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ContactStatus" NOT NULL DEFAULT 'new',

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "ip" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "type" VARCHAR(80) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "location" VARCHAR(120) NOT NULL,
    "area" VARCHAR(80) NOT NULL,
    "client" VARCHAR(120) NOT NULL,
    "img" VARCHAR(500) NOT NULL,
    "gallery" TEXT[],
    "description" TEXT NOT NULL,
    "services" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "built" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contacts_status_created_at_idx" ON "contacts"("status", "created_at");

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "contacts_created_at_idx" ON "contacts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_email_key" ON "newsletters"("email");

-- CreateIndex
CREATE INDEX "newsletters_created_at_idx" ON "newsletters"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_featured_built_idx" ON "projects"("featured", "built");

-- CreateIndex
CREATE INDEX "projects_created_at_idx" ON "projects"("created_at");

