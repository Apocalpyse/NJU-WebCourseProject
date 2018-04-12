$(document).ready(function(){
    $("#changePWButton").click(function(){
        var oldAccount=$("#oldAccount").val();
        var oldPassword=$("#oldPassword").val();
        var newPassword=$("#newPassword").val();
        if(oldAccount===""||oldPassword===""||newPassword===""){
            $("#reminder3").html("请输入完整");
        }else if(oldPassword===newPassword){
            $("#reminder3").html("请输入与原密码不同的新密码");
        } else {
            var form = $('#changePWForm');
            $.ajax({
                url: '/changePW',
                type: 'post',
                data: form.serialize(),
                dataType: 'json',
                timeout: 5000,
                success: function (data) {
                    if (data.state === "成功修改密码") {
                        $(location).attr('href', '/');
                        $("#reminder1").html(data.state);
                    }else {
                        $("#reminder3").html(data.state);
                    }
                },
                fail: function (err, status) {
                    console.log(err);
                }
            })
        }
    });
});