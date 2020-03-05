$( function() {
    

    $( "#offerstartdate" ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy',
        minDate: new Date
    });

    $( "#offerenddate" ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy',
        minDate: new Date
    });

    $( "#filterstartdate" ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy'
    });

    $( "#filterenddate" ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy'
    });

    $('#offerstarttime').timepicker({ 'timeFormat': 'h:i A' });
    $('#offerendtime').timepicker({ 'timeFormat': 'h:i A' });
});

$(document).ready(function () {
    'use strict';
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           return decodeURI(results[1]) || 0;
        }
    }

    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test( $email );
    }

    var checkpass = $.urlParam('pass');
    if( checkpass == 1) {
        setTimeout(function(){ window.location.href = '/settings/passwordsetting'; }, 10000);
    }
    
    var table;
    table = jQuery('.product_detail_table').DataTable({
        dom: 'Bfrtip',
        "lengthChange": true,
        "order": [[ 0, "desc" ]],
        buttons: [
            'excel',
            'print',
            'pdf'
        ]
    });

    var sliderTable;
    sliderTable = jQuery('.slider_details_table').DataTable({
        dom: 'Bfrtip',
        "lengthChange": true,
        "order": [[ 0, "desc" ]],
        buttons: [
            'excel',
            'print',
            'pdf'
        ]
    });

    function datatablesearch() {
        var whatsSelected = [];
        var filterValue = $("input[name='formfilter']:checked").val();
        console.log(filterValue);
        if(filterValue != 'all') {
            whatsSelected.push(filterValue);
            table.columns(7).search(whatsSelected.join('|'),true).draw();
        } else {
            $('.product_detail_table').DataTable().destroy();
            table = '';
            table = jQuery('.product_detail_table').DataTable({
                dom: 'Bfrtip',
                "lengthChange": true,
                "order": [[ 0, "desc" ]],
                buttons: [
                    'excel',
                    'print',
                    'pdf'
                ]
            });
        }
    }
  
    $(document).on("click", "input[name='formfilter']", function(){
        datatablesearch();
    });

    // $(document).on("change", "#offerproductname", function() {
    //     $('.loader').show();
    //     var productID =  $("#offerproductname option:selected").attr("data-productid"); 
    //     $.ajax({
    //         type:'GET',
    //         url: '/offers/getproductbrandbyid',
    //         dataType:'json',
    //         data:
    //         {
    //             id: productID
    //         },
    //         success: function(data) {
    //             if( data['success'] ) {
    //                 var productArray = data['product']['productbrand'];
    //                 var i, j;
    //                 var brandPackVariationArray = productArray[0]['brand_pack_variation'];
    //                 var packVariation = '<select class="form-control" name="pack" id="pack">';
    //                 packVariation += '<option value="all" selected="">All</option>';
    //                 for(j = 0; j < brandPackVariationArray.length; j++) {
    //                     console.log(brandPackVariationArray[j]['packvalue']);
    //                     packVariation += '<option value="'+brandPackVariationArray[j]['packvalue']+'">'+brandPackVariationArray[j]['packvalue']+'</option>';
    //                 }
    //                 packVariation += '</select>';
    //                 var result = '<select class="form-control" name="productbrand" id="productbrand">';
    //                 result += '<option value="all" selected="">All</option>';
    //                 $.each(productArray, function( index, value ) {
    //                     result += '<option value="'+value.productbrand+'" data-serialnumber="'+value.serialnumber+'">'+value.productbrand+'</option>';  
    //                 });
    //                 result += '</select>';
    //                 var idField = '<input type="hidden" name="offerproductid" class="form-control" id="offerproductid" value="'+productID+'"/>';
    //                 $('.product_id_hidden_div').html(idField);
    //                 $('.product_brand_div').html(result);
    //                 $('.product_variation_div').html(packVariation); 
    //                 $('.loader').hide();
    //             }
    //         }
    //     });
    // });

    // $(document).on("change", "#productbrand", function(){
    //     $('.loader').show();
    //     var productID =  $("#offerproductname option:selected").attr("data-productid");
    //     var productBrand = $(this).val();
    //     $.ajax({
    //         type:'GET',
    //         url: '/offers/getproductbrandbyid',
    //         dataType:'json',
    //         data:
    //         {
    //             id: productID
    //         },
    //         success: function(data) {
    //             if( data['success'] ) {
    //                 var productArray = data['product']['productbrand'];
    //                 var i, j;
    //                 var packVariation = '<select class="form-control" name="pack" id="pack">';
    //                 packVariation += '<option value="all" selected="">All</option>';
    //                 for (i = 0; i < productArray.length; i++) {
    //                     if(productArray[i]['productbrand'] == productBrand) {
    //                         var brandPackVariationArray = productArray[i]['brand_pack_variation'];
    //                         for(j = 0; j < brandPackVariationArray.length; j++) {
    //                             console.log(brandPackVariationArray[j]['packvalue']);
    //                             packVariation += '<option value="'+brandPackVariationArray[j]['packvalue']+'">'+brandPackVariationArray[j]['packvalue']+'</option>';
    //                         }
    //                     }
    //                 }
    //                 packVariation += '</select>';
    //                 $('.product_variation_div').html(packVariation);
    //                 $('.loader').hide();
    //             }
    //         }
    //     });
    // });

    // $(document).on("click", ".inner-delete-btn", function(){
    //     var brandIndex = $(this).attr('data-brand-index');
    //     var parent_id = $(this).closest('.brand_variation_row-'+brandIndex).prop('id');
    //     $("#"+parent_id).remove();
    // });

    // $(document).on("click", "#filtersubmit", function(){
    //     $('.loader').show();
    //     var dateStart = $('#filterstartdate').val();
    //     var dateEnd = $('#filterenddate').val();
    //     var pending = $('input[name="pendingorder"]:checked').val();
    //     var delivered = $('input[name="deliveredorder"]:checked').val();
    //     var allorder = $('input[name="allorder"]:checked').val();
    //     $.ajax({
    //         type: "POST",
	// 		url: '/orders/orderdetail',
	// 		dataType:'json',
    //         data:
    //         {
    //             startdate: dateStart,
    //             enddate: dateEnd,
    //             pending: pending,
    //             delivered: delivered,
    //             allorder: allorder
    //         },
    //         success: function(data) {
    //             var i, j, result;
    //             if( data['success'] == true ) {
    //                 var order = data['orders'];
    //                 for (i = 0; i < order.length; i++) {
    //                     var cartObjectArray = order[i]['cartobject'];
    //                     for (j = 0; j < cartObjectArray.length; j++) {
    //                         $.each(cartObjectArray[j], function( index, value ) {
    //                             result += '<tr>';
    //                             result += '<td>'+order[i]['orderid']+'</td><td>'+order[i]['customername']+'</td><td>'+order[i]['brokername']+'</td>';
    //                             result += '<td>'+value['productName']+'</td><td>'+value['offerPrice']+'</td><td>'+value['quantity']+'</td><td>'+value['deliveredQty']+'</td><td>'+value['balanceQty']+'';
    //                             if(value['balanceQty'] == 0) {
    //                                 result += '<span style="display:none;">delivered</span>';
    //                             }else{
    //                                 result += '<span style="display:none;">pending</span>';
    //                             }
    //                             result += '</td><td><a href="/orders/ordersingledetail/?id='+order[i]['_id']+'&key='+index+'">Edit</a></td>';
    //                             result += '</tr>';
    //                         });
    //                     }
    //                 }
    //                 $('.order_detail_body').html(result);
    //                 $('.loader').hide();
    //             }
    //         }
    //     });
    // });

    $(document).on("click", "#offerfiltersubmit", function(){
        $('.loader').show();
        var dateStart = $('#filterstartdate').val();
        var dateEnd = $('#filterenddate').val();
        $.ajax({
            type: "POST",
			url: '/offers/all',
			dataType:'json',
            data:
            {
                startdate: dateStart,
                enddate: dateEnd
            },
            success: function(data) {
                var i, result;
                if( data['success'] == true ) {
                    console.log("success true");
                    var offers = data['offers'];
                    for (i = 0; i < offers.length; i++) {
                        var offerstartdate = moment(offers[i]['offerstartdate']).tz("Asia/Kolkata").format('DD/MM/YYYY h:mm a');
                        var offerenddate = moment(offers[i]['offerenddate']).tz("Asia/Kolkata").format('DD/MM/YYYY h:mm a');
                        var remainingQty = offers[i]['offersize'] - offers[i]['offerremaingquantity'];
                        var serialnum = i + 1;
                        result += '<tr>';
                        result += '<td>'+serialnum+'</td><td>'+offers[i]['productname']+'</td><td>'+offers[i]['productbrand']+'</td>';
                        result += '<td>'+offers[i]['pack']+'</td><td>'+offers[i]['priceoffer']+'</td><td>'+offers[i]['maxlimituser']+' '+offers[i]['maxlimituserunit']+'</td><td>'+offerstartdate+' to '+offerenddate+' </td><td>'+offers[i]['offersize']+' '+offers[i]['offersizeunit']+'</td><td>'+remainingQty+' '+offers[i]['offersizeunit']+'</td><td><a href="/offers/'+offers[i]['_id']+'">Edit</a></td>';
                        result += '</tr>';
                    }
                    $('.all_offer_body').html(result);
                    $('.loader').hide();
                }
            }
        });
    });

    $(document).on("click", ".change_product_img", function(){
        var index = $(this).attr('data-index');
        $('.product_image_upload-'+index).show();
    });

    $(document).on('click', '.delete-product', function(){
        $('.loader').show();
        let id = $(this).attr('data-id');
        $.ajax({
        type:'DELETE',
        url: '/products/'+id,
        success: function(response){
            $('.loader').hide();
            alert('Product Deleted Successfully');
            window.location.href='/products/all';
        },
        error: function(err){
            console.log(err);
        }
        });
    });

    $(document).on('click', '.delete-orders', function(){
        $('.loader').show();
        let id = $(this).attr('data-id');
        $.ajax({
        type:'DELETE',
        url: '/orders/'+id,
        success: function(response){
            alert('Deleting Order');
            $('.loader').hide();
            window.location.href='/orders/all';
        },
        error: function(err){
            console.log(err);
        }
        });
    });

    $(document).on('click', '.delete-offers', function(){
        $('.loader').show();
        let id = $(this).attr('data-id');
        $.ajax({
        type:'DELETE',
        url: '/offers/'+id,
        success: function(response){
            alert('Deleting Offer');
            $('.loader').hide();
            window.location.href='/offers/all';
        },
        error: function(err){
            console.log(err);
        }
        });
    });

    
    $(document).on('click', '.product_name_change', function(){
        $('.offer_product_name').hide();
        $('#offerproductname').show();
    });

    $("#addproductform").on( "submit", function(e) {
        $('.product_brand').each(function(){
            var selected = $(this).find('option:selected').attr('data-serialnum');
            $(this).siblings('.serialnumberclass').val(selected);
        });
        var title = $.trim($('#producttitle').val());
        var serialNumber = $.trim($('#sku').val());
        var productUnit = $.trim($('#unit').val());
        if(title== '') {
            $('#producttitle').next().show();
            
        }else{
            $('#producttitle').next().hide();
        }

        if(serialNumber== '') {
            $('#sku').next().show();
            
        }else{
            $('#sku').next().hide();
        }

        if(productUnit== '') {
            $('#unit').next().show();
        }else{
            $('#unit').next().hide();
        }
        
        if(title == '' || serialNumber == '' || productUnit == ''){
            return false;
        }
        e.preventDefault();
        $(this).ajaxSubmit({
            data: {title: title},
            contentType: 'application/json',
            success: function(response){
                console.log(response);
                if(response['success'] == true) {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    $('.productsuccess').html(response['message']);
                    $('.productsuccess').show();
                    $('.productdanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/products/all'; }, 3000);
                } else {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    if(response['serialerror']) {
                        $('.productdanger').html(response['serialerror']);
                    } else {
                        $('.productdanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.productdanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.productdanger').show();
                    $('.productsuccess').hide();
                }   
            }
        });
        return false;
    });


    $(document).on('click', '.edit_product_btn', function(){
        var productid = $(this).attr('data-id');
        $('.loader').show();
        $.ajax({
            type:'GET',
            url: '/products/'+productid,
            dataType:'json',
            success: function(response) {
                console.log(response);
                if(response['success'] == true) {
                    var brands = response['brands'];
                    var productbrand = response['product'].productbrand;
                    var producttitle = response['product'].producttitle;
                    var sku = response['product'].sku;
                    var description = response['product'].productbody;
                    var unit = response['product'].unit;
                    $('.edit_sku').val(sku);
                    $('.edit_title').val(producttitle);
                    $('.editdescription').val(description);
                    $('.editunit').val(unit);
                    $('.product_brand_variaton').html(" ");
                    $('#editproductform').show();
                    $('#addproductform').hide();
                    $("#editproductform").attr("action", "/products/edit/" + productid);
                } else {
                    $('.productdanger').html(response['message']);
                    $('.productdanger').show();
                    $('.productsuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $("#editproductform").on( "submit", function(e) {
        $('.edit_product_brand').each(function(){
            var selected = $(this).find('option:selected').attr('data-serialnum');
            $(this).siblings('.editserialnumberclass').val(selected);
        });
        var title = $.trim($('#editproducttitle').val());
        var serialNumber = $.trim($('.edit_sku').val());
        var productUnit = $.trim($('#editproductunit').val());
        if(title== '') {
            $('#editproducttitle').next().show();
            
        }else{
            $('#editproducttitle').next().hide();
        }

        if(serialNumber== '') {
            $('#edit_sku').next().show();
            
        }else{
            $('#edit_sku').next().hide();
        }

        if(productUnit== '') {
            $('#editproductunit').next().show();
        }else{
            $('#editproductunit').next().hide();
        }
        
        if(title == '' || serialNumber == '' || productUnit == ''){
            return false;
        }
        e.preventDefault();
        $(this).ajaxSubmit({
            data: {title: title},
            contentType: 'application/json',
            success: function(response){
                console.log(response);
                if(response['success'] == true) {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    $('.productsuccess').html(response['message']);
                    $('.productsuccess').show();
                    $('.productdanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/products/all'; }, 3000);
                } else {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    if(response['serialerror']) {
                        $('.productdanger').html(response['serialerror']);
                    } else {
                        $('.productdanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.productdanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.productdanger').show();
                    $('.productsuccess').hide();
                }   
            }
        });
        return false;
    });


    $("#enableslide").on( "change", function() {
        if($(this).prop("checked") == true){
            $(this).val("enable");
        }else{
            $(this).val("disable");
        }
    });

    $(document).on('click', '.offeraddbtn', function(){
        let productName         = $('.productname').val();
        let productBrand        = $('.productbrandfield').val();
        let productVariation    = $('.variationfield').val();
        let offerInfo           = $('.offerinfo').val()
        let priceOfferField     = $('.price_offer_field').val();
        let maxLimitUser        = $('.maxlimituser').val();
        let offerStartDate      = $('.offer-start-date').val();
        let offerEndDate        = $('.offer-end-date').val();
        let offerStartTime      = $('.offer-start-time').val();
        let offerEndTime        = $('.offer-end-time').val();
        let offerSizeLimit      = $('.offer-size').val();

        if(productName == '') {
            $('.productname').next().show();
        } else {
            $('.productname').next().hide();
        }

        if(productBrand == '') {
            $('.productbrandfield').next().show();
        } else {
            $('.productbrandfield').next().hide();
        }

        if(productVariation == '') {
            $('.variationfield').next().show();
        } else {
            $('.variationfield').next().hide();
        }

        if(offerInfo == '') {
            $('.offerinfo').next().show();
        } else {
            $('.offerinfo').next().hide();
        }

        if(priceOfferField == '') {
            $('.priceoffererror').show();
        } else {
            $('.priceoffererror').hide();
        }

        if(maxLimitUser == '') {
            $('.offermaxlimit').show();
        } else {
            $('.offermaxlimit').hide();
        }

        if(offerStartDate == '') {
            $('.offer-start-date').next().show();
        } else {
            $('.offer-start-date').next().hide();
        }

        if(offerEndDate == '') {
            $('.offer-end-date').next().show();
        } else {
            $('.offer-end-date').next().hide();
        }

        if(offerStartTime == '') {
            $('.offer-start-time').next().show();
        } else {
            $('.offer-start-time').next().hide();
        }

        if(offerEndTime == '') {
            $('.offer-end-time').next().show();
        } else {
            $('.offer-end-time').next().hide();
        }

        if(offerSizeLimit == '') {
            $('.offer-size-error').show();
        } else {
            $('.offer-size-error').hide();
        }
        
        if(productName == '' || productBrand == '' || productVariation == '' || offerInfo == '' || priceOfferField == '' || maxLimitUser == '' || offerStartDate == '' || offerEndDate == '' || offerStartTime == '' || offerEndTime == '' || offerSizeLimit == ''){
            return false;
        } else {
            $('#addofferform').submit();
        }
    });

    /*********************** Category Related Code ****************************/

    // add category ajax
    $("#addcategoryform").on( "submit", function(e) {
        let categoryTitle       = $.trim($('.categorytitle').val());
        let categoryDescription = $.trim($('.categorydescripiton').val());
        let categorySlug        = categoryTitle.replace(/\s+/g, '-').toLowerCase();
        
        if(categoryTitle == '') {
            $('.categorytitle').next().show();  
        }else{
            $('.categorytitle').next().hide();
        }

        if(categoryDescription== '') {
            $('.categorydescripiton').next().show();
        }else{
            $('.categorydescripiton').next().hide();
        }

        if(categoryTitle == '' || categoryDescription == ''){
            return false;
        }
        e.preventDefault();
        $('.loader').show()
        $(this).ajaxSubmit({
            data: {categoryslug: categorySlug},
            contentType: 'application/json',
            success: function(response){
                if(response['success'] == true) {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    $('.categorysuccess').html(response['message']);
                    $('.categorysuccess').show();
                    $('.categorydanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/categories/all'; }, 3000);
                } else {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    if(response['serialerror']) {
                        $('.categorydanger').html(response['serialerror']);
                    } else {
                        $('.categorydanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.categorydanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.categorydanger').show();
                    $('.categorysuccess').hide();
                    $('.loader').hide();
                }   
            }
        });
        return false;
    });

    // get category details
    $(document).on('click', '.edit_category_btn', function(){
        let categoryId = $(this).attr('data-id');
        $('.loader').show();
        $.ajax({
            type:'GET',
            url: '/categories/'+categoryId,
            dataType:'json',
            success: function(response) {
                if(response['success'] == true) {
                    let categoryTitle       = response['categories'].categorytitle;
                    let categoryDescription = response['categories'].catdescription;
                    let filepath            = response['categories'].filepath;
                    let fileName            = response['categories'].filepath;
                    let categoryParent      = response['categories'].parentid;
                    let blockedCountries    = response['categories'].blockedcountries;
                    $('.editcategoryname').val(categoryTitle);
                    $('.editcategorydescription').val(categoryDescription);
                    $('.edit_filename_category').val(fileName);
                    $('.edit_category_img').attr("src",filepath);
                    $('.editparentcategory').val(categoryParent);
                    $(".edit-blokced-country").val(blockedCountries);
                    $('#edit_category_form').show();
                    $('#addcategoryform').hide();
                    $("#edit_category_form").attr("action", "/categories/edit/" + categoryId);
                } else {
                    $('.categorydanger').html(response['message']);
                    $('.categorydanger').show();
                    $('.categorysuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    // submit edit category form
    $("#edit_category_form").on( "submit", function(e) {
        let categoryTitle       = $.trim($('.editcategoryname').val());
        let categoryDescription = $.trim($('.editcategorydescription').val());
        let categorySlug        = categoryTitle.replace(/\s+/g, '-').toLowerCase();
        
        if(categoryTitle == '') {
            $('.editcategoryname').next().show();  
        }else{
            $('.editcategoryname').next().hide();
        }

        if(categoryDescription== '') {
            $('.editcategorydescription').next().show();
        }else{
            $('.editcategorydescription').next().hide();
        }

        if(categoryTitle == '' || categoryDescription == ''){
            return false;
        }
        e.preventDefault();
        $('.loader').show();
        $(this).ajaxSubmit({
            data: {categoryslug: categorySlug},
            contentType: 'application/json',
            success: function(response){
                console.log(response);
                if(response['success'] == true) {
                    $('.categorysuccess').html(response['message']);
                    $('.categorysuccess').show();
                    $('.categorydanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/categories/all'; }, 5000);
                } else {
                    if(response['serialerror']) {
                        $('.categorydanger').html(response['serialerror']);
                    } else {
                        $('.categorydanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.categorydanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.categorydanger').show();
                    $('.categorysuccess').hide();
                    $('.loader').hide();
                }    
            }
        });
        return false;
    });

    // Delete category
    $(document).on('click', '.delete-category', function(){
        $('.loader').show();
        let id = $(this).attr('data-id');
        $.ajax({
        type:'DELETE',
        url: '/categories/'+id,
        success: function(response) {
            alert('Deleting Category');
            $('.loader').hide();
            window.location.href='/categories/all';
        },
        error: function(err){
            console.log(err);
        }
        });
    });

    /******************************* Pages Related Jquery and Ajax *******************************/
    $("#page-add-form").on( "submit", function(e) {
        let pageLayout          = $.trim($('.page-layout').val());
        let pageTitle           = $.trim($('.pagetitle').val());
        let pageCountry         = $.trim($('.page-country').val());
        
        if(pageLayout == '') {
            $('.page-layout').next().show();  
        }else{
            $('.page-layout').next().hide();
        }

        if(pageTitle == '') {
            $('.pagetitle').next().show();
        }else{
            $('.pagetitle').next().hide();
        }

        if(pageCountry == '') {
            $('.page-country').next().show();
        }else{
            $('.page-country').next().hide();
        }

        if(pageLayout == '' || pageTitle == '' || pageCountry == ''){
            return false;
        }

        e.preventDefault();
        $('.loader').show()
        $(this).ajaxSubmit({
            data: {pageTitle: pageTitle},
            contentType: 'application/json',
            success: function(response){
                if(response['success'] == true) {
                    $('.pagesuccess').html(response['message']);
                    $('.pagesuccess').show();
                    $('.pagedanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/pages/all'; }, 5000);
                } else {
                    if(response['serialerror']) {
                        $('.pagedanger').html(response['serialerror']);
                    } else {
                        $('.pagedanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.pagedanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.pagedanger').show();
                    $('.pagesuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
        return false;
    });

    $("#page-edit-form").on( "submit", function(e) {
        let pageLayout          = $.trim($('.page-layout').val());
        let pageTitle           = $.trim($('.pagetitle').val());
        let pageCountry         = $.trim($('.page-country').val());
        var pageid              = $.trim($('.editpageid').val());
        if(pageLayout == '') {
            $('.page-layout').next().show();  
        }else{
            $('.page-layout').next().hide();
        }

        if(pageTitle == '') {
            $('.pagetitle').next().show();
        }else{
            $('.pagetitle').next().hide();
        }

        if(pageCountry == '') {
            $('.page-country').next().show();
        }else{
            $('.page-country').next().hide();
        }

        if(pageLayout == '' || pageTitle == '' || pageCountry == ''){
            return false;
        }
        e.preventDefault();
        $('.loader').show();
        $(this).ajaxSubmit({
            data: {pageTitle: pageTitle},
            contentType: 'application/json',
            success: function(response) {
                if(response['success'] == true) {
                    $('.pagesuccess').html(response['message']);
                    $('.pagesuccess').show();
                    $('.pagedanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/pages/edit/'+ pageid; }, 5000);
                } else {
                    if(response['serialerror']) {
                        $('.pagedanger').html(response['serialerror']);
                    } else {
                        $('.pagedanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.pagedanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.pagedanger').show();
                    $('.pagesuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
        return false;
    });

    
    $(document).on('click', '.delete-page', function(){
        $('.loader').show();
        let id = $(this).attr('data-id');
        $.ajax({
        type:'DELETE',
        url: '/pages/'+id,
        success: function(response) {
            alert('Deleting Pages');
            $('.loader').hide();
            window.location.href='/pages/all';
        },
        error: function(err){
            console.log(err);
        }
        });
    });

    /******************************* JQuery Related to product section *******************************/

    $(document).on("click", ".clone", function(){
        var res = 0;
        $( ".clonedInput" ).each(function( i, val ) {
            res++;
        });
        console.log('res value'+res);
        $(".gallery-image-section .section-inside").append('<div id="clonedInput'+res+'" class="clonedInput"><div class="prod-gallery-rept"><input type="file" name="product_gallery_img['+res+']" class="product-gallery-img" data-repid="'+res+'"></div><div class="actions"><button type="button" class="clone" data-repid="'+res+'">Clone</button><button type="button" class="remove" data-repid="'+res+'">Remove</button></div></div>');
    });

    $(document).on("click", ".remove", function(){
        let repeaterId = $(this).attr('data-repid');
        if(repeaterId != 0) {
            $(this).parents(".clonedInput").remove();
        }
    });

    $(document).on('click', '.product_data_tabs li a', function() {
        let tabValue = $(this).attr('data-tab-id');
        $('.woocommerce_options_panel').hide();
        $('#'+tabValue).show();
    });

    $(document).on("change", "#product-type", function() {
        let productType = $(this).val();
        if(productType == 'variable'){
            $('.variations_options').show();
            $('.attribute_options').show();
        } else {
            $('.attribute_options').hide();
            $('.variations_options').hide();
        }
    });

    $(document).on("click", ".add_attribute", function() {
        let attributeSelect = $('.attribute_taxonomy').val();
        let attributeName  = $('.attribute_taxonomy option:selected').text();
        let dataRel        = $('.attribute_taxonomy option:selected').attr('data-rel');
        $('.loader').show();
        $.ajax({
            type:'GET',
            url: '/products/term-by-slug',
            dataType:'json',
            data:
            {
                slug: attributeSelect
            },
            success: function(data) {
                if( data['success'] ) {
                    let attributeObj = data['attributes'];
                    let attributeHtml   = '<div data-taxonomy="'+attributeSelect+'" class="woocommerce_attribute" rel="'+dataRel+'" id="attribute-'+attributeSelect+'" data-terms-selected=""><h3>';
                    attributeHtml   += '<a href="javascript:void(0)" class="remove_row delete">Remove</a>';
                    attributeHtml   += '<div class="handlediv" title="Click to toggle"></div><strong class="attribute_name">'+attributeName+'</strong></h3>';
                    attributeHtml   += '<div class="woocommerce_attribute_data wc-metabox-content" style=""><table cellpadding="0" cellspacing="0"><tbody><tr>';
                    attributeHtml   += '<td class="attribute_name"><label>Name:</label><strong>'+attributeName+'</strong><input type="hidden" name="attribute['+dataRel+'][names]" value="'+attributeSelect+'"> </td>';
                    attributeHtml   += '<td rowspan="3"><label>Value(s):</label><select multiple="" class="multiselect attribute_values" name="attribute['+dataRel+'][values]">';
                    Object.keys(attributeObj).forEach(async function eachKey(key) {
                        attributeHtml   += '<option value="'+attributeObj[key].slug+'">'+attributeObj[key].name+'</option>';
                    });
                    attributeHtml   += '</select><button class="button plus select_all_attributes" type="button">Select all</button><button class="button minus select_no_attributes" type="button">Select none</button></td>';
                    attributeHtml   += '</tr>';
                    attributeHtml   += '</tbody></table></div></div>';
                    $('.product_attributes').append(attributeHtml);
                    $(".attribute_taxonomy option[value='"+attributeSelect+"']").attr('disabled', 'disabled');
                    $('.attribute_add_btn').show();
                    $('.loader').hide();
                }
            }
        });
    });

    $(document).on('change', '.attribute_values', function(e){
        let parentid = $(this).closest(".woocommerce_attribute").attr('id');
        let opts = e.target.options;
        let len = opts.length;
        let selected = {};
        for (var i = 0; i < len; i++) {
            if (opts[i].selected) {
                selected[opts[i].value] = opts[i].text;
            }
        }
        let myJSON = JSON.stringify(selected);
        $("#"+parentid).attr('data-terms-selected', myJSON);
    });

    $(document).on('click', '.remove_row', function(){
        let attributeId = $(this).closest('.woocommerce_attribute').prop('id');
        let taxTerm = $("#"+attributeId).attr('data-taxonomy');
        $("#"+attributeId).remove();
        $('.attribute_taxonomy option[value="'+taxTerm+'"]').prop('disabled',false);
    });

    $(document).on('click', '.select_all_attributes', function(){
        let attributeId = $(this).closest('.woocommerce_attribute').prop('id');
        $('#'+attributeId+' .attribute_values option').prop('selected', true);
        let selected = {};
        $('#'+attributeId+' .attribute_values option').each(function() {
            if (this.selected) {
				selected[this.value] = this.text;
            }
        });
		let myJSON = JSON.stringify(selected);
		$("#"+attributeId).attr('data-terms-selected', myJSON);
    });


    $(document).on('click', '.select_no_attributes', function(){
        let attributeId = $(this).closest('.woocommerce_attribute').prop('id');
        $('#'+attributeId+' .attribute_values option').prop('selected', false);
        let selected = {};
        $('#'+attributeId+' .attribute_values option').each(function() {
            if (this.selected) {
				selected[this.value] = this.text;
            }
        });
		let myJSON = JSON.stringify(selected);
		$("#"+attributeId).attr('data-terms-selected', myJSON);
    });

    $(document).on('click', '.save_attributes', function(){
        $('.default-value-container').html('');
        $('.woocommerce_attribute').each(function(newindex){
            let elementId = $(this).prop('id');
            let selected = {};
            $('#'+elementId+' .attribute_values option').each(function() {
                if (this.selected) {
                    selected[this.value] = this.text;
                }
            });
            let myJSON = JSON.stringify(selected);
            $("#"+elementId).attr('data-terms-selected', myJSON);
            if($(this).attr('data-terms-selected') != "") {
                let data = $(this).attr('data-terms-selected');
                let taxonomyName = $(this).attr('data-taxonomy');
                let arr = $.parseJSON(data);
                let defaultAttribute = '<select name="default_atttribute['+taxonomyName+']"><option value="">No default</option>';
                $.each(arr,function(key,value){
                    defaultAttribute   += '<option value="'+key+'">'+value+'</option>';
                });       
                defaultAttribute   += '</select>';
                $('.default-value-container').append(defaultAttribute);
                $('.variable-add-toolbar').show();
                $('.toolbar-variations-defaults').show();
                $('.initial_variable_message').hide();
            } 
        });
    });
    $(document).on('click', '.do_variation_action', function(){
        let dataVariationRel = $(this).attr('data-variation-rel');
        let variationNumber = (dataVariationRel == 0) ? 0 : parseInt(dataVariationRel) + 1;
        let variatonHtml   = '<div class="woocommerce_variation wc-metabox open" id="product_variation-'+variationNumber+'"><h3><a href="javascript:void(0)" class="remove_variation delete" rel="product_variation-'+variationNumber+'">Remove</a><div class="handlediv" aria-label="Click to toggle"></div><div class="tips sort"></div><div class="variation_fields_section"></div>';
        $('.woocommerce_attribute').each(function(newindex){
            let elementId = $(this).prop('id');
            let selected = {};
            $('#'+elementId+' .attribute_values option').each(function() {
                if (this.selected) {
                    selected[this.value] = this.text;
                }
            });
            let myJSON = JSON.stringify(selected);
            $("#"+elementId).attr('data-terms-selected', myJSON);
            let data = $(this).attr('data-terms-selected');
            if($(this).attr('data-terms-selected') != "") {
                let taxonomyName = $(this).attr('data-taxonomy');
                let arr = $.parseJSON(data);
                let defaultAttribute = '<select name="variaton_atttribute['+variationNumber+']['+taxonomyName+']"><option value="">No default</option>';
                $.each(arr,function(key,value){
                    defaultAttribute   += '<option value="'+key+'">'+value+'</option>';
                });       
                defaultAttribute   += '</select>';
                variatonHtml += defaultAttribute;
            } 
        });
        variatonHtml   += '</h3>';
        variatonHtml   += '<div class="woocommerce_variable_attributes wc-metabox-content"><div class="data"><p class="form-field variable_sku'+variationNumber+'_field form-row form-row-last"><label for="variable_sku'+variationNumber+'"><abbr title="Stock Keeping Unit">SKU</abbr></label><span class="woocommerce-help-tip"></span><input type="text" class="short" style="" name="variaton_atttribute['+variationNumber+'][sku]" id="variable_sku'+variationNumber+'" value="" placeholder=""> </p>';
        variatonHtml   += '<div class="variable_pricing"><p class="form-field variable_regular_price_'+variationNumber+'_field form-row form-row-first"><label for="variable_regular_price_'+variationNumber+'">Regular price</label><input type="text" class="short wc_input_price" style="" name="variaton_atttribute['+variationNumber+'][regular_price]" id="variable_regular_price_'+variationNumber+'" value="" placeholder="Variation price (required)"></p>';
        variatonHtml   += '<p class="form-field variable_sale_price'+variationNumber+'field form-row form-row-last"><label for="variable_sale_price'+variationNumber+'">Sale price</label><input type="text" class="short wc_input_price" style="" name="variaton_atttribute['+variationNumber+'][sale_price]" id="variable_sale_price'+variationNumber+'" value="" placeholder=""></p>';
        variatonHtml   += '</div></div></div>';
        $('.woocommerce_variations').append(variatonHtml);
        $('.attribute-save-container').show();
        $(this).attr('data-variation-rel', variationNumber);
    });

    $(document).on('click', '.remove_variation', function(){
        let parentId = $(this).attr('rel');
        $("#"+parentId).remove();
        let dataVariationRel = $('.do_variation_action').attr('data-variation-rel');
        let variationNumber = parseInt(dataVariationRel) - 1;
        $('.do_variation_action').attr('data-variation-rel', variationNumber);
    });

    $(document).on("click", ".clone-faq", function(){
        let res = 0;
        $( ".clonedfaq" ).each(function( i, val ) {
            res++;
        });
        $(".faq-section .section-inside").append('<div id="clonedfaq'+res+'" class="clonedfaq"><div class="faq-question-rept"><div class="faq-label"> <label>FAQ Title '+res+'</label><input type="text" name="faq['+res+'][title]" class="faq-title-field" data-repid="'+res+'"></div><div class="faq-description"><label>FAQ Descripiton '+res+'</label><textarea class="form-control" name="faq['+res+'][description]" class="faq-description-field" row="5" column="5"></textarea></div><div class="actions"><button type="button" class="clone-faq" data-repid="'+res+'">Clone</button><button type="button" class="remove-faq" data-repid="'+res+'">Remove</button></div></div>');
    });

    $(document).on("click", ".remove-faq", function(){
        let repeaterId = $(this).attr('data-repid');
        if(repeaterId != 0) {
            $(this).parents(".clonedfaq").remove();
        }
    });

    /******************************* JQuery Related to attribute section **************************************/

    $(document).on('click', '.attribute-add-btn', function(e){
        let attributTitle       = $.trim($('.attributetitle').val());
        let dataString          = $("#addattributeform").serialize();

        if(attributTitle == '') {
            $('.attributetitle').next().show();  
        } else {
            $('.attributetitle').next().hide();
        }

        if(attributTitle == ''){
            return false;
        }
        e.preventDefault();
        $('.loader').show();
        $.ajax({
            type: "POST",
			url: '/products/add-attribute',
			dataType:'json',
            data: dataString,
            success: function(response) {
                if(response['success'] == true) {
                    $('.attributesuccess').html(response['message']);
                    $('.attributesuccess').show();
                    $('.attributedanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/products/product-attribute'; }, 5000);
                } else {
                    if(response['serialerror']) {
                        $('.attributedanger').html(response['serialerror']);
                    } else {
                        $('.attributedanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.attributedanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.attributedanger').show();
                    $('.attributesuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $(document).on('click', '.attributeterm-add-btn', function(e){
        let termTitle       = $.trim($('.termtitle').val());
        let dataString      = $("#termaddfrom").serialize();
        let attributeId     = $.trim($('.termattributeid').val());
        if(termTitle == '') {
            $('.termtitle').next().show();  
        } else {
            $('.termtitle').next().hide();
        }

        if(termTitle == ''){
            return false;
        }
        e.preventDefault();
        $('.loader').show();
        $.ajax({
            type: "POST",
			url: '/products/attribute-term/add',
			dataType:'json',
            data: dataString,
            success: function(response) {
                if(response['success'] == true) {
                    $('.termsuccess').html(response['message']);
                    $('.termsuccess').show();
                    $('.termdanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/products/attribute-term/'+attributeId; }, 5000);
                } else {
                    if(response['serialerror']) {
                        $('.termdanger').html(response['serialerror']);
                    } else {
                        $('.termdanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.termdanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.termdanger').show();
                    $('.termsuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    // get category details
    $(document).on('click', '.edit_attribute_btn', function(){
        let attributeID = $(this).attr('data-id');
        $('.loader').show();
        $.ajax({
            type:'GET',
            url: '/products/attribute-term-data/'+attributeID,
            dataType:'json',
            success: function(response) {
                if(response['success'] == true) {
                    let attributeName       = response['attributes'].name;
                    let attributeSlug       = response['attributes'].slug;
                    $('.editattributename').val(attributeName);
                    $('.editattributeslug').val(attributeSlug);
                    $('#edit_attribute_form').show();
                    $('#addattributeform').hide();
                    $("#edit_attribute_form").attr("action", "/products/attribute-term-data/" + attributeID);
                } else {
                    $('.attributedanger').html(response['message']);
                    $('.attributedanger').show();
                    $('.attributesuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $("#edit_attribute_form").on( "submit", function(e) {
        let attributTitle       = $.trim($('.editattributename').val());
        
        if(attributTitle == '') {
            $('.editattributename').next().show();  
        } else {
            $('.editattributename').next().hide();
        }
        
        if(attributTitle == ''){
            return false;
        }
        e.preventDefault();
        $('.loader').show();
        $(this).ajaxSubmit({
            data: {title: attributTitle},
            contentType: 'application/json',
            success: function(response){
                console.log(response);
                if(response['success'] == true) {
                    $('.attributesuccess').html(response['message']);
                    $('.attributesuccess').show();
                    $('.attributedanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/products/product-attribute'; }, 5000);
                } else {
                    if(response['serialerror']) {
                        $('.attributedanger').html(response['serialerror']);
                    } else {
                        $('.attributedanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.attributedanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.attributedanger').show();
                    $('.attributesuccess').hide();
                    $('.loader').hide();
                }    
            }
        });
        return false;
    });


    $(document).on('click', '.delete-attribute', function(){
        $('.loader').show();
        let id = $(this).attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/products/attribute-delete/'+id,
            success: function(response) {
                alert('Deleting Attribute');
                $('.loader').hide();
                window.location.href='/products/product-attribute';
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    /********************* Options and Settings related jQuery ************************************************/

    $("#optionaddform").on( "submit", function(e) {
        let Color          = '#fff';
        e.preventDefault();
        $('.loader').show();
        $(this).ajaxSubmit({
            data: {color: Color},
            contentType: 'application/json',
            success: function(response) {
                if(response['success'] == true) {
                    $('.settingsuccess').html(response['message']);
                    $('.settingsuccess').show();
                    $('.settingfailed').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/options/all'; }, 5000);
                } else {
                    if(response['serialerror']) {
                        $('.settingfailed').html(response['serialerror']);
                    } else {
                        $('.settingfailed').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.settingfailed').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.settingfailed').show();
                    $('.settingsuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
        return false;
    });
/****************************************** Jquery and ajax realted to Menus **********************************************/
    // $("#addmenuform").on( "submit", function(e) {
    //     let menuLabel           = $.trim($('.menulabel').val());
    //     let menuOrder           = $.trim($('.menuorder').val());
       
    //     if(menuLabel == '') {
    //         $('.menulabel').next().show();  
    //     }else{
    //         $('.menulabel').next().hide();
    //     }

    //     if(menuOrder== '') {
    //         $('.menuorder').next().show();
    //     }else{
    //         $('.menuorder').next().hide();
    //     }

    //     if(menuLabel == '' || menuOrder == ''){
    //         return false;
    //     }
    //     e.preventDefault();
    //     $('.loader').show()
    //     $(this).ajaxSubmit({
    //         data: {test: "test"},
    //         contentType: 'application/json',
    //         success: function(response){
    //             if(response['success'] == true) {
    //                 document.body.scrollTop = 0;
    //                 document.documentElement.scrollTop = 0;
    //                 $('.menusuccess').html(response['message']);
    //                 $('.menusuccess').show();
    //                 $('.menudanger').hide();
    //                 $('.loader').hide();
    //                 setTimeout(function(){ window.location.href = '/menus/all'; }, 3000);
    //             } else {
    //                 document.body.scrollTop = 0;
    //                 document.documentElement.scrollTop = 0;
    //                 if(response['serialerror']) {
    //                     $('.menudanger').html(response['serialerror']);
    //                 } else {
    //                     $('.menudanger').html('');
    //                     for (let index = 0; index < response['errors'].length; index++) {
    //                         $('.menudanger').append('</br> '+response['errors'][index].msg);
    //                     }
    //                 }
    //                 $('.menudanger').show();
    //                 $('.menusuccess').hide();
    //                 $('.loader').hide();
    //             }   
    //         }
    //     });
    //     return false;
    // });
});