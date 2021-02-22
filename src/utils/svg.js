// 获取当前svg目录所有为.svg结尾的文件能被 require 的文件
const req = require.context("@/assets/icon", false, /\.svg$/); //false --> 不再找svg目录子目录的文件

// 解析获取的.svg文件的文件名称并返回
const requireAll = (requireContext) => {
    //Object.keys() 把对象的key取出来作为对象数组里对象的key的值
    return requireContext.keys().map(requireContext);
};
// 加载目录下的所有 svg 文件
requireAll(req);