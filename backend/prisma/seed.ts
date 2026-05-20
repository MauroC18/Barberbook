import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.barbero.createMany({
    data: [
      { nombre: 'Carlos Mendoza', especialidad: 'Cortes clásicos y modernos', foto: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Carlos' },
      { nombre: 'Andrés Pérez', especialidad: 'Barba y afeitado tradicional', foto: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Andres' },
    ]
  })

  await prisma.servicio.createMany({
    data: [
      { nombre: 'Corte de cabello', duracion: 30, precio: 15000 },
      { nombre: 'Arreglo de barba', duracion: 20, precio: 10000 },
      { nombre: 'Corte + Barba', duracion: 50, precio: 22000 },
      { nombre: 'Afeitado clásico', duracion: 25, precio: 12000 },
    ]
  })

  console.log('✅ Datos iniciales creados')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())