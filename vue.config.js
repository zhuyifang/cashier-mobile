const path = require('path')
module.exports = {
    devServer: {
        proxy: {
            '/web': {
                target: "http://cashier.qicuo.com",
                changeOrigin: true,
                secure: false,
                pathRewrite: {"^/web": "/web"}
            }
        },
    }
}
