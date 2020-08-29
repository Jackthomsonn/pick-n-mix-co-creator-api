# Migration `20200822122351-init`

This migration has been generated by jackthomsonn at 8/22/2020, 12:23:51 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Order" DROP COLUMN "shareable";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200822100129-init..20200822122351-init
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
@@ -45,9 +45,8 @@
   addressDetails         AddressDetails @relation(fields: [addressDetailsId], references: [id])
   addressDetailsId       Int
   user                   User           @relation(fields: [userId], references: [id])
   userId                 Int
-  shareable              Boolean        @default(false)
 }
 model LineItem {
   id             Int             @default(autoincrement()) @id
```

