import { Injectable } from '@nestjs/common';
import { MailerService } from 'nestjs-emailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  public async sendConfirmationEMail(notification: any) {
    const result = await this.mailerService.sendMail({
      to: 'elber.nava17@gmail.com',
      subject: 'testing bro',
      template: 'confirm-email',
    });

    return result;
  }
}
