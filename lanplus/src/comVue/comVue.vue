<!--
 * @Author: Gordon
 * @Date: 2020-03-11 10:26:01
 * @LastEditTime: 2020-03-24 16:55:36
 * @LastEditors: Gordon
 -->
<script>
// const version = '0.1.8.032301'
export default {
  // version
}

// eslint-disable-next-line no-extend-native
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// eslint-disable-next-line no-extend-native
Array.prototype.contains = function(obj) {
  var i = this.length
  while (i--) {
    if (this[i] === obj) {
      return i // 返回的这个 i 就是元素的索引下标，
    }
  }
  return false
}
</script>
