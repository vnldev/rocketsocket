import { ObjectId } from 'mongoose';
import { injectable } from 'tsyringe';
import { ChatRoom } from '../schemas/ChatRoom';

@injectable()
class GetChatRoomByUsersService {
  async execute(usersIds: ObjectId[]): Promise<ChatRoom> {
    const chatRoom = await ChatRoom.findOne({
      idUsers: {
        $all: usersIds,
      },
    }).exec();

    return chatRoom;
  }
}

export { GetChatRoomByUsersService };
