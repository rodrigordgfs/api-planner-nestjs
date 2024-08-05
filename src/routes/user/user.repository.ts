import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user-dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async find(email?: string) {
    return await this.prisma.user.findMany({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, image_url: string, updateUserDTO: UpdateUserDTO) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: updateUserDTO.name,
        image_url,
      },
    });
  }

  async getImage(fileName: string) {
    const { data: image } = await this.supabase.storage
      .from('images')
      .download(fileName);

    return image;
  }

  async removeImage(fileName: string) {
    const { error: deleteError } = await this.supabase.storage
      .from('images')
      .remove([fileName]);

    if (deleteError) {
      throw new BadRequestException(deleteError);
    }
  }

  async uploadImage(fileName: string, imageBuffer: Buffer) {
    const { error: uploadError } = await this.supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
      });

    if (uploadError) {
      throw new BadRequestException(uploadError);
    }
  }

  async getSignedUrl(fileName: string) {
    const { data: signedUrlData, error: signedUrlError } =
      await this.supabase.storage
        .from('images')
        .createSignedUrl(fileName, 60 * 60 * 24);

    if (signedUrlError) {
      throw new BadRequestException(signedUrlError);
    }

    return signedUrlData.signedUrl;
  }
}
