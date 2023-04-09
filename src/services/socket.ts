import { io, Socket } from "socket.io-client";

const socket: Socket = io("ws://localhost:8000");

export const onLoginSuccess = (token: string) => {
  socket.io.opts.query = { token: token };

  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;

// export default class SocketClient {
//   url: string;
//   socket: Socket | null;
//   dispatch: any;

//   constructor(url: string, dispatchFunction: any) {
//     this.url = url;
//     this.socket = null;
//     this.dispatch = dispatchFunction;
//   }

//   connect(): Promise<boolean | Error> {
//     this.socket = io(this.url, {
//       reconnectionDelayMax: 10000,
//       transports: ["websocket"],
//     });

//     return new Promise((resolve, reject) => {
//       this.socket?.on("connect", () => {
//         resolve(true);
//       });
//       this.socket?.on("connect_error", (error) => reject(error));
//     });
//   }

//   disconnect() {
//     this.socket?.disconnect();
//     this.socket = null;
//   }

//   emit(event: string, data: any) {
//     return new Promise((resolve, reject) => {
//       if (!this.socket) return reject("No socket connection.");

//       return this.socket.emit(event, data, (response: any) => {
//         // Response is the optional callback that you can use with socket.io in every request. See 1 above.
//         if (response.error) {
//           console.error(response.error);
//           return reject(response.error);
//         }

//         return resolve(true);
//       });
//     });
//   }

//   on(event: string) {
//     return new Promise((resolve, reject) => {
//       if (!this.socket) return reject("No socket connection.");

//       this.socket.on(event, (d: any) => {
//         this.dispatch({ action: event, data: d });
//       });
//       resolve(true);
//     });
//   }

//   off(event: string) {
//     return new Promise((resolve, reject) => {
//       if (!this.socket) return reject("No socket connection.");

//       this.socket.off(event);
//       resolve(true);
//     });
//   }
// }
