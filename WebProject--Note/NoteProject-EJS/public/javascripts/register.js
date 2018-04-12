$(document).ready(function(){
    $("#registerButton").click(function(){
        var account=$('#newAccount').val();
        var password1=$('#password1').val();
        var password2=$('#password2').val();
        if(account===""||password1===""||password2===""){
            $("#reminder2").html("请输入完整信息");
        }else if(password1!==password2){
            $("#reminder2").html("两次输入的密码不一致");
        }else {
            var form=$('#registerForm');
            $.ajax({
                url:'/register',
                type: 'post',
                data:form.serialize(),
                dataType: 'json',
                timeout: 5000,
                success: function (data) {
                    if(data.state==="注册成功"){
                        alert("注册成功");
                        $(location).attr('href','/');
                    }else {
                        $("#reminder2").html(data.state);
                    }
                },
                fail: function (err, status) {
                    console.log(err);
                }
            })
        }
    });
});