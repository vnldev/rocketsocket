import { io } from '../http';
import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';
import { container } from 'tsyringe';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
import { GetUserBySocketIdService } from '../services/GetUserBySocketIdService';
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService';
import { CreateMessageService } from '../services/CreateMessageService';
import { GetMessagesByChatRoomService } from '../services/GetMessagesByChatRoomService';
import { GetChatRoomByIdService } from '../services/GetChatRoomByIdService';

io.on('connect', (socket) => {
  socket.on('start', async (data) => {
    const { email, avatar, name } = data;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email,
      avatar,
      name,
      socket_id: socket.id,
    });

    socket.broadcast.emit('new_users', user);
  });

  socket.on('get_users', async (callback) => {
    const getAllUsersService = container.resolve(GetAllUsersService);

    const users = await getAllUsersService.execute();

    callback(users);
  });

  socket.on('start_chat', async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);

    const getUserBySocketIdService = container.resolve(
      GetUserBySocketIdService
    );

    const getChatRoomByUsersService = container.resolve(
      GetChatRoomByUsersService
    );

    const getMessagesByChatRoomService = container.resolve(
      GetMessagesByChatRoomService
    );

    const { idUser } = data;
    const loggedUser = await getUserBySocketIdService.execute(socket.id);

    let room = await getChatRoomByUsersService.execute([
      idUser,
      loggedUser._id,
    ]);

    if (!room) {
      room = await createChatRoomService.execute([loggedUser, idUser]);
    }

    socket.join(room.idChatRoom);

    const messages = await getMessagesByChatRoomService.execute(
      room.idChatRoom
    );

    callback({ room, messages });
  });

  socket.on('message', async (data) => {
    const getUserBySocketIdService = container.resolve(
      GetUserBySocketIdService
    );

    const createMessageService = container.resolve(CreateMessageService);

    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);

    const user = await getUserBySocketIdService.execute(socket.id);

    const message = await createMessageService.execute({
      to: user._id,
      text: data.message,
      roomId: data.idChatRoom,
    });

    io.to(data.idChatRoom).emit('message', { message, user });

    const room = await getChatRoomByIdService.execute(data.idChatRoom);

    const userTo = room.idUsers.find(
      (response) => String(response._id) != user._id
    );

    console.log(userTo);

    io.to(userTo.socket_id).emit('notification', {
      newMessage: true,
      roomId: data.idChatRoom,
      from: user,
    });
  });
});
