import io from 'socket.io-client';

class SocketService {
  constructor() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;

    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  joinRoom(roomId) {
    this.socket.emit('joinRoom', roomId);
  }

  onDraw(callback) {
    this.socket.on('draw', callback);
  }

  onLoadDrawing(callback) {
    this.socket.on('loadDrawing', callback);
  }

  emitDraw(data) {
    this.socket.emit('draw', data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default new SocketService();
