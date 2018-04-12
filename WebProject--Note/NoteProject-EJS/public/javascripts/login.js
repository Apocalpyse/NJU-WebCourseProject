$(document).ready(function(){
    $("#loginButton").click(function(){
        var account=$("#account").val();
        var password=$("#password").val();
        if(account===""||password===""){
            $("#reminder1").html("请输入帐号和密码");
        }else {
            var form = $('#loginForm');
            $.ajax({
                url: '/index',
                type: 'post',
                data: form.serialize(),
                dataType: 'json',
                timeout: 5000,
                success: function (data) {
                    if (data.state === "登录成功" && data.type === "user") {
                        $(location).attr('href', '/main');
                    } else if (data.state === "登录成功" && data.type === "manager") {
                        $(location).attr('href', '/manager');
                    }else {
                        $("#reminder1").html(data.state);
                    }
                },
                fail: function (err, status) {
                    console.log(err);
                }
            })
        }
    });
});
