$.ajax({
    url: '/manager/searchUser',
    type: 'post',
    success: function (data) {
        for(var i=0;i<data.length;i++){
            $("#choiceUser").append("<li role='presentation'><a role='menuitem' tabindex='-1'  class='noteLinks' onclick='changeUser(event)'>"+data[i]+"</a></li>");
        }
    },
    fail: function (err) {
        console.log(err);
    }
});

function changeUser(event) {
    $("#choiceUserButton").html(event.target.innerHTML);
}

$("#deleteUser").click(function () {
    var account=$("#choiceUserButton").html();
    $.ajax({
        url: '/manager/deleteUser',
        type: 'get',
        data: {
            account:account
        },
        dataType: 'json',
        timeout: 5000,
        success: function (data) {
            alert(data.state);
            $(location).attr('href', '/manager');
        },
        fail: function (err, status) {
            console.log(err);
        }
    })
});

$("#changePWButton").click(function () {
    var account=$("#choiceUserButton").html();
    var password=$("#inputNewPassword").val();
    $.ajax({
        url: '/manager/changeUserPW',
        type: 'get',
        data: {
            account:account,
            password:password
        },
        dataType: 'json',
        timeout: 5000,
        success: function (data) {
            alert(data.state);
            $(location).attr('href', '/manager');
        },
        fail: function (err, status) {
            console.log(err);
        }
    })
});