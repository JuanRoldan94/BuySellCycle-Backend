import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
    const cantidadProvincias = await prisma.provincia.count();

    if ( cantidadProvincias > 0 ) {
        return;
    } 
    console.log('Cargando Provincias y Localidades');

    const responseProvincias = await fetch('https://apis.datos.gob.ar/georef/api/provincias?max=24');
    const dataProvincias = await responseProvincias.json();

    for (const prov of dataProvincias.provincias){
        const provinciaCreada = await prisma.provincia.create({
            data: {
                nombre: prov.nombre,
            },
        });

        console.log(`Cargando localidades para: ${provinciaCreada.nombre} (ID Georef: ${prov.id})`);

        const responseLocalidades = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${prov.id}&max=5000`);

        const dataLocalidades = await responseLocalidades.json();

        const localidadesAInsertar = dataLocalidades.localidades.map((loc : any) => ({
            nombre: loc.nombre,
            provinciaId: provinciaCreada.id,
        }));

        if (localidadesAInsertar.length > 0){
            await prisma.localidad.createMany({
                data: localidadesAInsertar,
                skipDuplicates: true,
            });
            console.log(`${localidadesAInsertar.length} localidades insertadas.`);
        }
    }

    console.log(`Seed de Provincias y Localidades completo exitosamented`);
}
main()
    .catch((e) => {
        console.error('Error durante el see', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
