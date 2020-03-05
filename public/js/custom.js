$( function() {
    $( ".first-section-date" ).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy',
        maxDate: new Date,
        minDate: new Date(2000, 6, 12)
    });

    $( ".product_expiry" ).datepicker({
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

function brandPriceChangeFunction(key) {
    var basePrice = parseInt($("#product_price-"+key).val());
    $('.brand-price-'+key).each(function(newindex){
        var originalBrandPrice = parseInt($(this).val());
        var priceDiff = parseInt($("#brand-diff-"+key+"-"+newindex).val());
        var newBrandPrice = parseInt(basePrice + priceDiff);
        $(this).val(newBrandPrice);
    });
}

function basePriceChangeFunction(loopkey, index) {
    var originalBasePrice = parseInt($("#product_price-"+loopkey).val());
    var brandPrice = parseInt($("#brand-price-"+loopkey+"-"+index).val());
    var priceDiff = parseInt(brandPrice - originalBasePrice);
    $("#brand-diff-"+loopkey+"-"+index).val(priceDiff);
}

var priceDiffChangeFunction = function(loopkey, index) {
    var originalBasePrice = parseInt($("#product_price-"+loopkey).val());
    var priceDiff = parseInt($("#brand-diff-"+loopkey+"-"+index).val());
    var newBrandPrice = parseInt(originalBasePrice + priceDiff);
    $("#brand-price-"+loopkey+"-"+index).val(newBrandPrice);
}

var retailerBrandPriceChange = function(loopkey) {
    var retailerBasePrice = parseInt($("#product_retailer_price-"+loopkey).val());
    $('.retailer-brand-price-'+loopkey).each(function(newindex){
        var originalRetailerBrandPrice = parseInt($(this).val());
        var priceDiff = parseInt($("#retailer-brand-diff-"+loopkey+"-"+newindex).val());
        var newBrandPrice = parseInt(retailerBasePrice + priceDiff);
        $(this).val(newBrandPrice);
    });
}

var retailBasePriceChange = function(loopkey, index) {
    var originalBasePrice = parseInt($("#product_retailer_price-"+loopkey).val());
    var brandPrice = parseInt($("#retailer-brand-price-"+loopkey+"-"+index).val());
    var priceDiff = parseInt(brandPrice - originalBasePrice);
    $("#retailer-brand-diff-"+loopkey+"-"+index).val(priceDiff);
}

var retailerPriceDiffChange = function(loopkey, index) {
    var originalBasePrice = parseInt($("#product_retailer_price-"+loopkey).val());
    var priceDiff = parseInt($("#retailer-brand-diff-"+loopkey+"-"+index).val());
    var newBrandPrice = parseInt(originalBasePrice + priceDiff);
    $("#retailer-brand-price-"+loopkey+"-"+index).val(newBrandPrice);
}

function save_review_status(value, reviewid, productid){
    console.log({value: value, reviewid: reviewid, productid: productid});
    jQuery('.loader').show();
    jQuery.ajax({
        type: "POST",
        url: '/products/reviews-status-update',
        dataType:'json',
        data:
            {
                productid: productid,
                status: value,
                reviewid: reviewid
            },
        success: function(response) {
            if(response['success'] == true) {
                jQuery('.statussuccess').html(response['message']);
                jQuery('.statussuccess').show();
                jQuery('.statusdanger').hide();
                jQuery('.loader').hide();
                setTimeout(function(){ window.location.href = '/products/reviews/'+productid; }, 1500);
            } else {
                if(response['serialerror']) {
                    jQuery('.statusdanger').html(response['serialerror']);
                } else {
                    jQuery('.statusdanger').html('');
                    for (let index = 0; index < response['errors'].length; index++) {
                        jQuery('.statusdanger').append('</br> '+response['errors'][index].msg);
                    }
                }
                jQuery('.statusdanger').show();
                jQuery('.statussuccess').hide();
            }
            jQuery('.loader').hide();
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function tryFunction(id){
	var a = document.getElementById(id)
	if(a.style.display == 'none'){
		a.style.display = 'block';
	}else{
		a.style.display = 'none';
	}
}

function continentCheck(){
    let x = document.getElementById('first-check')
    let yDiv = document.getElementById('select-id')
    if (x.checked == true){
        yDiv.style.display = "block";
    } else {
        yDiv.style.display = "none";
    }
}
function continentCheckHome(){
    let x = document.getElementById('first-check-home')
    let yDiv = document.getElementById('select-id-home')
    if (x.checked == true){
        yDiv.style.display = "block";
    } else {
        yDiv.style.display = "none";
    }
}
function continentCheckLayout2(){
    let x = document.getElementById('first-check-l2')
    let yDiv = document.getElementById('select-id-l2')
    if (x.checked == true){
        yDiv.style.display = "block";
    } else {
        yDiv.style.display = "none";
    }
}
function continentCheckdl(){
    let x = document.getElementById('first-check-dl')
    let yDiv = document.getElementById('select-id-dl')
    if (x.checked == true){
        yDiv.style.display = "block";
    } else {
        yDiv.style.display = "none";
    }
}
function previewCheckboxHome(){
    let x = document.getElementById('preview-sec-checkboxhome')
    let yDiv = document.getElementById('display-section-previewhome')
    if (x.checked == true){
        yDiv.style.display = "block";
    } else {
        yDiv.style.display = "none";
    }
}
function previewCheckboxlayout2(){
    let x = document.getElementById('preview-sec-checkboxl2')
    let yDiv = document.getElementById('display-section-previewl2')
    if (x.checked == true){
        yDiv.style.display = "block";
    } else {
        yDiv.style.display = "none";
    }
}

function previewCheckboxlayout1(){
    let x = document.getElementById('preview-sec-checkboxl1')
    let yDiv = document.getElementById('display-section-previewl1')
    if (x.checked == true){
        yDiv.style.display = "block";
    } else {
        yDiv.style.display = "none";
    }
}
function cloneInit(){
	jQuery(".cus-clone-btn").off().click(function(){
        var dataEl = jQuery(this).closest(".cloneable-el");
        dataEl.after(dataEl.clone())
        cloneInit();
    })
    jQuery(".cus-remove-btn").off().click(function(){
        var dataEl = jQuery(this).closest(".cloneable-el");
        var elCollection = jQuery(this).closest(".cloneable-div").find(".cloneable-el")
        if(elCollection.length > 1){
            dataEl.remove()
        }
    })
}
function imagePreviewInit(){
    jQuery(".image-selector input[type='file']").off().change(function(){
        const parent =  jQuery(this).closest(".image-selector")
        const previewWrapper = jQuery(this).closest(".image-selector").find(".image-preview");
        function filePreview(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    console.log(parent)
                    previewWrapper.empty();
                    previewWrapper.append('<img src="'+e.target.result+'" class="img-thumbnail"/>');
                }
                reader.readAsDataURL(input.files[0]);
            }else{
                previewWrapper.empty();
            }
        }
        filePreview(this)
    })
}
$(document).ready(function () {
    
    cloneInit();
    imagePreviewInit();
    
    let acc = document.getElementsByClassName("section_accordion");
    let x;
    for (x = 0; x < acc.length; x++) {
        acc[x].addEventListener("click", function() {
            this.classList.toggle("section_active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

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

    let reviewTable;
    reviewTable = jQuery('.review_table').DataTable();

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


    $(document).on('click', '.delete-product', function(){
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this Product ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'DELETE',
                        url: '/products/delete/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/products/all';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

    $(document).on('click', '.delete-coupon', function(){
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this coupon?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'GET',
                        url: '/stripe/admin/coupon/list/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/stripe/coupon/admin/list';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });


     
    
    var offerTable;
    offerTable = jQuery('.offer_detail_table').DataTable({
        dom:'Bfrtip',
        "ordering" : true,
	"sorting":true,
        "lengthChange": true,
        columnDefs: [ { type:'date-eu', 'targets': [6] } ],
            "aaSorting": [[5,'desc']],
        buttons: [
            'excel',
            'print',
            'pdf'
        ]

    })

    $(document).on('click', '.delete-user', function(){
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you want to delete this User?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'GET',
                        url: '/users/usermanagement/delete/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/users/usermanagement';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

    $(document).on('click', '.payambass', function(){
        alert("aa")
        let id = $(this).attr('data-id');
        console.log(id)
        bootbox.confirm({
            message: "Are You Sure you want to mark this as paid?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'GET',
                        url: '/ambassador-portal/pay/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.reload
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

    $(document).on('click', '.delete-combo', function(){
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this Combo ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'DELETE',
                        url: '/products/combos/delete/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/products/combos/all';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

 

    $(document).on('click', '.delete-orders', function(){
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this Order ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'DELETE',
                        url: '/orders/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/orders/all';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

    
    $(document).on('click', '.product_name_change', function(){
        $('.offer_product_name').hide();
        $('#offerproductname').show();
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
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this category ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'DELETE',
                        url: '/categories/'+id,
                        success: function(response) {
                            $('.loader').hide();
                            window.location.href='/categories/all';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

    /******************************* Pages Related Jquery and Ajax *******************************/
    $("#pageaddform").on( "submit", function(e) {
        let htmlpageLayout          = $.trim($('.page-layout').val());
        let htmlpageTitle           = $.trim($('.htmlpagetitle').val());
        if(htmlpageLayout == '') {
            $('.page-layout').next().show();  
        } else {
            $('.page-layout').next().hide();
        }

        if(htmlpageTitle == '') {
            $('.htmlpagetitle').next().show();
        }else{
            $('.htmlpagetitle').next().hide();
        }

       

        if(htmlpageLayout == '' || htmlpageTitle == ''){
            return false;
        } else {
            return true;
        }
    });


    $("#add-layout1-page").on( "submit", function(e) {
        let pageLayout          = $.trim($('.page-layout').val());
        let pageTitle           = $.trim($('.pagetitle').val());

        if(pageLayout == '') {
            $('.page-layout').next().show(); 
            alert("Page Layout is empty"); 
        }else{
            $('.page-layout').next().hide();
        }

        if(pageTitle == '') {
            $('.pagetitle').next().show();
            alert("Page Title is empty");
        }else{
            $('.pagetitle').next().hide();
        }

        if(pageLayout == '' || pageTitle == ''){
            return false;
        } else {
            return true;
        }
    });

    $("#add-home-page").on( "submit", function(e) {
        let pageLayout          = $.trim($('.page-layout').val());
        let pageTitle           = $.trim($('.homepagetitle').val());
       

        if(pageLayout == '') {
            $('.page-layout').next().show();
            alert("Page Layout is empty"); 
             
        }else{
            $('.page-layout').next().hide();
        }

        if(pageTitle == '') {
            $('.homepagetitle').next().show();
            alert("Page Title is empty");
        }else{
            $('.homepagetitle').next().hide();
        }

        

        if(pageLayout == '' || pageTitle == ''){
            return false;
        } else {
            return true;
        }
    });

    $("#layout2-page-add").on( "submit", function(e) {
        let pageLayout          = $.trim($('.page-layout').val());
        let pageTitle           = $.trim($('.layout2pagetitle').val());
        
        if(pageLayout == '') {
            $('.page-layout').next().show();
            alert("Page Layout is empty"); 
             
        }else{
            $('.page-layout').next().hide();
        }

        if(pageTitle == '') {
            $('.layout2pagetitle').next().show();
            alert("Page Title is empty");
        }else{
            $('.layout2pagetitle').next().hide();
        }

    
        if(pageLayout == '' || pageTitle == ''){
            return false;
        } else {
            return true;
        }
    });



    $("#page-edit-form").on( "submit", function(e) {
        let pageLayout          = $('.page-layout').val();
        let pageTitle           = $('.pagetitle').val();
        var pageid              = $.trim($('.page-layout').attr('data-pageid'));

        if(pageLayout == '') {
            $('.page-layout').next().show();
            alert("Page Layout is empty");  
        }else{
            $('.page-layout').next().hide();
        }

        if(pageTitle == '') {
            $('.pagetitle').next().show();
            alert("Page Title is empty");
        }else{
            $('.pagetitle').next().hide();
        }

        
        if(pageLayout == '' || pageTitle == '' ){
            return false;
        }
        e.preventDefault();
        $('.loader').show();
        $(this).ajaxSubmit({
            data: {pageTitle: pageTitle},
            contentType: 'application/json',
            success: function(response) {
                if(response['success'] == true) {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    $('.pagesuccess').html(response['message']);
                    $('.pagesuccess').show();
                    $('.pagedanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/pages/edit/'+ pageid; }, 3000);
                } else {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
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
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this Page ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'DELETE',
                        url: '/pages/'+id,
                        success: function(response) {
                            $('.loader').hide();
                            window.location.href='/pages/all';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

        
    $('.wrapper1').on('click', '.edit-remove1', function () {
        let parentId     = $(this).closest('.custom-extra-home-filed').attr('id');
        $("#"+parentId+" .results1").children().last().remove();
    });

    $(document).on('click', '.edit-clone123', function () {
        var res = 0;
        $( ".element1" ).each(function( i, val ) {
            res++;
        });
        $(".results1").append(`<div class="element1">
        <div id="page-form-group">
            <label>Second Section Title:</label>
            <input type="text" class="second-section-title" name="secondtitle[]" value="" autocomplete="off">
        </div>
        <div id="page-form-group">
            <label>Second Section Description:</label>
            <textarea class="second-section-description"
                name="seconddescription[]"></textarea>
        </div>
        <div id="page-form-group">
            <div class="image-label-section">
                <label>Second Section Image:</label>
            </div>
            <div class="image-field-section second-image-section" id="second_image_${res}">
            <div class="image-selector">
                <input type="hidden" class="second-img-link" name="secondimagelink[]" value="" autocomplete="off">
                <input type="file" class="second-section-image" name="secondimage${res}" value="" autocomplete="off">
                <div class="image-preview"></div>
            </div>
        </div>
        </div>`);
    });

    $('.wrapper').on('click', '.remove', function () {
        $('.remove').closest('.wrapper').find('.element').not(':first').last().remove();
    });
    $('.wrapper').on('click', '.clone', function () {
        $('.clone').closest('.wrapper').find('.element').first().clone().appendTo('.results');
    });


    $('.wrapper').on('click', '.edit_remove', function () {
        // $(this).closest('.wrapper').find('.element').not(':first').last().remove();
        let prarentid = $(this).attr('data-remove-id');
        $('#'+prarentid).remove();
        //$('.results').children().last().remove();
    });

    // $(document).on('click', '.edit_clone12', function () {
    //     // let sectionValue = $(this).closest('.custom-extra-home-filed').attr('data-section');
    //     // let parentId     = $(this).closest('.custom-extra-home-filed').attr('id');
    //     var res = 0;
    //     $( "#"+parentId+" .element" ).each(function( i, val ) {
    //         res++;
    //     });
    //     $("#"+parentId+" .results").append(`<div class="element" id="${sectionValue}third_rep_field_${res}">
    //     <div id="page-form-group">
    //         <label>Third Section Title:</label>
    //         <input type="text" class="third-section-title" name="${sectionValue}thirdtitle[]" value="" autocomplete="off">
    //     </div>
    //     <div id="page-form-group">
    //         <label>Third Section Description:</label>
    //         <textarea class="third-section-description" name="${sectionValue}thirddescription[]"></textarea>
    //     </div>
    //     <div id="page-form-group">
    //         <label>Third Section Button Text:</label>
    //         <input type="text" class="third-section-buttontext" name="${sectionValue}thirdbtntext[]" value="" autocomplete="off">
    //     </div>
    //     <div id="page-form-group">
    //         <label>Third Section Button Link:</label>
    //         <input type="text" class="third-section-btnlink" name="${sectionValue}thirdbtnlink[]" value="" autocomplete="off">
    //     </div>
    //     <div id="page-form-group">
    //         <div class="image-label-section">
    //             <label>Third Section Image:</label>
    //         </div>
    //         <div class="image-field-section third-image-section" id="third_image_${res}">
    //             <input type="hidden" class="third-img-link" name="${sectionValue}thirdimagelink[]" value="" autocomplete="off">
    //             <input type="file" class="third-section-image" name="${sectionValue}thirdimage${res}" value="" autocomplete="off">
    //         </div>
    //     </div>
    //     <div class="buttons">
    //         <button type="button" class="btn btn-primary edit_clone">clone</button>
    //         <button type="button" class="btn btn-danger edit_remove" data-remove-id="${sectionValue}third_rep_field_${res}">remove</button>
    //     </div>
    // </div>`);
    // });

    $(document).on('click', '.edit_clone12', function () {
        var res = 0;
        $( ".element" ).each(function( i, val ) {
            res++;
        });
        $(".results").append(`<div class="element" id="third_rep_field_${res}">
        <div id="page-form-group">
            <label>Third Section Title:</label>
            <input type="text" class="third-section-title" name="thirdtitle[]" value="" autocomplete="off">
        </div>
        <div id="page-form-group">
            <label>Third Section Description:</label>
            <textarea class="third-section-description" name="thirddescription[]"></textarea>
        </div>
        <div id="page-form-group">
            <label>Third Section Button Text:</label>
            <input type="text" class="third-section-buttontext" name="thirdbtntext[]" value="" autocomplete="off">
        </div>
        <div id="page-form-group">
            <label>Third Section Button Link:</label>
            <input type="text" class="third-section-btnlink" name="thirdbtnlink[]" value="" autocomplete="off">
        </div>
        <div id="page-form-group">
            <div class="image-label-section">
                <label>Third Section Image:</label>
            </div>
            <div class="image-field-section third-image-section" id="third_image_${res}">
            <div class="image-selector">
                <input type="hidden" class="third-img-link" name="thirdimagelink[]" value="" autocomplete="off">
                <input type="file" class="third-section-image" name="thirdimage${res}" value="" autocomplete="off">
                <div class="image-preview"></div>
            </div>
        </div>
           
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-primary edit_clone12">clone</button>
            <button type="button" class="btn btn-danger edit_remove" data-remove-id="third_rep_field_${res}">remove</button>
        </div>
    </div>`);
    });




    $('.wrapper2').on('click', '.remove2', function () {
        $('.remove2').closest('.wrapper2').find('.element2').not(':first').last().remove();
    });
    $('.wrapper2').on('click', '.clone2', function () {
        $('.clone2').closest('.wrapper2').find('.element2').first().clone().appendTo('.results2');
    });

    // $(".third-section-image").change(function(e) {
    //     if($(this).val()){
    //         let parentId = $(this).closest('.third-image-section').prop('id');
    //         $('#'+parentId+' .third-img-link').val('');
    //     }
    // });

    // $(".fourth-section-image").change(function(e) {
    //     if($(this).val()){
    //         let parentId = $(this).closest('.fourth-img-section').prop('id');
    //         $('#'+parentId+' .fourth-img-link').val('');
    //     }
    // });

    // $(document).on('click', '.edit_clone2', function () {
     
    //     var res = 0;
    //     $( ".element2" ).each(function( i, val ) {
    //         res++;
    //     });
    //     $("#"+parentId+" .results2").append(`<div class="element2" id="${sectionValue}fourth_rep_field_${res}">
    //         <div id="page-form-group">
    //             <label>Fourth Section Title:</label>
    //             <input type="text" class="fourth-section-title" name="${sectionValue}fourthtitle[]" value="" autocomplete="off">
    //         </div>
    //         <div id="page-form-group">
    //             <label>Fourth Section Author:</label>
    //             <input type="text" class="fourth-section-author" name="${sectionValue}fourthauthor[]" value="" autocomplete="off">
    //         </div>
    //         <div id="page-form-group">
    //             <label>Fourth Section Description:</label>
    //             <textarea class="fourth-section-description" name="${sectionValue}fourthdescription[]"></textarea>
    //         </div>
    //         <div id="page-form-group">
    //             <div class="image-label-section">
    //                 <label>Fourth Section Image:</label>
    //             </div>
    //             <div class="image-field-section fourth-img-section" id="fourth_img_${res}">
    //                 <input type="hidden" class="fourth-img-link" name="${sectionValue}fourthimagelink[]" value="" autocomplete="off">
    //                 <input type="file" class="fourth-section-image" name="${sectionValue}fourthimage${res}" value="" autocomplete="off">
    //             </div>
    //             <div id="page-form-group">
    //                 <label id="label-section">Fourth Section Twitter:</label>
    //                 <input type="text" class="fourth-section-twitter scl-extra" name="${sectionValue}fourthtwitter[]" value="" autocomplete="off">
    //             </div>
    //             <div id="page-form-group">
    //                 <label id="label-section">Fourth Section Insta:</label>
    //                 <input type="text" class="fourth-section-insta scl-extra" name="${sectionValue}fourthinsta[]" value="" autocomplete="off">
    //             </div>
    //             <div id="page-form-group">
    //                 <label id="label-section">Fourth Section Facebook:</label>
    //                 <input type="text" class="fourth-section-facebook scl-extra" name="${sectionValue}fourthfb[]" value="" autocomplete="off">
    //             </div>
    //         </div>
    //         <div class="buttons">
    //             <button type="button" class="btn btn-primary edit_clone2">clone</button>
    //             <button type="button" class="btn btn-danger edit_remove2" data-remove-id="${sectionValue}fourth_rep_field_${res}">remove</button>
    //         </div>
    // </div>`);
    // });


    $(document).on('click', '.edit_clone2', function () {
        var res = - 1;
        $( ".element2" ).each(function( i, val ) {
            res++;
        });
        $(".results2").append(`<div class="element2" id="fourth_rep_field_${res}">
            <div id="page-form-group">
                <label>Fourth Section Title:</label>
                <input type="text" class="fourth-section-title" name="fourthtitle[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Author:</label>
                <input type="text" class="fourth-section-author" name="fourthauthor[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Description:</label>
                <textarea class="fourth-section-description" name="fourthdescription[]"></textarea>
            </div>
            <div id="page-form-group">
                <div class="image-label-section">
                    <label>Fourth Section Image:</label>
                </div>
                <div class="image-field-section fourth-img-section" id="fourth_img_${res}">
                    <input type="hidden" class="fourth-img-link" name="fourthimagelink[]" value="" autocomplete="off">
                    <input type="file" class="fourth-section-image" name="fourthimage${res}" value="" autocomplete="off">
                </div>
            </div>
            <div id="page-form-group">
                <label>Fourth Section Twitter:</label>
                <input type="text" class="fourth-section-twitter" name="fourthtwitter[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Insta:</label>
                <input type="text" class="fourth-section-insta" name="fourthinsta[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Facebook:</label>
                <input type="text" class="fourth-section-facebook" name="fourthfb[]" value="" autocomplete="off">
            </div>
            <div class="buttons">
                <button type="button" class="btn btn-primary edit_clone2">clone</button>
                <button type="button" class="btn btn-danger edit_remove2" data-remove-id="fourth_rep_field_${res}">remove</button>
            </div>
    </div>`);
    });

    $(document).on('click', '.edit_clone222', function () {
        var res = 0;
        $( ".element2" ).each(function( i, val ) {
            res++;
        });
        $(".results2").append(`<div class="element2" id="fourth_rep_field_${res}">
            <div id="page-form-group">
                <label>Fourth Section Title:</label>
                <input type="text" class="fourth-section-title" name="fourthtitle[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Author:</label>
                <input type="text" class="fourth-section-author" name="fourthauthor[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Description:</label>
                <textarea class="fourth-section-description" name="fourthdescription[]"></textarea>
            </div>
            <div id="page-form-group">
                <div class="image-label-section">
                    <label>Fourth Section Image:</label>
                </div>
                <div class="image-field-section fourth-img-section" id="fourth_img_${res}">
                    <input type="hidden" class="fourth-img-link" name="fourthimagelink[]" value="" autocomplete="off">
                    <input type="file" class="fourth-section-image" name="fourthimage${res}" value="" autocomplete="off">
                </div>
            </div>
            <div id="page-form-group">
                <label>Fourth Section Twitter:</label>
                <input type="text" class="fourth-section-twitter" name="fourthtwitter[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Insta:</label>
                <input type="text" class="fourth-section-insta" name="fourthinsta[]" value="" autocomplete="off">
            </div>
            <div id="page-form-group">
                <label>Fourth Section Facebook:</label>
                <input type="text" class="fourth-section-facebook" name="fourthfb[]" value="" autocomplete="off">
            </div>
            <div class="buttons">
                <button type="button" class="btn btn-primary edit_clone222">clone</button>
                <button type="button" class="btn btn-danger edit_remove222" data-remove-id="fourth_rep_field_${res}">remove</button>
            </div>
    </div>`);
    });

    $(document).on('click', '.edit_remove222', function () {
        // $('.results2').children().last().remove();
        let prarentid = $(this).attr('data-remove-id');
        $('#'+prarentid).remove();        			        
    });



    $(document).on('click', '.edit_remove2', function () {
        // $('.results2').children().last().remove();
        let prarentid = $(this).attr('data-remove-id');
        $('#'+prarentid).remove();        			        
    });

    $("#option1").show();
    $(document).on('change', '#size_select', function () {
        $('.size_chart').hide();
        $('#' + $(this).val()).show();
    });

    // 1 Model
    var $lightbox = $('#lightbox');
    $('[data-target="#lightbox"]').on('click', function (event) {
        var $img = $(this).find('img'),
            src = $img.attr('src'),
            alt = $img.attr('alt'),
            css = {
                'maxWidth': $(window).width() - 100,
                'maxHeight': $(window).height() - 100
            };
            
        $lightbox.find('img').attr('src', src);
        $lightbox.find('img').attr('alt', alt);
        $lightbox.find('img').css(css);
    });
    $lightbox.on('shown.bs.modal', function (e) {
        var $img = $lightbox.find('img');
        $lightbox.find('.modal-dialog').css({ 'width': $img.width() });
        $lightbox.find('.close').removeClass('hidden');
        $('body').removeAttr('style');
    });
    $lightbox.on('hidden.bs.modal', function (e) {
        $('body').removeAttr('style');
      })
    $(document).on('click', '.l2_second_clone', function () {
        let sectionValue = $(this).closest('.layout2-fields').attr('data-section');
        let parentId     = $(this).closest('.layout2-fields').attr('id');
        var res = 0;
        $( "#"+parentId+" .layout2_second_element" ).each(function( i, val ) {
            res++;
        });
        $("#"+parentId+" .section_two_clone").append(`<div class="layout2_second_element" id="${sectionValue}layout2_second_element_${res}">
        <div id="page-form-group">
            <label>Second Section Title:</label>
            <input type="text" class="second-section-title" name="${sectionValue}secondtitle[]" value="" autocomplete="off">
        </div>
        <div id="page-form-group">
            <label>Second Section Sub Title:</label>
            <textarea class="second-section-subtitle" name="${sectionValue}secondsubtitle[]"></textarea>
        </div>
        <div class="second_cloned_wrapper clearfix">
            <div class="diseases_cloned">
                <div id="page-form-group">
                    <label>Second Section Diseases Name:</label>
                    <input type="text" class="second-section-diseases" name="${sectionValue}seconddiseases[${res}][]" value="" autocomplete="off">
                </div>
                <div class="buttons">
                    <button type="button" class="btn btn-primary l2_s_diseases_clone" data-section="${res}">Clone</button>
                </div>
            </div>
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-primary l2_second_clone">Clone</button>
            <button type="button" class="btn btn-danger l2_second_remove" data-remove-id="${sectionValue}layout2_second_element_${res}">Remove</button>
        </div>
        </div>`);
    });

    $(document).on('click', '.l2_second_remove', function () {
        let prarentid = $(this).attr('data-remove-id');
        $('#'+prarentid).remove();        			        
    });


    $(document).on('click', '.l2_s_diseases_clone', function () {
        let parentID = $(this).closest('.layout2_second_element').prop('id');
        let sectionValue = $(this).closest('.layout2-fields').attr('data-section');
        var res = 0;
        $(".diseases_cloned").each(function( i, val ) {
            res++;
        });
        let section = $(this).attr('data-section');
        $("#"+parentID+" .second_cloned_wrapper").append(`<div class="diseases_cloned" id="${sectionValue}diseases_cloned_${res}">
        <div id="page-form-group">
            <label>Second Section Diseases Name:</label>
            <input type="text" class="second-section-diseases" name="${sectionValue}seconddiseases[${section}][]" value="" autocomplete="off">
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-primary l2_s_diseases_clone" data-section="${section}">Clone</button>
            <button type="button" class="btn btn-danger l2_s_diseases_remove" data-remove-id="${sectionValue}diseases_cloned_${res}">Remove</button>
        </div>
        </div>`);
    });

    $(document).on('click', '.l2_s_diseases_remove', function () {
        let prarentid = $(this).attr('data-remove-id');
        $('#'+prarentid).remove();        			        
    });

    $(document).on('click', '.l2_third_clone', function () {
        let sectionValue = $(this).closest('.layout2-fields').attr('data-section');
        let parentId     = $(this).closest('.layout2-fields').attr('id');
        var res = 0;
        $( "#"+parentId+" .third_diseases_cloned" ).each(function( i, val ) {
            res++;
        });
        $("#"+parentId+" .third_cloned_wrapper").append(`<div class="third_diseases_cloned" id="${sectionValue}third_diseases_cloned_${res}">
        <div id="page-form-group">
            <label>Third Section Diseases Name:</label>
            <input type="text" class="third-section-diseases" name="${sectionValue}thirddiseases[]" value="" autocomplete="off">
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-primary l2_third_clone">Clone</button>
            <button type="button" class="btn btn-danger l2_third_remove" data-remove-id="${sectionValue}third_diseases_cloned_${res}">Remove</button>
        </div>
        </div>`);
    });

    $(document).on('click', '.l2_third_remove', function () {
        let prarentid = $(this).attr('data-remove-id');
        $('#'+prarentid).remove();        			        
    });

    $(document).on('click', '.l2_fourth12', function () {
        var res = 0;
        $( ".fourth_element" ).each(function( i, val ) {
            res++;
        });
        if($( ".fourth_element" ).length < 10)
        $(".fourth_results").append(`<div class="fourth_element" id="fourth_element_${res}">
        <div id="page-form-group">
            <label>Fourth Section Title:</label>
            <input type="text" class="fourth-section-title" name="fourthtitle[]" value="" autocomplete="off">
        </div>
        <div id="page-form-group">
            <div class="image-label-section">
                <label>Fourth Section Image:</label>
            </div>
            <div class="image-field-section image-field-section fourth-img-section">
                <input type="hidden" class="fourth-img-link" name="fourthimagelink[]" value="" autocomplete="off">
                <input type="file" class="fourth-section-image" name="fourthimage${res}" value="" autocomplete="off">
            </div>                                    
        </div>
        <div id="page-form-group">
            <label>Fourth Section Image Link:</label>
            <input type="text" class="fourth-section-link" name="fourthlink[]" value="" autocomplete="off">
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-primary l2_fourth12">Clone</button>
            <button type="button" class="btn btn-danger l2_fourth_remove" data-remove-id="fourth_element_${res}">Remove</button>
        </div>
        </div>`);
        else {alert("You cant clone this section more times")}
    });

    $(document).on('click', '.l2_fourth_remove', function () {
        let prarentid = $(this).attr('data-remove-id');
        $('#'+prarentid).remove();        			        
    });
   
    /******************************* JQuery Related to product section *******************************/
    $(document).on( "click", ".manage_stock", function(e) {
        if($(this).is(':checked')) {
            $('.stock_fields').show();
            $('.stock_status_field').show();
        } else {
            $('.stock_fields').hide();
            $('.stock_status_field').hide();
        }  
    });    

    $("#addproductform").on( "submit", function(e) {
        let title               = $.trim($('#producttitle').val());
        // let barcode             = $.trim($('#barcode').val());
        let visibilityType      = $.trim($('#visibility-type').val());
        let defRegularPrice     = $.trim($('#def_regular_price').val());
        let defSalePrice        = $.trim($('#def_sale_price').val());
        let prodSku             = $.trim($('#prod_sku').val());
        let category            = $.trim($('.prod-cat').val());
        let productType         = $.trim($('#product-type').val());

        if(title == '') {
            $('#producttitle').next().show();
            
        }else{
            $('#producttitle').next().hide();
        }

        if(prodSku == '') {
            $('.sku_error').show();
            
        }else{
            $('.sku_error').hide();
        }

        // if(barcode == '') {
        //     $('#barcode').next().show();
        // }else{
        //     $('#barcode').next().hide();
        // }

        if(visibilityType == '') {
            $('#visibility-type').next().show();
            
        }else{
            $('#visibility-type').next().hide();
        }

        if(defRegularPrice== '') {
            $('.regular_price_error').show();
            
        }else{
            $('.regular_price_error').hide();
        }

        if(defSalePrice== '') {
            $('#def_sale_price').next().show();
            
        }else{
            $('#def_sale_price').next().hide();
        }

        if(category== '') {
            $('.prod-cat-error').show();
            
        } else {
            $('.prod-cat-error').hide();
        }
        if(productType == 'variable') {
            if ($('div.woocommerce_attribute').length == 0) {
                $('.attributeserror').show();
            } else {
                $('.attributeserror').hide();
            }
    
            if ($('div.woocommerce_variation').length == 0) {
                $('.variationserror').show();
            } else {
                $('.variationserror').hide();
            }
            let validationFlag = true;
            $("div.woocommerce_variation").each(function( i, val ) {
                let variationID = $(this).attr('id');
                let variationAttrValue = $('#'+variationID+' .variation_attribute_name').val();
                let barValue           = $('#'+variationID+' .variable_bar_field').val();
                let skuValue           = $('#'+variationID+' .variable_sku_field').val();
                let regularPrice       = $('#'+variationID+' .variation_price_field').val();
                if(variationAttrValue == '') {
                    $('#'+variationID+' .attribute_error').show();
                } else {
                    $('#'+variationID+' .attribute_error').hide();
                }

                if(barValue == '') {
                    $('#'+variationID+' .variable_bar_field').next().show();
                } else {
                    $('#'+variationID+' .variable_bar_field').next().hide();
                }

                if(skuValue == '') {
                    $('#'+variationID+' .variable_sku_field').next().show();
                } else {
                    $('#'+variationID+' .variable_sku_field').next().hide();
                }

                if(regularPrice == '') {
                    $('#'+variationID+' .variation_price_field').next().show();
                } else {
                    $('#'+variationID+' .variation_price_field').next().hide();
                }
                console.log({
                    variationAttrValue,
                    skuValue,
                    regularPrice,
                    barValue
                });
                if(variationAttrValue == '' || skuValue== '' || regularPrice == ''){
                    validationFlag = false;
                }
            });
            if($('div.woocommerce_attribute').length == 0 || $('div.woocommerce_variation').length == 0){
                return false;
            }
            if(validationFlag == false){
                return false;
            }
        }

        if(title == '' || prodSku== '' || visibilityType == '' || defRegularPrice== '' || defSalePrice== '' || category== ''){
            return false;
        }
        e.preventDefault();
        $('.loader').show();
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
                    $('.loader').hide();
                }   
            }
        });
        return false;
    });

    $(document).on('keyup', '#def_sale_price', function(){
        let salePrice = parseInt($.trim($(this).val()));
        let defRegularPrice     = parseInt($.trim($('#def_regular_price').val()));
        if(defRegularPrice != '') {
            if(salePrice >= defRegularPrice){
                $(this).next().show();
            } else {
                $(this).next().hide();
            }
        }
    });

    $(document).on('keyup', '#e_d_sale_price', function(){
        let esalePrice           = parseInt($.trim($(this).val()));
        let edefRegularPrice     = parseInt($.trim($('#e_prod_dregular_price').val()));
        if(edefRegularPrice != '') {
            if(esalePrice >= edefRegularPrice){
                $(this).next().show();
            } else {
                $(this).next().hide();
            }
        }
    });

    $("#editproductform").on( "submit", function(e) {
        let title               = $.trim($('.editproducttitle').val());
        let visibilityType      = $.trim($('.edit_prod_visibility').val());
        let defRegularPrice     = $.trim($('#e_prod_dregular_price').val());
        let defSalePrice        = $.trim($('#e_d_sale_price').val());
        let prodSku             = $.trim($('#edit_prod_sku').val());
        let category            = $.trim($('.edit_prod_cat').val());
        let prodMetaID          = $.trim($('#editproductid').attr('data-prodmeta-id'));
        let productType         = $.trim($('#product-type').val());

        if(title == '') {
            $('.editproducttitle').next().show();
            
        }else{
            $('.editproducttitle').next().hide();
        }

       

        if(prodSku == '') {
            $('.sku_error').show();
        }else{
            $('.sku_error').next().hide();
        }

        if(visibilityType == '') {
            $('.edit_prod_visibility').next().show();
            
        }else{
            $('.edit_prod_visibility').next().hide();
        }

        if(defRegularPrice== '') {
            $('.regular_price_error').show();
            
        }else{
            $('.regular_price_error').hide();
        }

        if(category== '') {
            $('.edit_prod_cat').next().show();
            
        }else{
            $('.edit_prod_cat').next().hide();
        }

        if(defSalePrice== '') {
            $('#def_sale_price').next().show();
            
        }else{
            $('#def_sale_price').next().hide();
        }

        if(productType == 'variable') {
            if ($('div.woocommerce_attribute').length == 0) {
                $('.attributeserror').show();
            } else {
                $('.attributeserror').hide();
            }

            if ($('div.woocommerce_variation').length == 0) {
                $('.variationserror').show();
            } else {
                $('.variationserror').hide();
            }
            let editValidationFlag = true;
            $("div.woocommerce_variation").each(function( i, val ) {
                let editVariationID = $(this).attr('id');
                let editVariationAttrValue = $('#'+editVariationID+' .variation_attribute_name').val();
                let editBarValue           = $('#'+editVariationID+' .variable_bar_field').val();
                let editSkuValue           = $('#'+editVariationID+' .variable_sku_field').val();
                let editRegularPrice       = $('#'+editVariationID+' .variation_price_field').val();
                if(editVariationAttrValue == '') {
                    $('#'+editVariationID+' .attribute_error').show();
                } else {
                    $('#'+editVariationID+' .attribute_error').hide();
                }
                    
                if(editSkuValue == '') {
                    $('#'+editVariationID+' .variable_sku_field').next().show();
                } else {
                    $('#'+editVariationID+' .variable_sku_field').next().hide();
                }
                if(editBarValue == '') {
                    $('#'+editVariationID+' .variable_bar_field').next().show();
                } else {
                    $('#'+editVariationID+' .variable_bar_field').next().hide();
                }
                if(editRegularPrice == '') {
                    $('#'+editVariationID+' .variation_price_field').next().show();
                } else {
                    $('#'+editVariationID+' .variation_price_field').next().hide();
                }
                console.log({
                    editVariationAttrValue,
                    editSkuValue,
                    editRegularPrice
                })
                if(editVariationAttrValue == '' || editSkuValue== '' || editRegularPrice == ''){
                    editValidationFlag = false;
                }
            });
            if( $('div.woocommerce_attribute').length == 0 || $('div.woocommerce_variation').length == 0 ){
                return false;
            }
            if(editValidationFlag == false){
                return false;
            }
        }
        
        if(title == '' || prodSku== '' || visibilityType == '' || defRegularPrice== '' || defSalePrice== '' || category== ''){
            return false;
        }

        e.preventDefault();
        $('.loader').show();
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
                    setTimeout(function(){ window.location.href = '/products/edit/'+prodMetaID; }, 3000);
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
                    $('.loader').hide();
                }   
            }
        });
        return false;
    });

    $(document).on("click", ".clone", function(){
        var res = 0;
        $( ".clonedInput" ).each(function( i, val ) {
            res++;
        });
        console.log('res value'+res);
        $(".gallery-image-section .section-inside").append(`<div id="clonedInput${res}" class="clonedInput">
            <div class="gallery-image-holder"></div>
            <div class="prod-gallery-rept">
                <input type="file" name="product_gallery_img[${res}]" class="product-gallery-img" data-repid="${res}" id="product_gallery_img_${res}">
            </div>
            <div class="actions">
                <button type="button" class="btn btn-primary clone" data-repid="${res}">Clone</button>
                <button type="button" class="btn btn-danger remove" data-repid="${res}">Remove</button>
            </div>
        </div>
        `);
    });

    $(document).on("click", ".clone-edit", function(){
        var res = 0;
        $( ".clonedInput" ).each(function( i, val ) {
            res++;
        });
        $(".gallery-image-section .section-inside .gallery_ul").append(`<li class="galleryimg" id="gallery_li_${res}">
            <div id="clonedInput${res}" class="clonedInput">
                <div class="gallery-image-holder"></div>
                <div class="prod-gallery-rept">
                    <input type="file" name="product_gallery_img[${res}]" class="product-gallery-img" data-repid="${res}" id="product_gallery_img_${res}">
                </div>
                <div class="actions">
                    <button type="button" class="btn btn-primary clone-edit" data-repid="${res}">Clone</button>
                    <button type="button" class="btn btn-danger remove" data-repid="${res}">Remove</button>
                </div>
            </div>
        </li>`);
    });

    $(document).on("click", ".remove", function(){
        let repeaterId = $(this).attr('data-repid');
        if(repeaterId != 0) {
            $(this).parents(".clonedInput").remove();
        }
    });

    $(document).on('click', '.product_data_tabs li a', function() {
        let tabValue = $(this).attr('data-tab-id');
        $(this).parent().siblings().children('a').removeClass('active');
        $(this).addClass('active');
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

                    let attributeHtml   = `
                    <div data-taxonomy="${attributeSelect}" class="woocommerce_attribute" rel="${dataRel}" id="attribute-${attributeSelect}" data-terms-selected="">
                        <h3>
                            <a href="javascript:void(0)" class="btn btn-danger remove_row delete">Remove</a>
                            <div class="handlediv" title="Click to toggle"></div>
                            <strong class="attribute_name">${attributeName}</strong>
                        </h3>
                        <div class="woocommerce_attribute_data wc-metabox-content" style="">
                            <table cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td class="attribute_name">
                                            <label>Name:</label><strong>${attributeName}</strong>
                                            <input type="hidden" name="attribute[${dataRel}][names]" value="${attributeSelect}">
                                        </td>
                                        <td rowspan="3">
                                            <label>Value(s):</label>
                                            <select multiple="multiple" class="multiselect attribute_values js-example-basic-multiple" name="attribute[${dataRel}][values]" style="width: 100%;">`;
                                            Object.keys(attributeObj).forEach(async function eachKey(key) {
                                                attributeHtml   += `
                                                <option value="${attributeObj[key].slug}">${attributeObj[key].name}</option>`;
                                            });
                        attributeHtml   += `</select>
                                            <button type="button" class="btn btn-primary button plus select_all_attributes">Select all</button>
                                            <button type="button" class="btn btn-primary button minus select_no_attributes">Select none</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>`;
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


    $(document).on('click', '.save_attributes', function(){
        $('.loader').show();
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
                let defaultAttribute = `
                <select name="default_atttribute[${taxonomyName}]">
                    <option value="">Please Select Variation</option>`;
                    $.each(arr,function(key,value){
                        defaultAttribute   += `<option value="${key}">${value}</option>`;
                    });       
                defaultAttribute   += `
                </select>`;
                $('.default-value-container').append(defaultAttribute);
                $('.variable-add-toolbar').show();
                $('.toolbar-variations-defaults').show();
                $('.initial_variable_message').hide();
            } 
        });
        setTimeout(function(){ $('.loader').hide(); }, 1500);
    });

    $(document).on('click', '.do_variation_action', function(){
        let dataVariationRel = $(this).attr('data-variation-rel');
        let variationNumber = parseInt(dataVariationRel) + 1;
        let variatonHtml = `
        <div class="woocommerce_variation wc-metabox open" id="product_variation-${variationNumber}">
            <h3>
                <a href="javascript:void(0)" class="btn btn-danger remove_variation delete" rel="product_variation-${variationNumber}">Remove</a>
                <div class="handlediv" aria-label="Click to toggle"></div>
                <div class="tips sort"></div>
                <div class="variation_fields_section"></div>`;
                $('.woocommerce_attribute').each(function(newindex){
                    let elementId = $(this).prop('id');
                    let selected = {};
                    $("#"+elementId+" .attribute_values option").each(function() {
                        if (this.selected) {
                            selected[this.value] = this.text;
                        }
                    });
                    let myJSON = JSON.stringify(selected);
                    $("#"+elementId).attr("data-terms-selected", myJSON);
                    let data = $(this).attr("data-terms-selected");
                    if($(this).attr("data-terms-selected") != "") {
                        let taxonomyName = $(this).attr("data-taxonomy");
                        let arr = $.parseJSON(data);
                        let defaultAttribute = `<select name="variaton_atttribute[${variationNumber}][${taxonomyName}]" class="variation_attribute_name"><option value="">Please Select ${taxonomyName}</option>`;
                        $.each(arr,function(key,value){
                            defaultAttribute   += `<option value="${key}">${value}</option>`;
                        });       
                        defaultAttribute   += `</select>`;
                        variatonHtml += defaultAttribute;
                    } 
                });
        variatonHtml   += `
            <span class="form_error attribute_error">Please Select Variation Attribute Name</span>
            </h3>`;
        variatonHtml   += `
        <div class="woocommerce_variable_attributes wc-metabox-content">
            <div class="data">
                <p class="form-field variable_sku${variationNumber}_field form-row form-row-last">
                    <label for="variable_sku${variationNumber}">
                        <abbr title="Stock Keeping Unit">SKU</abbr>
                    </label>
                    <input type="text" class="short variable_sku_field" style="" name="variaton_atttribute[${variationNumber}][sku]" id="variable_sku${variationNumber}" value="" placeholder="">
                    <span class="form_error">Please Select Variation SKU</span>
                </p>`;
                   variatonHtml   += `
            <div class="woocommerce_variable_attributes wc-metabox-content">
                <div class="data">
                    <p class="form-field variable_sku${variationNumber}_field form-row form-row-last">
                        <label for="variable_sku${variationNumber}">
                            <abbr title="Stock Keeping Unit">Barcode</abbr>
                        </label>
                        <input type="text" class="short variable_bar_field" style="" name="variaton_atttribute[${variationNumber}][bar]" id="variable_barcode${variationNumber}" value="" placeholder="">
                        <span class="form_error">Please enter barcode</span>
                    </p>`;
        variatonHtml   += `<div class="variable_pricing">
                <p class="form-field variable_regular_price_${variationNumber}_field form-row form-row-first">
                    <label for="variable_regular_price_${variationNumber}">Regular price</label>
                    <input type="number" class="short wc_input_price variation_price_field" name="variaton_atttribute[${variationNumber}][regular_price]" id="variable_regular_price_${variationNumber}" value="" placeholder="Variation price (required)" step=".01">
                    <span class="form_error">Please Select Variation Price</span>
                </p>`;
        variatonHtml   += `
                <p class="form-field variable_sale_price${variationNumber}field form-row form-row-last">
                    <label for="variable_sale_price${variationNumber}">Sale price</label>
                    <input type="number" class="short wc_input_price" name="variaton_atttribute[${variationNumber}][sale_price]" id="variable_sale_price${variationNumber}" value="" placeholder="" step=".01">
                </p>`;
        variatonHtml   += `
            </div>
        </div>
        </div>`;
        $(".woocommerce_variations").append(variatonHtml);
        $(".attribute-save-container").show();
        $(this).attr("data-variation-rel", variationNumber);
    });

    $(document).on('click', '.remove_row', function(){
        let attributeId = $(this).closest('.woocommerce_attribute').prop('id');
        console.log({
            attributeId
        })
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
        
        $(".faq-section .section-inside").append(`<div id="clonedfaq${res}" class="clonedfaq">
        <div class="faq-question-rept">
            <div class="faq-label">
                <label>FAQ Title ${res}</label>
                <input type="text" name="faq[${res}][title]" class="faq-title-field" data-repid="${res}">
            </div>
            <div class="faq-description">
                <label>FAQ Descripiton ${res}</label>
                <textarea class="form-control" name="faq[${res}][description]" class="faq-description-field" row="5" column="5"></textarea>
            </div>
            <div class="actions">
                <button type="button" class="btn btn-primary clone-faq" data-repid="${res}">Clone</button>
                <button type="button" class="btn btn-danger remove-faq" data-repid="${res}">Remove</button>
            </div>
        </div>
    </div>`);
    });

    $(document).on("click", ".remove-faq", function(){
        let repeaterId = $(this).attr('data-repid');
        if(repeaterId != 0) {
            $(this).parents(".clonedfaq").remove();
        }
    });


   $(document).on("change", ".creative-feature-img", function(){
        if (typeof (FileReader) != "undefined") {
            var image_holder = $("#image-holder-cr");
            image_holder.empty();
            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image img-thumbnail"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
    });

 $(document).on("change", ".menu-feature-img", function(){
        if (typeof (FileReader) != "undefined") {
            var image_holder = $("#menu-image-holder");
            image_holder.empty();
            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image img-thumbnail"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
    });


    $(document).on("change", ".prod-feature-img", function(){
        if (typeof (FileReader) != "undefined") {
            var image_holder = $("#image-holder");
            image_holder.empty();
            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image img-thumbnail"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
    });

    $(document).on("change", ".sectionb", function(){
        if (typeof (FileReader) != "undefined") {
            var image_holder = $("#imgd");
            image_holder.empty();
            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image img-thumbnail"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
    });


    $(document).on("click", ".change-feature-img", function(){
        $('.image_section').show();
    });

    $(document).on("click", ".change-menu-img", function(){
        $('.menu_image_section1').show();
    });


    $(document).on("click", ".change-sectionb-img", function(){
        $('.image_sectionb').show();
        $('.sectionb_image_section img').hide();
        $('[name="sectionbimage"]').trigger("click")
    });

     $(document).on("click", ".change-labsheet", function(){
        $('.labsheet_sectionb').show();
        $('.sectionb_labsheet_section').hide();
        $('[name="labsheet"]').trigger("click")
    });

//Remove combos image
$(document).on("click", ".remove-combofeature-img", function(){
    $('.image_section_combo').show();
    $('.feature_image_section_combo').hide();
    $('.remove_feature_combo').val(1);
    $('.loader').show();
    let productid = $(this).attr('data-prod-id');
    let action = $(this).attr('data-action');
    $.ajax({
        type: "POST",
        url: '/products/combos/removeimage',
        dataType:'json',
        data:
        {
            productid: productid,
            action: action
        },
        success: function(response) {
            if(response['success'] == true) {
                $('.productsuccess').html(response['message']);
                $('.productsuccess').show();
                $('.productdanger').hide();
                $('.loader').hide();
                setTimeout(function(){ location.reload(); }, 1500);
            } else {
                $('.productdanger').html('');
                for (let index = 0; index < response['errors'].length; index++) {
                        $('.productdanger').append('</br> '+response['errors'][index].msg);
                }
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



    //Remove menu images from the menu 

    $(document).on("click", ".remove-menu-img", function(){
        $('.menu_image_section').show();
        $('.feature_image_section').hide();
        $('.remove_menu').val(1);
        $('.loader').show();
        let productid = $(this).attr('data-prod-id');
        let action = $(this).attr('data-action');
        $.ajax({
            type: "POST",
			url: '/products/removeimage',
			dataType:'json',
            data:
            {
                productid: productid,
                action: action
            },
            success: function(response) {
                if(response['success'] == true) {
                    $('.productsuccess').html(response['message']);
                    $('.productsuccess').show();
                    $('.productdanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ location.reload(); }, 1500);
                } else {
                    $('.productdanger').html('');
                    for (let index = 0; index < response['errors'].length; index++) {
                            $('.productdanger').append('</br> '+response['errors'][index].msg);
                    }
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


    //Dont edit this 
    $(document).on("click", ".remove-feature-img", function(){
        $('.image_section').show();
        $('.feature_image_section').hide();
        $('.remove_feature').val(1);
        $('.loader').show();
        let productid = $(this).attr('data-prod-id');
        let action = $(this).attr('data-action');
        $.ajax({
            type: "POST",
			url: '/products/removeimage',
			dataType:'json',
            data:
            {
                productid: productid,
                action: action
            },
            success: function(response) {
                if(response['success'] == true) {
                    $('.productsuccess').html(response['message']);
                    $('.productsuccess').show();
                    $('.productdanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ location.reload(); }, 1500);
                } else {
                    $('.productdanger').html('');
                    for (let index = 0; index < response['errors'].length; index++) {
                            $('.productdanger').append('</br> '+response['errors'][index].msg);
                    }
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

//Code to remove the section b image for combos
$(document).on("click", ".remove_sectionb-img-combo", function(){
    $('.image_sectionb').show();
    $('.sectionb_image_section').hide();
    $('.remove_sectionb').val(1);
    $('.loader').show();
    let productid = $(this).attr('data-prod-id');
    let action = $(this).attr('data-action');
    $.ajax({
        type: "POST",
        url: '/products/combos/removebimage',
        dataType:'json',
        data:
        {
            productid: productid,
            action: action
        },
        success: function(response) {
            console.log({response});
            if(response['success'] == true) {
                $('.productsuccess').html(response['message']);
                $('.productsuccess').show();
                $('.productdanger').hide();
                $('.loader').hide();
                setTimeout(function(){ location.reload(); }, 1500);
            } else {
                $('.productdanger').html('');
                for (let index = 0; index < response['errors'].length; index++) {
                        $('.productdanger').append('</br> '+response['errors'][index].msg);
                }
                $('.productdanger').show();
                $('.productsuccess').hide();
            }
            $('.loader').hide();
        },
        error: function(err) {
            console.log({err});
        }
    });
});

//Code to remove the section b image for combos
$(document).on("click", ".remove_sectionb-labsheet-combo", function(){
    $('.labsheet_sectionb').show();
    $('.sectionb_labsheet_section').hide();
    $('.remove_sectionb').val(1); 
    $('.loader').show();
    let productid = $(this).attr('data-prod-id');
    let action = $(this).attr('data-action');
    $.ajax({
        type: "POST",
        url: '/products/combos/removelabsheet',
        dataType:'json',
        data:
        {
            productid: productid,
            action: action
        },
        success: function(response) {
            console.log({response});
            if(response['success'] == true) {
                $('.productsuccess').html(response['message']);
                $('.productsuccess').show();
                $('.productdanger').hide();
                $('.loader').hide();
                setTimeout(function(){ location.reload(); }, 1500);
            } else {
                $('.productdanger').html('');
                for (let index = 0; index < response['errors'].length; index++) {
                        $('.productdanger').append('</br> '+response['errors'][index].msg);
                } 
                $('.productdanger').show();
                $('.productsuccess').hide();
            }
            $('.loader').hide();
        },
        error: function(err) {
            console.log({err});
        }
    });
});





    $(document).on("click", ".remove_sectionb-img", function(){
        
        $('.image_sectionb').show();
        $('.sectionb_image_section').hide();
        $('.remove_sectionb').val(1);
        $('.loader').show();
        let productid = $(this).attr('data-prod-id');
        let action = $(this).attr('data-action');
        $.ajax({
            type: "POST",
			url: '/products/removebimage',
			dataType:'json',
            data:
            {
                productid: productid,
                action: action
            },
            success: function(response) {
                console.log({response});
                if(response['success'] == true) {
                    $('.productsuccess').html(response['message']);
                    $('.productsuccess').show();
                    $('.productdanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ location.reload(); }, 1500);
                } else {
                    $('.productdanger').html('');
                    for (let index = 0; index < response['errors'].length; index++) {
                            $('.productdanger').append('</br> '+response['errors'][index].msg);
                    }
                    $('.productdanger').show();
                    $('.productsuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log({err});
            }
        });
    });





    $(document).on("click", ".change-gallery-img", function(){
        let parentId = $(this).closest('.galleryimg').prop('id');
        $('#'+parentId+' .clonedInput').show();
    });

//remove gallery image from combos
$(document).on("click", ".remove-gallery-img-combos", function(){
    let parentId = $(this).closest('.galleryimg').prop('id');
    $('#'+parentId+' .prod-gall-img-combo').hide();
    $('#'+parentId+' .remove_gallery_combo').val(1);
    $('#'+parentId+' .clonedInput').show();
    let productid = $(this).attr('data-prod-id');
    let action = $(this).attr('data-action');
    let imagetoremove = $(this).attr('data-img-rel');
    $.ajax({
        type: "POST",
        url: '/products/combos/removeimage',
        dataType:'json',
        data:
        {
            productid: productid,
            action: action,
            imagetoremove: imagetoremove
        },
        success: function(response) {
            if(response['success'] == true) {
                $('.productsuccess').html(response['message']);
                $('.productsuccess').show();
                $('.productdanger').hide();
                $('.loader').hide();
                setTimeout(function(){ location.reload(); }, 1500);
            } else {
                $('.productdanger').html('');
                for (let index = 0; index < response['errors'].length; index++) {
                        $('.productdanger').append('</br> '+response['errors'][index].msg);
                }
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





    $(document).on("click", ".remove-gallery-img", function(){
        let parentId = $(this).closest('.galleryimg').prop('id');
        $('#'+parentId+' .prod-gall-img').hide();
        $('#'+parentId+' .remove_gallery').val(1);
        $('#'+parentId+' .clonedInput').show();
        let productid = $(this).attr('data-prod-id');
        let action = $(this).attr('data-action');
        let imagetoremove = $(this).attr('data-img-rel');
        $.ajax({
            type: "POST",
			url: '/products/removeimage',
			dataType:'json',
            data:
            {
                productid: productid,
                action: action,
                imagetoremove: imagetoremove
            },
            success: function(response) {
                if(response['success'] == true) {
                    $('.productsuccess').html(response['message']);
                    $('.productsuccess').show();
                    $('.productdanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ location.reload(); }, 1500);
                } else {
                    $('.productdanger').html('');
                    for (let index = 0; index < response['errors'].length; index++) {
                            $('.productdanger').append('</br> '+response['errors'][index].msg);
                    }
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

    // 02 April Jquery Js
    // Start
    jQuery('#custom-select-element').on('change', function() {
        var data_obj = jQuery(this).val();
        if(jQuery.inArray( "usa", data_obj) > -1 ){
            $('.clone_category_select option').each(function( i, val ) {
                if($(this).val() == "usa") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            jQuery("#layout1-filed-id").css("display", 'block');
            jQuery(".sec-usa").show();   
        }else{
            jQuery("#layout1-filed-id").css("display", 'none'); 
        }

        if(jQuery.inArray( "europe", data_obj) > -1 && jQuery('#europe-body').length < 1 ){
            $('.clone_category_select option').each(function( i, val ) {
                if($(this).val() == "europe") {
                    $(this).attr('disabled', 'disabled');
                }
            });
        jQuery("#layout1-filed-id").clone().attr({ "id":"europe-body", "data-section":"europe" }).appendTo("#special-append");
            jQuery('#europe-body .country-section h3').text('Europe');
            jQuery('#europe-body [name]').each(function(){
                const name = jQuery(this).attr("name");
                let avoid = "usa";
                let avoided = name.replace(avoid,'');
                jQuery(this).attr("name", "europe"+avoided)
            });
            jQuery("#europe-body").show();               
        } else if (jQuery.inArray( "europe", data_obj) == -1 ) {
            jQuery("#europe-body").remove();
        }

        if(jQuery.inArray( "australia", data_obj) > -1 && jQuery('#australia-body').length < 1){
            $('.clone_category_select option').each(function( i, val ) {
                if($(this).val() == "australia") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            jQuery("#layout1-filed-id").clone().attr({ "id":"australia-body", "data-section":"australia" }).appendTo("#special-append");
            jQuery('#australia-body .country-section h3').text('Australia');
            jQuery('#australia-body [name]').each(function(){
                const name = jQuery(this).attr("name");
                let avoid = "usa";
                let avoided = name.replace(avoid,'');
                jQuery(this).attr("name", "australia"+avoided);
            });
            jQuery("#australia-body").show();                  
        } else if(jQuery.inArray( "australia", data_obj) == -1){
            console.log("Removing australia");
            jQuery("#australia-body").remove();
        }
    });

    // 03 April 
    $(document).on('click', '.clone', function () {
        $(this).parent().siblings('.clone_category_select').show();
        // $('.clone').closest('.for-cloning-field').clone().appendTo('.custom-extra-home-filed');
    });

    $(document).on('change', '.clone_category_select', function () {
        let regionValue = $(this).val();
        if(regionValue == "usa") {
            jQuery("#layout1-filed-id").show();
            $('.clone_category_select option').each(function( i, val ) {
                if($(this).val() == "usa") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $('#custom-select-element option').each(function(i, val){
                if($(this).val() == "usa") {
                    $(this).attr('selected', 'selected');
                    $(this).select2().trigger('change');
                }
            });
        }

        if(regionValue == "europe") {
            jQuery("#layout1-filed-id").clone().attr({ "id":"europe-body", "data-section":"europe" }).appendTo("#special-append");
                jQuery('#europe-body .country-section h3').text('Europe');
                jQuery('#europe-body [name]').each(function(){
                    const name = jQuery(this).attr("name");
                    let avoid = "usa";
                    let avoided = name.replace(avoid,'');
                    jQuery(this).attr("name", "europe"+avoided)
                });
                jQuery("#europe-body").show();
            $('.clone_category_select option').each(function( i, val ) {
                if($(this).val() == "europe") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $('#custom-select-element option').each(function(i, val){
                if($(this).val() == "europe") {
                    $(this).attr('selected', 'selected');
                    $(this).select2().trigger('change');
                }
            });
        }

        if(regionValue == "australia") {
            jQuery("#layout1-filed-id").clone().attr({ "id":"australia-body", "data-section":"australia" }).appendTo("#special-append");
                jQuery('#australia-body .country-section h3').text('Australia');
                jQuery('#australia-body [name]').each(function(){
                    const name = jQuery(this).attr("name");
                    let avoid = "usa";
                    let avoided = name.replace(avoid,'');
                    jQuery(this).attr("name", "australia"+avoided);
                });
                jQuery("#australia-body").show(); 
            $('.clone_category_select option').each(function( i, val ) {
                if($(this).val() == "australia") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $('#custom-select-element option').each(function(i, val){
                if($(this).val() == "australia") {
                    $(this).attr('selected', 'selected');
                    $(this).select2().trigger('change');
                }
            });
        }
        // $('.clone').closest('.for-cloning-field').clone().appendTo('.custom-extra-home-filed');
    });

    $(document).on("change", ".product-gallery-img", function(){
        let selfId = $(this).attr('id');
        let parentId = $(this).closest('.clonedInput').prop('id');
        if (typeof (FileReader) != "undefined") {
            var image_holder = $("#"+parentId+' .gallery-image-holder');
            image_holder.empty();
            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image img-thumbnail"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
    });

    /******************************* JQuery Related to attribute section **************************************/

    //adds product attribute
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

    // add new term for product attribute
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


    $(document).on('click', '.edit_attribute_btn', function(){
        let attributeID = $(this).attr('data-id');
        $('.loader').show();
        $.ajax({
            type:'GET',
            url: '/products/attribute-data/'+attributeID,
            dataType:'json',
            success: function(response) {
                if(response['success'] == true) {
                    let attributeName       = response['attributes'].name;
                    let attributeSlug       = response['attributes'].slug;
                    $('.editattributename').val(attributeName);
                    $('.editattributeslug').val(attributeSlug);
                    $('#edit_attribute_form').show();
                    $('#addattributeform').hide();
                    $("#edit_attribute_form").attr("action", "/products/attribute-data/" + attributeID);
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

    $(document).on('click', '.edit_attribute_term_btn', function(){
        let attributeID = $(this).attr('data-attrid');
        let slug        = $(this).attr('data-slug');
        $('.loader').show();
        $.ajax({
            type:'GET',
            url: '/products/attribute-term-data',
            dataType:'json',
            data:
            {
                attributeid: attributeID,
                slug: slug
            },
            success: function(response) {
                if(response['success'] == true) {
                    let termName            = response['termsdata'].name;
                    let termSlug            = response['termsdata'].slug;
                    let termDescription     = response['termsdata'].description;
                    $('.edittermtitle').val(termName);
                    $('.edittermslug').val(termSlug);
                    $('.edittermdescripiton').val(termDescription);
                    $('#termeditform').show();
                    $('#termaddfrom').hide();
                    $("#termeditform").attr("action", "/products/attribute-term-data");
                } else {
                    $('.termdanger').html(response['message']);
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

    $(document).on('click', '.delete-attribute_term', function(){
        let attributeID = $(this).attr('data-attrid');
        let slug        = $(this).attr('data-slug');
        let attributeSlug = $(this).attr('data-attribute-slug');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this Product Attribute term ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type: "POST",
                        url: '/products/attribute-term-delete',
                        dataType:'json',
                        data:
                        {
                            attributeid: attributeID,
                            slug: slug,
                            attrislug: attributeSlug
                        },
                        success: function(response) {
                            if(response['success'] == true) {
                                $('.termsuccess').html(response['message']);
                                $('.termsuccess').show();
                                $('.termdanger').hide();
                                $('.loader').hide();
                                setTimeout(function(){ window.location.href = '/products/attribute-term/'+attributeID; }, 5000);
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
                }
            }
        });
    });



    $(document).on('click', '.delete-attribute', function(){
        let id = $(this).attr('data-id');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this Product Attribute ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'DELETE',
                        url: '/products/attribute-delete/'+id,
                        success: function(response) {
                            $('.loader').hide();
                            window.location.href='/products/product-attribute';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

    /********************* Options and Settings related jQuery ************************************************/

    $(document).on('submit', '#optionaddform', function(e){
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

    $(".hideoption").hide();
    $("#option1").show();

    // setTimeout(()=>{
    //     $("#"+$("#menu_type").children()[0].value).show();
    // }, 200);

    $(document).on('change', '#menu_type', function(){
        if($(this).val() != "menu_category") {
            $('.menu_category').addClass('hideoption');
        }
        $('.hideoption').hide();
        $('#' + $(this).val()).show();
    });

    $(document).on('change', '.pagemenu', function(){
        let pageType = $(this).find(':selected').attr('data-page-type');
        $('.page_type_value').val(pageType);
        $('.page_type_field').show();
    });
    /************* jQuery for product review section ***********/
    $(document).on('click', '.review_delete', function(){
        let id          = $(this).attr('data-reviewid');
        let productid   =  $(this).attr('data-productid');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this review ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'DELETE',
                        url: '/products/review-delete/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/products/reviews/'+productid;
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });
   
    $(document).on('click', '.creatives_delete', function(){
        let id          = $(this).attr('data-creativeid');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'GET',
                        url: '/ambassador-portal/creatives/delete/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/ambassador-portal/creatives';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });

 $(document).on('click', '.reviews_delete', function(){
        let id          = $(this).attr('data-reviewid');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'GET',
                        url: '/review/delete'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/review/show';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });





    $(document).on('click', '.icon-new', function(){
        let id = $(this).parent().attr('data-li-id');
        $('#'+id+' .open-close').toggle();
    });

    $(document).on('click', '.form_open_submenu', function(){
        $(this).parent().siblings('.submenu_edit').toggle();
        $(this).children().toggleClass("rotate");

    });

    $(document).on('click', '.submitmenuedit', function(){
        let parentid    = $(this).closest('.menu_edit_div').prop('id');
        let menulabel   = $('#'+parentid+' .edit-menu-item-title').val();
        let menuuniqueid      = $('#'+parentid+' .menu-item-objectid').val();

        if(menulabel == "") {
            $('#'+parentid+' .pagetitleerror').show();  
        } else {
            $('#'+parentid+' .pagetitleerror').hide();
        }
        $('.loader').show();
        $.ajax({
            type: "POST",
            url: '/menus/edit/'+menuuniqueid,
            dataType:'json',
            data:
            {
                menulabel: menulabel,
                menuuniqueid: menuuniqueid,
                menuedit: "yes"
            },
            success: function(response) {
                if(response['success'] == true) {
                    $('.menusuccess').html(response['message']);
                    $('.menusuccess').show();
                    $('.menudanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/menus/all/'; }, 1500);
                } else {
                    if(response['serialerror']) {
                        $('.menudanger').html(response['serialerror']);
                    } else {
                        $('.menudanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.menudanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.menudanger').show();
                    $('.menusuccess').hide();
                }
                $('.loader').hide();
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $(document).on('click', '.submenu-edit', function(){
        let parentid            = $(this).closest('.menu_edit_div').prop('id');
        let submenulabel        = $('#'+parentid+' .edit-submenu-item-title').val();
        let submenutype         = $('#'+parentid+' #editsubmenu1').val();
        let submenuuniqueid     = $('#'+parentid+' .menu-item-objectid').val();
        let parentmenuId        = $('#'+parentid+' .submenu_edit_parentid').val();
        let pagetitle           = '';
        let category            = '';
        let externallink        = '';
        if(submenutype == "custompage") {
            pagetitle = $('#'+parentid+' .submenu_edit_pagename').val();
        }

        if(submenutype == "categorypage") {
            category = $('#'+parentid+' #categorymenuedit').val();
        }

        if(submenutype == "externallink"){
            externallink = $('#'+parentid+' .submenu_edit_externallink').val();
        }

        if(submenulabel == "") {
            $('#'+parentid+' .subpagetitleerror').show();  
        } else {
            $('#'+parentid+' .subpagetitleerror').hide();
        }
        $('.loader').show();
        $.ajax({
            type: "POST",
            url: '/menus/edit/'+submenuuniqueid,
            dataType:'json',
            data:
            {
                menulabel: submenulabel,
                menuuniqueid: submenuuniqueid,
                category: category,
                pagetype: submenutype,
                parentid: parentmenuId,
                externallink: externallink,
                pagetitle: pagetitle
            },
            success: function(response) {
                if(response['success'] == true) {
                    $('.menusuccess').html(response['message']);
                    $('.menusuccess').show();
                    $('.menudanger').hide();
                    $('.loader').hide();
                    setTimeout(function(){ window.location.href = '/menus/all/'; }, 1500);
                } else {
                    if(response['serialerror']) {
                        $('.menudanger').html(response['serialerror']);
                    } else {
                        $('.menudanger').html('');
                        for (let index = 0; index < response['errors'].length; index++) {
                            $('.menudanger').append('</br> '+response['errors'][index].msg);
                        }
                    }
                    $('.menudanger').show();
                    $('.menusuccess').hide();
                }
                $('.loader').hide();
                console.log(data) 
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $(document).on('click', '.submenu-delete', function(){
        let id          = $(this).attr('data-submenuid');
        bootbox.confirm({
            message: "Are You Sure you really want to delete this menu ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
                if(result == true) {
                    $('.loader').show();
                    $.ajax({
                        type:'GET',
                        url: '/menus/delete/'+id,
                        success: function(response){
                            $('.loader').hide();
                            window.location.href='/menus/all/';
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    });
    $(document).on('click', '.accordian_btn', function(){
        $(this).siblings('.section_panel').toggle();
    });

//Code for footer menu starts from here 
$(document).on('click', '.submitfootermenuedit', function(){
    let parentid    = $(this).closest('.menu_edit_div').prop('id');
    let menulabel   = $('#'+parentid+' .edit-menu-item-title').val();
    let menuuniqueid      = $('#'+parentid+' .menu-item-objectid').val();
    if(menulabel == "") {
        $('#'+parentid+' .pagetitleerror').show();  
    } else {
        $('#'+parentid+' .pagetitleerror').hide();
    }
    $('.loader').show();
    $.ajax({
        type: "POST",
        url: '/menus/edit/'+menuuniqueid,
        dataType:'json',
        data:
        {
            footerlabel: menulabel,
            footeruniqueid: menuuniqueid,
            footeredit: "yes"
        },
        success: function(response) {
            if(response['success'] == true) {
                $('.menusuccess').html(response['message']);
                $('.menusuccess').show();
                $('.menudanger').hide();
                $('.loader').hide();
                setTimeout(function(){ window.location.href = '/footermenus/all/'; }, 1500);
            } else {
                if(response['serialerror']) {
                    $('.menudanger').html(response['serialerror']);
                } else {
                    $('.menudanger').html('');
                    for (let index = 0; index < response['errors'].length; index++) {
                        $('.menudanger').append('</br> '+response['errors'][index].msg);
                    }
                }
                $('.menudanger').show();
                $('.menusuccess').hide();
            }
            $('.loader').hide();
        },
        error: function(err) {
            console.log(err);
        }
    });
});

$(document).on('click', '.subfootermenu-edit', function(){
    let parentid            = $(this).closest('.menu_edit_div').prop('id');
    let submenulabel        = $('#'+parentid+' .edit-submenu-item-title').val();
    let submenutype         = $('#'+parentid+' #editsubmenu2').val();
    let submenuuniqueid     = $('#'+parentid+' .menu-item-objectid').val();
    let parentmenuId        = $('#'+parentid+' .submenu_edit_parentid').val();
    let pagetitle           = '';
    let category            = '';
    let externallink        = ''; 
    if(submenutype == "custompage") {
        pagetitle = $('#'+parentid+' .submenu_edit_pagename').val();
    }

    if(submenutype == "categorypage") {
        category = $('#'+parentid+' #categorymenuedit2').val();
    }

    if(submenutype == "externallink"){
        externallink = $('#'+parentid+' .submenu_edit_externallink').val();
    }

    if(submenulabel == "") {
        $('#'+parentid+' .subpagetitleerror').show();  
    } else {
        $('#'+parentid+' .subpagetitleerror').hide();
    }
    $('.loader').show();
    $.ajax({
        type: "POST",
        url: '/footermenus/edit/'+submenuuniqueid,
        dataType:'json',
        data:
        {
            footerlabel: submenulabel,
            footeruniqueid: submenuuniqueid,
            category: category,
            pagetype: submenutype,
            parentid: parentmenuId,
            externallink: externallink,
            pagetitle: pagetitle
        },
        success: function(response) {
            if(response['success'] == true) {
                $('.menusuccess').html(response['message']);
                $('.menusuccess').show();
                $('.menudanger').hide();
                $('.loader').hide();
                setTimeout(function(){ window.location.href = '/footermenus/all/'; }, 1500);
            } else {
                if(response['serialerror']) {
                    $('.menudanger').html(response['serialerror']);
                } else {
                    $('.menudanger').html('');
                    for (let index = 0; index < response['errors'].length; index++) {
                        $('.menudanger').append('</br> '+response['errors'][index].msg);
                    }
                }
                $('.menudanger').show();
                $('.menusuccess').hide();
            }
            $('.loader').hide();
        },
        error: function(err) {
            console.log(err);
        }
    });
});

$(document).on('click', '.subfootermenu-delete', function(){
    let id          = $(this).attr('data-submenuid');
    bootbox.confirm({
        message: "Are You Sure you really want to delete this footer menu?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            console.log('This was logged in the callback: ' + result);
            if(result == true) {
                $('.loader').show();
                $.ajax({
                    type:'GET',
                    url: '/footermenus/delete/'+id,
                    success: function(response){
                        $('.loader').hide();
                        window.location.href='/footermenus/all/';
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
            }
        }
    });
});
$(document).on('click', '.accordian_btn', function(){
    $(this).siblings('.section_panel').toggle();
});




    $(document).on('change', '.edit-subfootermenu-type', function(){
        let parentid  = $(this).closest('.menu_edit_div').prop('id');
        let value =  $('option:selected', this).attr('data-menutype');
        if(value == "linkfields") {
            $("#"+parentid+" .linkfields").removeClass('hidesubmenuoption');
            $("#"+parentid+" .categoryfields").addClass('hidesubmenuoption');
            $("#"+parentid+" .custompagefields").addClass('hidesubmenuoption');
        } else if (value == "custompagefields") {
            $("#"+parentid+" .custompagefields").removeClass('hidesubmenuoption');
            $("#"+parentid+" .categoryfields").addClass('hidesubmenuoption');
            $("#"+parentid+" .linkfields").addClass('hidesubmenuoption');
        } else {
            $("#"+parentid+" .categoryfields").removeClass('hidesubmenuoption');
            $("#"+parentid+" .custompagefields").addClass('hidesubmenuoption');
            $("#"+parentid+" .linkfields").addClass('hidesubmenuoption');
        }
    });





    $(document).on('change', 'input[name=pagecommon]', function(){
        let commonValue = $( 'input[name=pagecommon]:checked' ).val();
        if(commonValue == "yes") {
            $("#layout1-filed-id").show();
            $('.region_select_div').hide();
            $('.clone').hide();
            $('.country-section').hide();
        } else {
            $("#layout1-filed-id").hide();
            $('.region_select_div').show();
            $('.clone').show();
            $('.country-section').show();
        }
    });

    $(document).on('change', 'input[name=layout2common]', function(){
        let commonValue = $( 'input[name=layout2common]:checked' ).val();
        if(commonValue == "yes") {
            $("#usa_field_layout2").show();
            $('.region_select_div').hide();
            $('.layout2-clone-btn').hide();
            $('.country-section').hide();
        } else {
            $("#usa_field_layout2").hide();
            $('.region_select_div').show();
            $('.layout2-clone-btn').show();
            $('.country-section').show();
        }
    });

    $(document).on('change', '.page_region_select', function() {
        var data_obj = jQuery(this).val();
        let layoutID = $(this).closest('.size_chart').attr('id');
        if(jQuery.inArray( "usa", data_obj) > -1 ){
            $('#'+layoutID+' .clone_region_select option').each(function( i, val ) {
                if($(this).val() == "usa") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            jQuery("#usa_field_layout2").css("display", 'block');  
        }else{
            jQuery("#usa_field_layout2").css("display", 'none'); 
        }

        if(jQuery.inArray( "europe", data_obj) > -1 && jQuery('#europe-field-layout2').length < 1 ){
            $('#'+layoutID+' .clone_region_select option').each(function( i, val ) {
                if($(this).val() == "europe") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            jQuery("#usa_field_layout2").clone().attr({ "id":"europe-field-layout2", "data-section":"europe" }).appendTo(".layout2_clone_wrapper");
            jQuery('#europe-field-layout2 .country-section h3').text('Europe');
            jQuery('#europe-field-layout2 [name]').each(function(){
                const name = jQuery(this).attr("name");
                let avoid = "usa";
                let avoided = name.replace(avoid,'');
                jQuery(this).attr("name", "europe"+avoided)
            });
            jQuery("#europe-field-layout2").show();               
        } else if (jQuery.inArray( "europe", data_obj) == -1 ) {
            jQuery("#europe-field-layout2").remove();
        }

        if(jQuery.inArray( "australia", data_obj) > -1 && jQuery('#australia-field-layout2').length < 1){
            $('#'+layoutID+' .clone_region_select option').each(function( i, val ) {
                if($(this).val() == "australia") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            jQuery("#usa_field_layout2").clone().attr({ "id":"australia-field-layout2", "data-section":"australia" }).appendTo(".layout2_clone_wrapper");
            jQuery('#australia-field-layout2 .country-section h3').text('Australia');
            jQuery('#australia-field-layout2 [name]').each(function(){
                const name = jQuery(this).attr("name");
                let avoid = "usa";
                let avoided = name.replace(avoid,'');
                jQuery(this).attr("name", "australia"+avoided);
            });
            jQuery("#australia-field-layout2").show();                  
        } else if(jQuery.inArray( "australia", data_obj) == -1){
            console.log("Removing australia");
            jQuery("#australia-field-layout2").remove();
        }
    });

    $(document).on('click', '.layout2-clone-btn', function () {
        let parentid = $(this).closest('.layout2-fields').attr('id');
        $('#'+parentid+' .clone_region_select').show();
    });

    $(document).on('change', '.clone_region_select', function () {
        let regionValue = $(this).val();
        if(regionValue == "usa") {
            jQuery("#usa_field_layout2").show();
            $('.clone_region_select option').each(function( i, val ) {
                if($(this).val() == "usa") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $('.page_region_select option').each(function(i, val){
                if($(this).val() == "usa") {
                    $(this).attr('selected', 'selected');
                    $(this).select2().trigger('change');
                }
            });
        }

        if(regionValue == "europe") {
            jQuery("#usa_field_layout2").clone().attr({ "id":"europe-field-layout2", "data-section":"europe" }).appendTo(".layout2_clone_wrapper");
                jQuery('#europe-field-layout2 .country-section h3').text('Europe');
                jQuery('#europe-field-layout2 [name]').each(function(){
                    const name = jQuery(this).attr("name");
                    let avoid = "usa";
                    let avoided = name.replace(avoid,'');
                    jQuery(this).attr("name", "europe"+avoided)
                });
                jQuery("#europe-field-layout2").show();
            $('.clone_region_select option').each(function( i, val ) {
                if($(this).val() == "europe") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $('.page_region_select option').each(function(i, val){
                if($(this).val() == "europe") {
                    $(this).attr('selected', 'selected');
                    $(this).select2().trigger('change');
                }
            });
        }

        if(regionValue == "australia") {
            jQuery("#usa_field_layout2").clone().attr({ "id":"australia-field-layout2", "data-section":"australia" }).appendTo(".layout2_clone_wrapper");
                jQuery('#australia-field-layout2 .country-section h3').text('Australia');
                jQuery('#australia-field-layout2 [name]').each(function(){
                    const name = jQuery(this).attr("name");
                    let avoid = "usa";
                    let avoided = name.replace(avoid,'');
                    jQuery(this).attr("name", "australia"+avoided);
                });
                jQuery("#australia-field-layout2").show(); 
            $('.clone_region_select option').each(function( i, val ) {
                if($(this).val() == "australia") {
                    $(this).attr('disabled', 'disabled');
                }
            });
            $('.page_region_select option').each(function(i, val){
                if($(this).val() == "australia") {
                    $(this).attr('selected', 'selected');
                    $(this).select2().trigger('change');
                }
            });
        }
    });
});