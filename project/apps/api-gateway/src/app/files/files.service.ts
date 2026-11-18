import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import FormData from 'form-data';
import { getGatewayConfig } from '../app.config';

@Injectable()
export class FilesService {
  constructor(private readonly httpService: HttpService) {}

  public async upload(file: Express.Multer.File) {
    const filesUrl = getGatewayConfig().services.files;

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await lastValueFrom(
        this.httpService.post(`${filesUrl}/files`, formData, {
          headers: formData.getHeaders(),
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.data as Record<string, unknown>,
          axiosError.response.status,
        );
      }
      throw new InternalServerErrorException('Сервис files недоступен');
    }
  }

  public async getById(id: string) {
    const filesUrl = getGatewayConfig().services.files;
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${filesUrl}/files/${id}`, {
          responseType: 'stream',
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 404) {
        throw new NotFoundException('Файл не найден');
      }
      throw new InternalServerErrorException('Сервис files недоступен');
    }
  }
}
