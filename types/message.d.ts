/*
 * @Author: Libra
 * @Date: 2023-06-06 13:50:13
 * @LastEditors: Libra
 * @Description:
 */
// message type
type MessageType = "ADMIN_CONNECT";

// message
interface Message {
  type: MessageType;
  data: any;
}
