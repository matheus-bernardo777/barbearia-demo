const { PrismaClient } = require('@prisma/client'); const bcrypt = require('bcryptjs'); const prisma = new PrismaClient();
async function main(){ const adminPass=await bcrypt.hash('admin123',10); const barberPass=await bcrypt.hash('barber123',10); const clientPass=await bcrypt.hash('cliente123',10);
const admin=await prisma.user.upsert({ where:{email:'admin@demo.com'}, update:{}, create:{ name:'Admin Demo', email:'admin@demo.com', password:adminPass, role:'ADMIN', phone:'55999999999' } });
const barberUser=await prisma.user.upsert({ where:{email:'barbeiro@demo.com'}, update:{}, create:{ name:'Barbeiro Joao', email:'barbeiro@demo.com', password:barberPass, role:'BARBER', phone:'55988888888' } });
const customer=await prisma.user.upsert({ where:{email:'cliente@demo.com'}, update:{}, create:{ name:'Cliente Maria', email:'cliente@demo.com', password:clientPass, role:'CUSTOMER', phone:'55977777777' } });
const barber=await prisma.barber.upsert({ where:{ userId:barberUser.id }, update:{}, create:{ userId:barberUser.id, bio:'Especialista em corte e barba', photoUrl:'' } });
const s1=await prisma.service.upsert({ where:{id:1}, update:{}, create:{ name:'Corte Masculino', durationMin:40, priceCents:4500, bufferMin:10 } });
const s2=await prisma.service.upsert({ where:{id:2}, update:{}, create:{ name:'Barba Completa', durationMin:30, priceCents:3500, bufferMin:10 } });
const s3=await prisma.service.upsert({ where:{id:3}, update:{}, create:{ name:'Corte + Barba', durationMin:70, priceCents:7500, bufferMin:10 } });
for (const s of [s1,s2,s3]) { await prisma.barberService.upsert({ where:{ barberId_serviceId:{ barberId:barber.id, serviceId:s.id }}, update:{}, create:{ barberId:barber.id, serviceId:s.id } }); }
const hours=[ {weekday:1,openMin:540,closeMin:1140}, {weekday:2,openMin:540,closeMin:1140}, {weekday:3,openMin:540,closeMin:1140}, {weekday:4,openMin:540,closeMin:1140}, {weekday:5,openMin:540,closeMin:1140}, {weekday:6,openMin:540,closeMin:1020} ];
for(const h of hours) await prisma.businessHour.create({ data:h }); console.log('Seed done'); }
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());