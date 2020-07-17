# Migration `20200712102323-init`

This migration has been generated by jackthomsonn at 7/12/2020, 10:23:23 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'CUSTOMER');

CREATE TYPE "Status" AS ENUM ('UNFULFILLED', 'FULFILLED');

CREATE TABLE "public"."User" (
"email" text  NOT NULL ,"id" SERIAL,"roles" "Roles"[]  ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."AddressDetails" (
"city" text  NOT NULL ,"country" text  NOT NULL ,"id" SERIAL,"line1" text  NOT NULL ,"line2" text   ,"postal_code" text  NOT NULL ,"state" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Order" (
"addressDetailsId" integer  NOT NULL ,"createdDate" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" SERIAL,"shareable" boolean  NOT NULL DEFAULT false,"status" "Status" NOT NULL ,"updatedDate" timestamp(3)   ,"userId" integer  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."LineItem" (
"id" SERIAL,"orderId" integer   ,"productId" integer  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."ProductOption" (
"id" SERIAL,"inventoryItemId" integer  NOT NULL ,"lineItemId" integer   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Product" (
"amountOfSweets" integer  NOT NULL ,"id" SERIAL,"name" text  NOT NULL ,"price" integer  NOT NULL ,"stripeProductReference" text  NOT NULL ,"weight" integer  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Inventory" (
"id" SERIAL,"name" text  NOT NULL ,"quantity" integer  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

CREATE UNIQUE INDEX "Order_addressDetailsId" ON "public"."Order"("addressDetailsId")

CREATE UNIQUE INDEX "Product.stripeProductReference" ON "public"."Product"("stripeProductReference")

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("addressDetailsId")REFERENCES "public"."AddressDetails"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."LineItem" ADD FOREIGN KEY ("productId")REFERENCES "public"."Product"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."LineItem" ADD FOREIGN KEY ("orderId")REFERENCES "public"."Order"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."ProductOption" ADD FOREIGN KEY ("inventoryItemId")REFERENCES "public"."Inventory"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."ProductOption" ADD FOREIGN KEY ("lineItemId")REFERENCES "public"."LineItem"("id") ON DELETE SET NULL  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200712102323-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,83 @@
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+enum Roles {
+  ADMIN
+  CUSTOMER
+}
+
+enum Status {
+  UNFULFILLED
+  FULFILLED
+}
+
+model User {
+  id    Int     @default(autoincrement()) @id
+  email String  @unique
+  order Order[]
+  roles Roles[]
+}
+
+model AddressDetails {
+  id          Int     @default(autoincrement()) @id
+  city        String
+  country     String
+  line1       String
+  line2       String?
+  postal_code String
+  state       String?
+  Order       Order?
+}
+
+model Order {
+  id               Int            @default(autoincrement()) @id
+  status           Status
+  createdDate      DateTime       @default(now())
+  updatedDate      DateTime?
+  lineItems        LineItem[]
+  addressDetails   AddressDetails @relation(fields: [addressDetailsId], references: [id])
+  addressDetailsId Int
+  user             User           @relation(fields: [userId], references: [id])
+  userId           Int
+  shareable        Boolean        @default(false)
+}
+
+model LineItem {
+  id             Int             @default(autoincrement()) @id
+  product        Product         @relation(fields: [productId], references: [id])
+  productId      Int
+  productOptions ProductOption[]
+  order          Order?          @relation(fields: [orderId], references: [id])
+  orderId        Int?
+}
+
+model ProductOption {
+  id              Int       @default(autoincrement()) @id
+  inventoryItem   Inventory @relation(fields: [inventoryItemId], references: [id])
+  inventoryItemId Int
+  lineItem        LineItem? @relation(fields: [lineItemId], references: [id])
+  lineItemId      Int?
+}
+
+model Product {
+  id                     Int        @default(autoincrement()) @id
+  name                   String
+  price                  Int
+  weight                 Int
+  amountOfSweets         Int
+  lineItem               LineItem[]
+  stripeProductReference String     @unique
+}
+
+model Inventory {
+  id            Int             @default(autoincrement()) @id
+  name          String
+  quantity      Int
+  ProductOption ProductOption[]
+}
```

