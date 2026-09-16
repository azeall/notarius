-- Baseline of the existing schema. On an existing deployment, verify its schema
-- matches, then mark this migration applied with prisma migrate resolve.
CREATE TABLE "Appointment" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "service" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "duration" INTEGER NOT NULL DEFAULT 30,
  "status" TEXT NOT NULL DEFAULT 'active',
  "ip" TEXT NOT NULL DEFAULT '',
  "staffId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Appointment_date_idx" ON "Appointment"("date");
CREATE INDEX "Appointment_staffId_idx" ON "Appointment"("staffId");
