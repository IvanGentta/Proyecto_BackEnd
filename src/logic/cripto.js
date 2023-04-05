import crypto from "crypto";
import { mySalt } from "../config/salt.js";

export function encryptID(id) {
  const newID = encrypt(`${id}`, mySalt);
  return newID;
}

export function encrypt(unencrypted, salt) {
  const encrypted = crypto
    .createHmac("sha256", salt)
    .update(unencrypted)
    .digest("hex");
  return encrypted;
}
