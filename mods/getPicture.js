/**
 * 获取图片模块
 */
(function(){

    var Mods = App.mods;
    /**
     *
     * @param config
     *      ifCamera: 是否拍照上传
     *      quality: 图片质量
     *      ifData: 是否以Data_URI的形式返回图片数据
     *      success: 图片获取成功回调
     *      error: 图片获取失败回调
     */
    Mods.getPicture = function( config ){

        var Camera = navigator.camera;
        var ifCamera = config.ifCamera || false;
        var quality = config.quality || 30;
        var targetWidth = config.targetWidth || 500;
        var targetHeight = config.targetHeight || 500;
        var ifData = config.ifData || false;
        var onSuccess = config.success || Ext.emptyFn;
        var onError = config.success || Ext.emptyFn;

        Camera.getPicture( onSuccess, onError, {
            quality: quality,
            destinationType: ifData ? Camera.DestinationType.DATA_URL : Camera.DestinationType.FILE_URI,
            sourceType: ifCamera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: targetWidth,
            targetHeight: targetHeight
        });
    };
})();