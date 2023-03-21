import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MaileService {
  constructor(private readonly mailerService: MailerService) {}

  async mail(email) {
    const link = 'http://localhost:3000/users/login';

    this.mailerService.sendMail({
      to: email,
      from: 'kohila18.96@gmail.com',
      subject: 'registeration sucessfuly',
      text: link + 'please login ',
    });
  }
}
