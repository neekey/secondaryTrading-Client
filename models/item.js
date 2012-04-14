(function(){

    // Set up a model to use in our Store
    Ext.regModel('Item', {
        fields: [ 'title', 'desc', 'price', 'latlng', 'address', 'pic1', 'pic2', 'pic3' ],
        validations: [
            {type: 'presence', name: 'title',message:"商品标题不能为空"},
            {type: 'presence', name: 'desc',message:"描述不能为空"},
//            {type: 'presence', name: 'latlng', message : "位置不能为空"},
            //todo 价格的格式还是数据类型添加验证
            {type: 'presence', name: 'price', message : "价格不能为空"}
        ]
    });

})();