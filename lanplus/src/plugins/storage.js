/*
 * @Description: storage工具类，简单的封装
 * @Version: 2.0
 * @Autor: Gordon
 * @Date: 2020-03-12 19:24:29
 * @LastEditors: Gordon
 * @LastEditTime: 2020-04-03 10:36:17
 */

var Storage = {
    // ==================sessionsTorage设置缓存================
    // 设置缓存
    sessionSet: function(name, data) {
        sessionStorage.removeItem(name)
        sessionStorage.setItem(name, JSON.stringify(data))
    },
    // 获取缓存
    sessionGet: function(name) {
        return JSON.parse(sessionStorage.getItem(name))
    },
    // 清除缓存
    sessionRemove: function(name) {
        sessionStorage.removeItem(name)
    },
    // ==================localStorage设置缓存==================
    // 设置缓存
    localSet: function(name, data) {
        localStorage.removeItem(name)
        localStorage.setItem(name, JSON.stringify(data))
    },
    // 获取缓存
    localGet: function(name) {
        if (!localStorage.getItem(name) || (JSON.stringify(localStorage.getItem(name)) === '"undefined"')) {
            return null
        }
        return JSON.parse(localStorage.getItem(name))
    },
    // 清除缓存
    localRemove: function(name) {
        localStorage.removeItem(name)
    }

}

export default Storage