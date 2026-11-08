import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail.controller.js';
import { MailService } from './mail.service.js';
import { PdfModule } from '../pdf/pdf.module.js'; 
import { PrismaModule } from '../prisma/prisma.modules.js'; 

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.MAIL_PORT) || 465,
          secure: process.env.MAIL_SECURE !== 'false',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: process.env.MAIL_FROM || `"BuySellCycle S.R.L." <${process.env.MAIL_USER}>`,
        },
      }),
    }),
    PdfModule,
    PrismaModule,
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}