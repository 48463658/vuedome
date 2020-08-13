/*
 * @Description: 重置message，防止重复点击重复弹出message弹框
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-04-01 20:17:39
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-01 20:20:06
 */

import { Message } from 'element-ui'
let messageInstance = null
const resetMessage = (options) => {
    if (messageInstance) {
        messageInstance.close()
    }
    messageInstance = Message(options)
};
['error', 'success', 'info', 'warning'].forEach(type => {
    resetMessage[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            }
        }
        options.type = type
        return resetMessage(options)
    }
})
export const message = resetMessage