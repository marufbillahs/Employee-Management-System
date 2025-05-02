import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
  });

  async sendVerificationEmail(to: string, code: string) {
    await this.transporter.sendMail({
      from: 'nextphase@gmail.com',
      to,
      subject: 'Verify your email',
      text: `Your verification code is: ${code}`,
    });
  }
}
