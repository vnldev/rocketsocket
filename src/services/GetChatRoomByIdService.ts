import { ChatRoom } from '../schemas/ChatRoom';

class GetChatRoomByIdService {
  async execute(idChatRoom: string): Promise<ChatRoom> {
    const chatroom = await ChatRoom.findOne({ idChatRoom })
      .populate('idUsers')
      .exec();

    return chatroom;
  }
}

export { GetChatRoomByIdService };
