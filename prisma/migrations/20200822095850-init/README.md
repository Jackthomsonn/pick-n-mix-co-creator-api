# Migration `20200822095850-init`

This migration has been generated by jackthomsonn at 8/22/2020, 9:58:50 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Order" ADD COLUMN "stripeAddressReference" SERIAL;

CREATE UNIQUE INDEX "Order.stripeAddressReference" ON "public"."Order"("stripeAddressReference")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200822095754-init..20200822095850-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -36,9 +36,9 @@
 }
 model Order {
   id                     Int            @default(autoincrement()) @id
-  stripeAddressReference Int            @default(1) @unique
+  stripeAddressReference Int            @default(autoincrement()) @unique
   status                 Status
   createdDate            DateTime       @default(now())
   updatedDate            DateTime?
   lineItems              LineItem[]
```


