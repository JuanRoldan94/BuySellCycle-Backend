import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail.controller.js';
import { MailService } from './mail.service.js';
import { PdfModule } from '../pdf/pdf.module.js'; 
import { PrismaModule } from '../prisma/prisma.modules.js'; 

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'juan.m.roldan94@gmail.com',
          pass: 'puvtjxahzohmioak', // (Recordá a futuro pasar esto a un .env)
        },
      },
      defaults: {
        from: ' "BuySellCycle S.R.L. " <juan.m.roldan94@gmail.com>',
      },
    }),
    PdfModule,
    PrismaModule,
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}