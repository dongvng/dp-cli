import { HttpException } from '@nestjs/common';

export interface ILog {
  endpoint: string;
  method: string;
  ipAddress: string | string[];
  message?: string;
  data?: Record<string, unknown>;
  error?: HttpException;
}
