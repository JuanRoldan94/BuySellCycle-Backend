import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.modules.js';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './modulos/catalogo/productos/productos.module.js';
import { MarcasModule } from './modulos/catalogo/marcas/marcas.module.js';
import { DepositosModule } from './modulos/inventario/depositos/depositos.module.js';
import { UsuariosModule } from './modulos/administracion/usuarios/usuarios.module.js';
import { SucursalesModule } from './modulos/administracion/sucursales/sucursales.module.js';
import { ClientesModule } from './modulos/ventas/clientes/clientes.module.js';
import { ProveedoresModule } from './modulos/inventario/proveedores/proveedores.module.js';
import { ProvinciasModule } from './modulos/ubicaciones/provincias/provincias.module.js';
import { LocalidadesModule } from './modulos/ubicaciones/localidades/localidades.module.js';
import { CategoriasModule } from './modulos/catalogo/categorias/categorias.module.js';
import { StockModule } from './modulos/inventario/stock/stock.module.js';
import { PresupuestosModule } from './modulos/presupuestos/presupuestos.module.js';
import { UbicacionesController } from './modulos/administracion/ubicaciones.controller.js';
import { FirebaseModule } from './firebase/firebase.module.js';
import { ErroresModule } from './errores/errores.module.js';
import { ArchivosModule } from './archivos/archivos.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PrismaModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'buysellcycle-backend',
    }),
    ProductosModule,
    MarcasModule,
    DepositosModule,
    UsuariosModule,
    SucursalesModule,
    ClientesModule,
    ProveedoresModule,
    ProvinciasModule,
    LocalidadesModule,
    CategoriasModule,
    StockModule,
    PresupuestosModule,
    FirebaseModule,
    ErroresModule,
    ArchivosModule,
  ],
  controllers: [AppController, UbicacionesController],
  providers: [AppService],
})
export class AppModule {}
