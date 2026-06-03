-- =========================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) EN LAS TABLAS PÚBLICAS DE SUPABASE
-- =========================================================================
--
-- Ejecuta este script en el editor SQL de tu panel de Supabase para habilitar RLS
-- en todas las tablas expuestas en el esquema público. Esto resolverá las alertas 
-- de seguridad de Supabase Linter (rls_disabled_in_public).
--
-- NOTA: Dado que nuestra aplicación Next.js se conecta a PostgreSQL mediante Prisma
-- utilizando credenciales de superusuario/propietario ('postgres'), estas consultas
-- omiten por defecto las restricciones de RLS. Por lo tanto, habilitar RLS protegerá
-- el acceso público a través de las APIs REST de Supabase (PostgREST) sin afectar
-- al correcto funcionamiento de nuestra web.

-- 1. Tabla de Categorías de Productos
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

-- 2. Tabla de Productos del Catálogo
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

-- 3. Tabla de Pedidos B2B
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

-- 4. Tabla de Formularios de Contacto (Leads)
ALTER TABLE "Contact" ENABLE ROW LEVEL SECURITY;

-- 5. Tabla de Banners del Carrusel Hero
ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;

-- 6. Tabla de Líneas de Moda (Destiny Línea de Moda)
ALTER TABLE "FashionLine" ENABLE ROW LEVEL SECURITY;

-- 7. Nueva Tabla de Categorías Promocionales de Inicio
ALTER TABLE "PromoCategory" ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- Opcional: Si en algún momento necesitas que usuarios públicos lean datos
-- a través de la API cliente directa de Supabase (PostgREST), puedes definir
-- políticas permisivas de lectura (SELECT) como la siguiente:
--
-- CREATE POLICY "Permitir lectura pública" ON "Product" 
-- FOR SELECT USING (true);
-- =========================================================================
