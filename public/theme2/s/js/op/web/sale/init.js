/**
 * Created by daqi.jin on 15/5/14.
 */
(function () {
    var sheetList = G_SheetList;

    var redirect = function () {
        var isFirst = true;
        var url = "/sale/init";

        var val = $("#select-type").val();
        if (val) {
            if (isFirst) {
                url += "?";
                isFirst = false;
            } else {
                url += "&";
            }
            url += "thisType=" + val;
        }

        val = $("#begin-date").val();

        if (val) {
            if (isFirst) {
                url += "?";
                isFirst = false;
            } else {
                url += "&";
            }
            url += "beginDate=" + val;
        }

        val = $("#select-city").val();

        if (val) {
            if (isFirst) {
                url += "?";
                isFirst = false;
            } else {
                url += "&";
            }
            url += "thisCity=" + val;
        }

        window.location.href = url;
    };

    function initSheet() {
        for (var i = 0; i < sheetList.length; i++) {
            createSheet(sheetList[i]);
        }
    }

    var mainTable = $('.J_sheetTable > tbody');

    function createSheet(item) {
        var summary = $('<tr class="J_sheetTopic" data-id="' + item.period + '">\n' +
        '                        <td>' + item.period + '</td>\n' +
        '                <td>' + item.time + '</td>\n' +
        '                <td>' + item.number + '</td>\n' +
        '                <td><input type="text" class="J_itemOrder ts-ordertxt" value="' + item.orderNumber + '" readonly="readonly"/></td>\n' +
        '                <td><a href="#" class="J_openList">展开</a></td>\n' +
        '                </tr>');
        var detail = $('<tr style="display: none;" class="J_sheetCon" data-id="' + item.period + '">\n' +
        '                        <th></th>\n' +
        '                <td colspan="4"><table>\n' +
        '                        <colgroup>\n' +
        '                        <col width="10%"/>\n'+
        '                        <col width="25%"/>\n'+
        '                        <col width="10%"/>\n'+
        '                        <col width="10%"/>\n'+
        '                        <col width="10%"/>\n'+
        '                        <col width="10%"/>\n'+
        '                        <col width="10%"/>\n'+
        '                        <col width="15%"/>\n'+
        '                        </colgroup>\n' +
        '                <thead>\n' +
        '                <tr>\n' +
        '                <td colspan="7"><div class="sheet-operate">\n' +
        '                        <div class="sheet-operate-overlay">正在处理...</div>\n' +
        '                <input type="text" class="J_shopId">\n' +
        '                        <button class="J_btnAddSheet">添加商户</button>\n' +
        '                <button class="J_btnBatchAdd">批量导入</button>\n' +
        '                <button class="J_btnBatchDel">批量删除</button>\n' +
        '                </div></td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '               <td><input type="checkbox">Product Id</td>\n' +
        '               <td>产品名称</td>\n' +
        '                <td>团购价</td>\n'+
        '                <td>原价</td>\n'+
        '                <td>库存</td>\n'+
        '                <td>立减标签</td>' +
        '                <td>手动排序</td>\n'+
        '                <td>操作</td>\n'+
        '                </tr>\n' +
        '                </thead>\n' +
        '                <tbody>\n' +
        '                </tbody>\n' +
        '                </table></td></tr>');
        summary.find('.J_openList').on('click', function (e) {
            e.preventDefault();
            $('.J_sheetCon').hide();
            summary.next().show();
        });

        mainTable.append(summary).append(detail);

        detail.find('.J_btnAddSheet').on('click', function (e) {
            e.preventDefault();
            var thisType;
            sheetList.forEach(function (item) {
                if (item['period'] == detail.data('id')) {
                    thisType = item['type'];
                }
            });
            loadingSheets(detail.data('id'), detail.find('.J_shopId').val(), thisType);
        });
        detail.find('.J_btnBatchAdd').on('click', function (e) {
            e.preventDefault();
            batchAdd(detail.data('id'));
        });
        detail.find('.J_btnBatchDel').on('click', function (e) {
            e.preventDefault();
            batchDel(detail.data('id'));
        });

        var $checkbox = detail.find('thead input[type="checkbox"]');
        $checkbox.on('change', function (e) {
            if ($checkbox.is(':checked')) {
                $checkbox.prop("checked", 'true');
            } else {
                $checkbox.removeAttr("checked");
            }
        });

        var list = item.sheets || [];
        for (var i = 0; i < list.length; i++) {
            addSheet(detail.data('id'), list[i]);
        }
    }

    function addSheet(id, data) {
        var detailTable = $('.J_sheetCon[data-id="' + id + '"] table tbody');
        var content = $('<tr data-did="' + data.productId + '">\n' +
        '            <td><input type="checkbox">' + data.productId + '</td>\n' +
        '            <td>'+data.title+'</td>\n'+
        '            <td>'+data.price+'</td>\n'+
        '            <td>'+data.marketPrice+'</td>\n'+
        '            <td>'+data.remain+'</td>\n'+
        '            <td>'+data.tagTitle+'</td>'+
        '            <td><input type="text" class="J_itemOrder ts-ordertxt" value="' + data.orderNumber + '" readonly="readonly"/></td>\n' +
        '            <td><a href="#" class="J_sDel">删除</a></td>\n' +
        '            </tr>');
        content.find('.J_sDel').on('click', function (e) {
            e.preventDefault();
            if (confirm('确认删除？')) {
                $('.J_sheetCon[data-id="' + id + '"] .sheet-operate-overlay').show();
                var productId = data.productId;
                $.ajax({
                    'url': '/sale/delete',
                    'type': 'post',
                    'data': {
                        'businessCode':G_PageData.businessCode,
                        'beginDate':G_PageData.beginDate,
                        'cityId':G_PageData.cityId,
                        'period':id,
                        'productId':productId
                    },
                    'dataType': 'json',
                    'success': function (data) {
                        $('.J_sheetCon[data-id="' + id + '"] .sheet-operate-overlay').hide();
                        if (data.code == 200) {

                            window.location.reload();
                            //content.remove();
                            //changeDealNumer(id);
                            //clearDealData(id, productId);
                        } else if (data.code == 500) {
                            alert(data.msg);
                        }
                    }
                });
            }
        });
        content.find('.J_itemOrder').on('blur', function () {
            //changeDealSort(pid);
        });
        detailTable.append(content);
    }

    // add one
    function loadingSheets(id, productId, type) {
        if (productId == '' || productId == null || productId == undefined) {
            alert('商户不能为空');
            return;
        }
        $('.J_sheetCon[data-id="' + id + '"] .sheet-operate-overlay').show();
        $.ajax({
            'url': '/sale/insert',
            'type': 'post',
            'data': {
                'businessCode':G_PageData.businessCode,
                'beginDate':G_PageData.beginDate,
                'period':id,
                'type':type,
                'cityId':G_PageData.cityId,
                'productId': productId
            },
            'dataType': 'json',
            'success': function (data) {
                $('.J_sheetCon[data-id="' + id + '"] .sheet-operate-overlay').hide();
                if (data.code == 200) {

                    window.location.reload();
                } else {
                    alert(data.msg);
                }
            }
        });
    }

    var batchDialogReady = true, cityErrDialog;

    // add some one
    function batchAdd(id) {
        var batchDialog;
        if (batchDialogReady) {
            batchDialog = $('<div title="批量添加商户">\n' +
            '<input type="hidden" value="0" class="J_dealListIdx"/>' +
            '<textarea class="J_productIdList" placeholder="请输入产品ID\n注意：每行的输入格式为：\n“产品ID,城市名”" style="height: 300px;width:310px "></textarea>\n' +
            '</div>');
            batchDialog.dialog({
                autoOpen: false,
                height: 300,
                width: 350,
                modal: true,
                scalable: false,
                buttons: {
                    '新增': function () {
                        var dealId = batchDialog.find('.J_dealListIdx').val();
                        var dealList = batchDialog.find('.J_productIdList').val();
                        var thisType;
                        sheetList.forEach(function (item) {
                            if (item['period'] == id) {
                                thisType = item['type'];
                            }
                        });
                        loadingSheetsBatch(dealId, dealList, thisType, 'import');
                        batchDialog.dialog("close");
                    },
                    '替换': function () {
                        var dealId = batchDialog.find('.J_dealListIdx').val();
                        var dealList = batchDialog.find('.J_productIdList').val();
                        var thisType;
                        sheetList.forEach(function (item) {
                            if (item['period'] == id) {
                                thisType = item['type'];
                            }
                        });
                        loadingSheetsBatch(dealId, dealList, thisType, 'reset');
                        batchDialog.dialog("close");
                    }
                },
                close: function () {
                    //allFields.removeClass("ui-state-error");
                }
            });
        }
        batchDialog.find('.J_dealListIdx').val(id);
        batchDialog.find('.J_shopIdList').val('');
        batchDialog.dialog("open");
    }

    function loadingSheetsBatch(dealId, dealList, type, isReset) {
        if (dealList == '' || dealList == null || dealList == undefined) {
            alert('商户不能为空');
            return;
        }
        $('.J_sheetCon[data-id="' + dealId + '"] .sheet-operate-overlay').show();
        $.ajax({
            'url': '/sale/batchInsert',
            'type': 'post',
            'data': {
                'businessCode':G_PageData.businessCode,
                'beginDate':G_PageData.beginDate,
                'period':dealId,
                'type':type,
                'deleteType': isReset == "reset",
                'deals': dealList
            },
            'dataType': 'json',
            'success': function (data) {
                $('.J_sheetCon[data-id="' + dealId + '"] .sheet-operate-overlay').hide();
                if (data.code == 200) {
                    var message = data.message;
                    if (data.repeat && data.repeat.length > 0) {
                        message += "\n重复：\n" + data.repeat.join("\n");
                    }
                    if (data.unResolve) {
                        message += "\n解析失败：\n" + data.unResolve.join("\n");
                    }
                    if (data.notNumber) {
                        message += "\n不能解析位数字：\n" + data.notNumber.join("\n");
                    }

                    alert(message);
                    window.location.reload();
                } else if (data.code == 500) {
                    alert(data.message);
                }
            }
        });
    }

    // delete some one
    function batchDel(id) {
        var productList = [];
        var checkList = $('.J_sheetCon[data-id="' + id + '"] tbody input[type="checkbox"]:checked');
        checkList.each(function (index, element) {
            productList.push($(element).parent().parent().data('did'));
        });
        if (confirm('确认删除？')) {
            $('.J_sheetCon[data-id="' + id + '"] .sheet-operate-overlay').show();
            $.ajax({
                'url': '/sale/batchDelete',
                'type': 'post',
                'data': {
                    'businessCode':G_PageData.businessCode,
                    'beginDate':G_PageData.beginDate,
                    'cityId':G_PageData.cityId,
                    'period':id,
                    'productList': productList.join(',')
                },
                'dataType': 'json',
                'success': function (data) {
                    $('.J_sheetCon[data-id="' + id + '"] .sheet-operate-overlay').hide();
                    if (data.code == 200) {

                        if (data.errorData && data.errorData.length > 0) {
                            alert("错误数据：" + data.errorData.join(','));
                        }
                        window.location.reload();
                        //for (var i in productList) {
                        //    $('.J_sheetCon[data-id="' + id + '"] [data-did="' + productList[i] + '"]').remove();
                        //    clearDealData(id, productList[i]);
                        //}
                        //changeDealNumer(id);
                    } else if (data.code == 500) {

                        if (data.errorData && data.errorData.length > 0) {
                            alert(data.msg + "\n错误数据：" + data.errorData.join(','));
                        }
                    }
                }
            });
        }
    }

    function changeDealSort(thisId) {
        var detailItemOrderList = $('.J_sheetCon[data-id="' + thisId + '"]').find('.J_itemOrder');
        var id = parseInt(thisId), thisSheet = [];
        sheetList.forEach(function (item) {
            if (item['id'] == id) {
                thisSheet = item['sheets'];
            }
        });
        detailItemOrderList.each(function (index, element) {
            // element == this
            var value = parseInt($(element).val());
            var maxValue = detailItemOrderList.length;
            var defaultValue = parseInt(thisSheet[index]['orderNumber']);
            if (isNaN(value)) {
                value = defaultValue;
            } else if (value < 1) {
                value = 1;
            } else if (value > maxValue) {
                value = maxValue;
            }
            if (value != defaultValue) {
                for (var i = 0; i < thisSheet.length; i++) {
                    if (value > defaultValue) {
                        if (value >= parseInt(thisSheet[i]['orderNumber']) && defaultValue < parseInt(thisSheet[i]['orderNumber'])) {
                            thisSheet[i]['orderNumber'] = parseInt(thisSheet[i]['orderNumber']) - 1;
                            detailItemOrderList.eq(i).val(thisSheet[i]['orderNumber']);
                        }
                    } else {
                        if (value <= parseInt(thisSheet[i]['orderNumber']) && defaultValue > parseInt(thisSheet[i]['orderNumber'])) {
                            thisSheet[i]['orderNumber'] = parseInt(thisSheet[i]['orderNumber']) + 1;
                            detailItemOrderList.eq(i).val(thisSheet[i]['orderNumber']);
                        }
                    }
                }
                thisSheet[index]['orderNumber'] = value;
                $(element).val(value);
                var sortList = [];
                for (var j = 0; j < thisSheet.length; j++) {
                    sortList.push({
                        'dealGroupId': thisSheet[j].productId,
                        'sort': thisSheet[j].orderNumber
                    });
                }
                $('.J_submit').removeClass('bn-yel').addClass('J_submitSort').addClass('bn-ash').html('保存排序');
            }
        });
    }

    function addSheetData(id, data) {
        for (var i in sheetList) {
            if (sheetList[i]['id'] == id) {
                sheetList[i]['sheets'].push(data);
            }
        }
    }

    function clearDealData(id, productId) {
        var resetSort = 0;
        for (var i = 0; i < sheetList.length; i++) {
            if (sheetList[i]['id'] == id) {
                for (var j = 0; j < sheetList[i]['sheets'].length; j++) {
                    if (sheetList[i]['sheets'][j].productId == productId) {
                        resetSort = parseInt(sheetList[i]['sheets'][j]['orderNumber']);
                        sheetList[i]['sheets'].splice(j, 1);
                    }
                }
                for (var k = 0; k < sheetList[i]['sheets'].length; k++) {
                    if (parseInt(sheetList[i]['sheets'][k]['orderNumber']) > resetSort) {
                        sheetList[i]['sheets'][k]['orderNumber'] = parseInt(sheetList[i]['sheets'][k]['orderNumber']) - 1;
                        $('.J_sheetCon[data-id="' + id + '"] [data-did="' + sheetList[i]['sheets'][k].productId + '"] .J_itemOrder').val(sheetList[i]['sheets'][k]['orderNumber']);
                    }
                }
            }
        }
    }

    function changeDealNumer(id) {
        var $tr = $('.J_sheetCon[data-id="' + id + '"] tbody tr').length;

        $('.J_sheetTopic[data-id="' + id + '"] td').eq(2).html($tr || 0);
    }

    function createCityErrDialog() {
        var cityErrDialog = $('<div title="确认发布"><div class="city-err-dcon" id="J_cityErrInf"></div></div>');
        cityErrDialog.dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            scalable: false,
            buttons: {
                '取消': function () {
                    cityErrDialog.dialog("close");
                },
                '确认': function () {
                    submitStep2();
                    cityErrDialog.dialog("close");
                }
            },
            close: function () {
                //allFields.removeClass("ui-state-error");
            }
        });
    }


    function submitPage() {
        $('.J_submit').removeClass('bn-yel').addClass('bn-ash').html('正在发布...');
        $.ajax({
            'url': '/sale/submitPage-Not_completed',
            'type': 'post',
            'data': {
                'topicId': G_PageData.topicId,
                'cityId': G_PageData.cityId
            },
            'dataType': 'json',
            'success': function (data) {
                $('.J_submit').removeClass('bn-ash').addClass('bn-yel').html('发布活动');
                if (data.code == 200) {
                    alert('发布成功！');
                    location.href = '/sale/init';
                } else if (data.code == 500) {
                    alert(data.msg.message);
                } else if (data.code == 501) {
                    cityErrDialog.find('#J_cityErrInf').html(data.msg.message);
                    cityErrDialog.dialog('open');
                }
                $('.J_submit').removeClass('bn-ash').addClass('bn-yel').html('发布活动');
            },
            'error': function () {
            }
        });

    }

    function submitSort() {
        $('.J_submit').removeClass('J_submitSort').html('正在保存...');
        var sortList = [];
        for (var i = 0; i < sheetList.length; i++) {
            var itemSort = {
                'mainId': sheetList[i].id,
                'sort': sheetList[i].orderNumber,
                'subId2SortList': []
            };
            for (var j = 0; j < sheetList[i]['sheets'].length; j++) {
                itemSort['subId2SortList'].push({
                    'subId': sheetList[i]['sheets'][j].shopId,
                    'sort': sheetList[i]['sheets'][j].orderNumber
                });
            }
            sortList.push(itemSort);
        }
        $.ajax({
            'url': '/sale/submitSort-Not_completed',
            'type': 'post',
            'data': {
                'topicId': G_PageData.topicId,
                'cityId': G_PageData.cityId,
                'sort': JSON.stringify(sortList)
            },
            'dataType': 'json',
            'success': function (data) {
                if (data.code == 200) {
                    if ($('.J_submit').hasClass('J_submitSort'))
                        $('.J_submit').html('保存排序');
                    else
                        $('.J_submit').removeClass('bn-ash').addClass('bn-yel').html('发布活动');
                } else if (data.code == 500) {
                    alert(data.msg.message);
                    $('.J_submit').removeClass('bn-yel').addClass('J_submitSort').addClass('bn-ash').html('保存排序');
                }
            },
            'error': function () {
            }
        });
    }


    function changeSort() {
        var itemOrderList = $('.J_sheetTopic .J_itemOrder');
        itemOrderList.each(function (index, element) {
            var value = parseInt($(element).val());
            var maxValue = itemOrderList.length;
            var defaultValue = parseInt(sheetList[index]['orderNumber']);
            if (isNaN(value)) {
                value = defaultValue;
            } else if (value < 1) {
                value = 1;
            } else if (value > maxValue) {
                value = maxValue;
            }
            if (value != defaultValue) {
                for (var i = 0; i < sheetList.length; i++) {
                    if (value > defaultValue) {
                        if (value >= parseInt(sheetList[i]['orderNumber']) && defaultValue < parseInt(sheetList[i]['orderNumber'])) {
                            sheetList[i]['orderNumber'] = parseInt(sheetList[i]['orderNumber']) - 1;
                            itemOrderList.eq(i).val(sheetList[i]['orderNumber']);
                        }
                    } else {
                        if (value <= parseInt(sheetList[i]['orderNumber']) && defaultValue > parseInt(sheetList[i]['orderNumber'])) {
                            sheetList[i]['orderNumber'] = parseInt(sheetList[i]['orderNumber']) + 1;
                            itemOrderList.eq(i).val(sheetList[i]['orderNumber']);
                        }
                    }
                }
                sheetList[index]['orderNumber'] = value;
                $(element).val(value);
                var sortList = [];
                for (var i = 0; i < sheetList.length; i++) {
                    sortList.push({
                        'itemId': sheetList[i].id,
                        'sort': sheetList[i].orderNumber
                    });
                }
                $('.J_submit').removeClass('bn-yel').addClass('J_submitSort').addClass('bn-ash').html('保存排序');
            }
        });
    }

    $(function () {

        $("#submit-btn").on('click', function (e) {
            e.preventDefault();
            redirect();
        });
        $("#select-city").on('change', redirect);
        $("#select-type").on('change', redirect);

        $(".datepicker").each(function (index) {
            $(this).datepicker({
                dateFormat: "yy-mm-dd"
            });
        });

        createCityErrDialog();

        initSheet();
        $('.J_sheetTopic .J_itemOrder').on('blur', function () {
            changeSort();
        });
    });
})();