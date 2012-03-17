(function(){

    var Request = Ext.MODS.request;
    var Upload = Ext.MODS.upload;

    var settingsModule = {};
    var settingsConfig = settingsModule.config = {
        title: '设置',
        id: 'tab3',
        html: '<h1>Downloads Card</h1>',
        cls: 'card3',
        iconCls: 'settings',
        defaults: {
            xtype: 'button'
        },
        items: [
            {
                text: '注销',
                handler: function(){

                    Request.jsonp({
                        type: 'logout',
                        callback: function( data ){

                            var mainStruct = Ext.UIS.mainStruct.instance;
                            var loginReg = Ext.UIS.loginReg.instance;

                            if( data.result ){

                                Ext.Msg.alert( '注销成功', '成功注销!', function(){

                                    mainStruct.hide();
                                    loginReg.show();
                                });
                            }
                            else {

                                Ext.Msg.alert( '注销失败', data.error );
                            }
                        }
                    }, true );
                }
            },
            {
                text: '上传照片',
                handler: function(){

                    navigator.camera.getPicture(onSuccess, onFail, {
                        quality: 50,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                    });

                    function onSuccess( imageURI ) {


                        Ext.Msg.alert( '图片获取成功，开始上传' );
                        Upload.upload( 'http://192.168.1.105:3000/imageupload', imageURI, {
                            success: function(){
                                Ext.Msg.alert( '成功', JSON.stringify( arguments ) );
                            },
                            error: function(){
                                Ext.Msg.alert( '失败', JSON.stringify( arguments ) );
                            }
                        });


                        /*
                        var imagePath = '/media/external/images/media/5';

                        // PhoneGap is ready
                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

                        function gotFS(fileSystem) {
                            alert( '获取filesystem成功' );
                            fileSystem.root.getFile( imagePath, null, gotFileEntry, fail);
                        }
                    
                        function gotFileEntry(fileEntry) {
                            alert( '获取fileEntry成功' );
                            fileEntry.file(gotFile, fail);
                        }

                        function gotFile(file){
                            alert( '获取file成功' );
                            alert( JSON.stringify( file ) );
                        }

                        function fail(evt) {
                            alert( '出错：' + JSON.stringify( evt ) );
                            console.log(evt.target.error.code);
                        }
                        */
                    }

                    function onFail(message) {
                        alert('Failed', message );
                    }
                }
            }
        ]
    };

    Ext.UIS.settings = settingsModule;
})();