-- Historical records keep NULL: consent must never be fabricated by a backfill.
ALTER TABLE "Appointment" ADD COLUMN "consentVersion" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "consentAt" TIMESTAMP(3);
CREATE TABLE "LoginRateLimit" (
  "key" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL,
  "resetAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LoginRateLimit_pkey" PRIMARY KEY ("key")
);
