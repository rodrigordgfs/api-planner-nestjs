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
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDTO: UpdateUserDTO) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    let imageUrl = user.image_url;

    if (updateUserDTO.image) {
      const fileName = `${id}.png`;

      const { data: image } = await this.supabase.storage
        .from('images')
        .download(fileName);

      if (image) {
        const { error: deleteError } = await this.supabase.storage
          .from('images')
          .remove([fileName]);

        if (deleteError) {
          throw deleteError;
        }
      }

      const base64Data = updateUserDTO.image.replace(
        /^data:image\/\w+;base64,/,
        '',
      );
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const { error: uploadError } = await this.supabase.storage
        .from('images')
        .upload(fileName, imageBuffer, {
          contentType: 'image/png',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: signedUrlData, error: signedUrlError } =
        await this.supabase.storage
          .from('images')
          .createSignedUrl(fileName, 60 * 60 * 24);

      if (signedUrlError) {
        throw signedUrlError;
      }

      imageUrl = signedUrlData.signedUrl;
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: updateUserDTO.name,
        image_url: imageUrl,
      },
    });
  }
}
