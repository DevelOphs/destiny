import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando el sembrado de base de datos (Seed)...");

  const adminEmail = "admin@destiny.com";
  const tempPassword = "AdminDestiny2026*";

  // Verificar si ya existe un administrador
  const existingAdmin = await prisma.employee.findFirst({
    where: {
      OR: [
        { email: adminEmail },
        { role: "ADMIN" }
      ]
    }
  });

  if (!existingAdmin) {
    console.log("No se encontró usuario administrador. Registrando administrador 'Día Cero'...");
    
    // Generar hash de contraseña
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const admin = await prisma.employee.create({
      data: {
        name: "Admin Destiny",
        email: adminEmail,
        passwordHash: passwordHash,
        code: "MASTER0",
        commissionPercentage: 0.0,
        role: "ADMIN",
        status: 1
      }
    });

    console.log(`¡Administrador creado con éxito!`);
    console.log(`Correo: ${admin.email}`);
    console.log(`Código: ${admin.code}`);
    console.log(`Rol: ${admin.role}`);
  } else {
    console.log("El usuario administrador ya existe en la base de datos. Saltando paso de creación.");
  }
}

main()
  .catch((e) => {
    console.error("Error durante la ejecución del seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
