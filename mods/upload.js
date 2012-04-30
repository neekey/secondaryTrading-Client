(function(){

    var FILE_KEY = 'image';
    var Mods = App.mods;

    Mods.upload = {

        /**
         * 进行图片上传
         * @param {String} url 图片上传地址
         * @param {String} imageURI 图片本地URI
         * @param {Object} op {
         *  success
         *  error
         *  params      和图片一起发送的其他字段
         * }
         */
        upload: function( url, imageURI, op ){

            var options = new FileUploadOptions();
            var Auth = Ext.MODS.auth;
            var params = op.params || {};
            var ft = new FileTransfer();

            options.fileKey= FILE_KEY;
            options.fileName= imageURI.substr( imageURI.lastIndexOf('/') + 1 );
            options.mimeType= "image/png";

            // 附加权限验证字段
            Auth.attach( params );

            options.params = params;

            ft.upload( imageURI, url, op.success, op.error, options );
        }
    }
})();