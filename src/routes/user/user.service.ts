import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async find(email?: string) {
    return await this.repository.find(email);
  }

  async findById(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDTO: UpdateUserDTO) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    let imageUrl = user.image_url;

    if (updateUserDTO.image) {
      const fileName = `${id}.png`;

      const image = this.repository.getImage(fileName);

      if (image) {
        this.repository.removeImage(fileName);
      }

      const base64Data = updateUserDTO.image.replace(
        /^data:image\/\w+;base64,/,
        '',
      );
      const imageBuffer = Buffer.from(base64Data, 'base64');

      this.repository.uploadImage(fileName, imageBuffer);

      imageUrl = await this.repository.getSignedUrl(fileName);
    }

    return await this.repository.update(id, imageUrl, updateUserDTO);
  }
}
