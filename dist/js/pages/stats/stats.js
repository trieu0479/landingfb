const language = {
    searchPlaceholder: 'Nhập từ khóa',
    processing: 'Đang xử lý...',
    loadingRecords: 'Đang tải...',
    emptyTable: 'Không có dữ liệu hiển thị',
    lengthMenu: 'Hiển thị: _MENU_ dòng mỗi trang',
    zeroRecords: 'Không tìm thấy dữ liệu',
    info: 'Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng',
    infoEmpty: 'Hiển thị từ 0 đến 0 trong tổng 0 dòng',
    infoFiltered: '(lọc từ tổng số _MAX_ dòng)',
    search: 'Tìm kiếm:',
    paginate: {
        previous: '<i class="fa fa-angle-left kt-font-brand"></i>',
        next: '<i class="fa fa-angle-right kt-font-brand"></i>'
    }
};

var url_ = new URL(location.href);
var category = url_.searchParams.get("category")
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str))
       
}

function renderCategory() {

    $.ajax({
        url: `https://localapi.trazk.com/2020/api/facebook/stats.php?task=showCategory&userToken=${userToken}&limit=15`,
        type: "GET",
    }).then(data => {
        var a = [];
        
        a['Cửa hàng quần áo'] = `<i class="fad fa-tshirt text-info"></i>`;
        a['Thiết kế & Thời trang'] = `<i class="fad fa-ruler" style="color: #0abb87"></i>`;
        a['Cửa hàng giày dép'] = `<i class="fad fa-shoe-prints" style="color: #be4bdb"></i>`;
        a['Đồ em bé/Đồ trẻ em'] = `<i class="fad fa-baby-carriage" style="color: #fd397a"></i>`;
        a['Bất động sản'] = `<i class="fad fa-home-lg-alt" style="color: #f2a311"></i>`;
        a['Dịch vụ địa phương'] = `<i class="fad fa-bags-shopping" style="color: #0abb87"></i>`;


        a['Sở thích'] = `<i class="fad fa-heart-circle text-info"></i>`;
        a['Blog cá nhân'] = `<i class="fad fa-blog" style="color: #0abb87"></i>`;
        a['Làm đẹp, Mỹ phẩm & Chăm sóc cá nhân'] = `<i class="fas fa-sparkles" style="color: #be4bdb"></i>`;
        a['Dịch vụ kinh doanh'] = `<i class="fad fa-sack-dollar" style="color: #fd397a"></i>`;
        a['May mặc (Thương hiệu)'] = `<i class="fad fa-copyright" style="color: #f2a311"></i>`;


        a['Doanh nghiệp địa phương'] = `<i class="fad fa-business-time text-info"></i>`;
        a['Sức khỏe/Sắc đẹp'] = `<i class="fad fa-ambulance" style="color: #0abb87"></i>`;
        a['Cộng đồng'] = `<i class="fad fa-acorn" style="color: #be4bdb"></i>`;
        a['Mua sắm & Bán lẻ'] = `<i class="fad fa-bags-shopping" style="color: #fd397a"></i>`;
        a['Sản phẩm/Dịch vụ'] = `<i class="fab fa-product-hunt" style="color: #f2a311"></i>`;



        data = JSON.parse(data)
        data.data.forEach((v, k) => {
            option = `
            <a href="?view=stats&action=index&category=${b64EncodeUnicode(v)}" class="kt-fbrank ${v == category ? 'active' : ''} ">
                <div id="Computers_Electronics_and_Technology" class="kt-widget6__item ">
                <span class="pr-2">${a[v]}</span> <span> ${v}</span>
                </div>
            </a>`
            $('#catalogFbRank').append(option)

        })

    })
}


function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function renderData(data) {
    var arrtTable = [];
    let stt = 0
    let datav2 = data.data.sort(function(a, b) {
        return b.likes - a.likes
    })
    datav2.forEach((v, k) => {
        stt++
        var output = {};

        output.stt = stt
        output.fbId = v.fbId;

        let datafanpageCover = `https://graph.facebook.com/${v.fbId}/picture?type=square`; //data[i].fanpageCover;
        output.fanpageCover = datafanpageCover;

        output.fanpageName = v.fanpageName
        output.fbCategory = v.fbCategory
        output.pageAlias = v.pageAlias

        v.likes == null ? output.likes = 0 : output.likes = v.likes
        v.talking_about_count == null ? output.talkingAbout = 0 : output.talkingAbout = v.talking_about_count
        output.likes_yesterday = v.likes_yesterday
        if (!v.website) {
            output.website = ``
        } else {
            output.website = v.website
            output.websiteRootUrl = extractHostname(v.website)
        }
        arrtTable.push(output);
    })
    return arrtTable;
}

// lấy dữ liệu từ api 
function getDataList(data) {
    if (data == 0) {
        let address_option =
            `<div class="fanpage-option d-flex is-loading-input justify-content-center text-center">
                Đang tải...
                </div>`
        $('#fanpage-search').html(address_option);
        // console.log(1)
    } else {
        // console.log(2)
        let address_option = ``;
        $('#fanpage-search').html('');
        $.each(data.data, function(k, v) {
            let id = v.id
            let imageURI = v.imageURI
            let name = v.name
            let likes = v.likes
            address_option =
                `<div class="fanpage-option d-flex" data-fbid="${id}" data-fbname="${name}">
                     <img src="${imageURI}" class="img-option img-fluid">
                         <div class="text-option d-flex row">
                             <span class="fontsize-14 col-12 research-fanpages">${name}</span>
                             <span class="fontsize-12 text-secondary col-12">Lượt like: ${likes ? numeral(likes).format('') : '0'}</span>
                         </div>
                     </div>`
            $('#fanpage-search').append(address_option);
            $('#fanpage-search .fanpage-option').on('click', function() {
                var elValId = $(this).data('fbid');
                var elValName = $(this).data('fbname');
                // console.log(1)
                $('.input-loading').removeClass('is-loading-input')
                $('.add-fbid').data('fbid', elValId);
                $('.add-fbid').val(elValName);

                let fbIdInput = $('.fanpage-option').attr('data-fbid')
                let fbname = $('.fanpage-option').attr('data-fbname')
                window.location.href = `${rootURL}/facebook-rank/${fbIdInput}/${fbname}`;

                setTimeout(() => {
                    $('#fanpage-search').css('display', 'none');
                }, 200)
            });
        })
    }

}


// search key focus
function searchKeyFocus() {
    $("#input-searchFbRank").focus(() => {
        if (localStorage.getItem("data")) {
            let data = JSON.parse(localStorage.getItem("data"));
            if (data.data.length > 0) {
                getDataList(data);

            } else {}
            $('#fanpage-search').css('display', 'block');
        }
    })
}



function searchKeyBlur() {
    $("#input-searchFbRank").blur(() => {
        $('#fanpage-search').html('');
        $('#fanpage-search').css('display', 'none');
    })
}

function searchKeyUp() {


    var typingTimer; //timer identifier
    var doneTypingInterval = 2000; //time in ms, 5 second for example
    var $input = $('#input-searchFbRank')

    $input.on('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
        $('.input-loading').addClass('is-loading-input')
    });

    $input.on('keydown', function() {
        clearTimeout(typingTimer);

    });

    function doneTyping() {
        let keyword = $(`#input-searchFbRank`).val()

        $.ajax({
            url: `https://localapi.trazk.com/2020/api/facebook/graph.php?task=searchFanpageSuggestion&q=${keyword}`,
            type: "GET"
        }).then(data => {
            data = JSON.parse(data);
            if (data) {
                $('.input-loading').removeClass('is-loading-input')
            }
            localStorage.setItem("data", JSON.stringify(data));
            getDataList(data);
        })
    }






    $('#fanpage-search').css('display', 'block');
}

function searchKeyClick() {
    let from = moment().subtract(7, "days").format("DD/MM/YYYY")
    let to = moment().format("DD/MM/YYYY")
    $('#nextButton').on('click', function() {
        let fbIdInput = $(`#input-searchFbRank`).data('fbid')
        let fanpage = '';
        fanpage = $(`#input-searchFbRank`).val();
        fanpage ?
            $('#alert_message').addClass('d-none') :
            $('#alert_message').removeClass('d-none');
        if (fanpage) {
            window.location.href = `${rootURL}/facebook-rank/${fbIdInput}/result`;
        }
    })
}

function ResearchKeyWordFbRank() {

    searchKeyFocus();
    // searchKeyBlur();

    searchKeyUp();
    searchKeyClick();
}




function remove_unicode(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");

    str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1- 
    str = str.replace(/^\-+|\-+$/g, "");

    return str;
}

function showFacebookVietnam(name = null) {

    let whichAPi = '';
    if (!category || category == "All" || category == '') {
        whichAPi = `https://localapi.trazk.com/2020/api/facebook/stats.php?task=getAllFacebookInformation&userToken=${userToken}&limit=1`
        $('.all-active').addClass('active')
    } else {
        whichAPi = `https://localapi.trazk.com/2020/api/facebook/stats.php?task=getAllFacebookInformation&userToken=${userToken}&limit=1&catName=${category}`
     

    }





    $(`#tablefbRank`).DataTable({
                ajax: {
                    url: whichAPi,
                    dataSrc: function(res) {
                        var columns = [];
                        var stt = parseInt(res.data.from) + 1;
                        $.each(res.data.data, function(k, v) {
                            var output = {};

                            output.stt = stt++;
                            output.fbId = v.fbId;

                            let datafanpageCover = `https://graph.facebook.com/${v.fbId}/picture?type=square`; //data[i].fanpageCover;
                            output.fanpageCover = datafanpageCover;

                            output.fanpageName = v.fanpageName
                            output.fbCategory = v.fbCategory
                            output.pageAlias = v.pageAlias

                            v.likes == null ? output.likes = 0 : output.likes = v.likes
                            v.talking_about_count == null ? output.talkingAbout = 0 : output.talkingAbout = v.talking_about_count
                            output.likes_yesterday = v.likes_yesterday
                            if (!v.website) {
                                output.website = ``
                            } else {
                                output.website = v.website
                                output.websiteRootUrl = extractHostname(v.website)
                            }
                            columns.push(output);
                        })
                        return columns;
                    }


                },
                columns: [{
                            title: `<div class="text-capitalize font-weight-bold font-12 text-center m-auto" style="max-width:30px;width:30px; line-height:18px">Stt</div>`,
                            "data": data => `<div class="text-center m-auto" style="line-height:40px">${data.stt}</div>`
                        }, {
                            title: `<div class="text-capitalize font-weight-bold font-12 text-left" style="max-width:200px;width: 200px; line-height:18px">Tên FanPage</div>`,
                            "data": data => `<div class="text-left mr-auto text-cut d-flex  " style="max-width:200px;width: 200px">
                    <a class="d-flex align-items-center" href="rank/${data.fbId}/${remove_unicode(data.fanpageName)}"> 
                        <img src="${data.fanpageCover}" class="img-fluid rounded-circle" style="object-fit:cover; height:40px; width:40px">
                        <p class="mb-0 text-primary pl-3 text-left mr-auto cut-text-title">${data.fanpageName}</p>
                    </a>
                    
                </div>`

                        },
                        {
                            title: `Danh Mục`,
                            "data": data => `<div class="text-dark text-left mr-auto cut-text-category" style="line-height:40px"> <a href="?view=stats&action=index&category=${b64EncodeUnicode(data.fbCategory)}">${data.fbCategory }</a></div>`,
                        },
                        {
                            title: `Website`,
                            "data": data => `
                        <div class="text-dark text-left mr-auto cut-text-category d-flex" style="line-height:40px">
                            <a target="_blank" href="${data.website == null ? 'javascrip:voild(0)' : data.website}">${data.website == null ? '' : data.website}</a>
                            <a target="_blank" href="${data.website == null ? 'javascrip:voild(0)' : data.website}" class="d-flex align-items-center pl-1">${!data.website ? '' : `<i class="fal text-muted fa-external-link-square-alt ml-1"></i>`}</a>
                        </div>
                        
                    `,
            },
            {
                title: `Lượt thích`,
                "data": data => `
                    <div class="take-care-likes d-flex justify-content-center align-items-center" style="height: 40px">
                        <span class="text-box-catelog text-white fontsize-12 bg-success mr-2 ml-0 mb-0">${numeral(data.likes).format('')}</span>
                    </div>`
            },
            {
                title: `Đánh giá`,
                "data": data => `
                    <div class="take-care-likes d-flex justify-content-center align-items-center" style="height: 40px">
                        <span class="text-box-catelog text-white fontsize-12 bg-info mr-2 ml-0 mb-0">${numeral(data.talkingAbout).format('')}</span>
                    </div>`,
                width: '90',
            }
        ],


        initComplete: function(settings, json) {
            $(`#tablefbRank td`).attr('style', 'padding:10px 10px')
            $(`.tabletablefbRank`).removeClass('is-loading')
        },
        paging: true,
        autoWidth: false,
        pageLength: 50,
        ordering: true,
        "order": [
            [1, 'DESC']
        ],
        info: true,
        responsive: true,
        searching: false,
        sorting: true,
        destroy: true,
        rowId: 'trId',
        "dom": 'ftp',
        scrollX: false,
        "ordering": false,
        info: false,
        processing: true,
        serverSide: true,

        language
    })
}

$(document).ready(function() {

    renderCategory()
    ResearchKeyWordFbRank()
    showFacebookVietnam();
});