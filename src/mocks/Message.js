export class Message {
  #user;
  #message;
  constructor({ user, message }) {
    this.#user = user;
    this.#message = message;
  }

  getMessage() {
    return {
      user: this.#user,
      message: this.#message,
    };
  }
}
