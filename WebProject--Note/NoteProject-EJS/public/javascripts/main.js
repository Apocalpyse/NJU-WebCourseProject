//实现笔记本的增删改查

 $.ajax({
        url: '/main',
        type: 'post',
        success: function (data) {
            $("#user").html(data[0]);
            for(var i=1;i<data.length;i++){
                $("#choiceNote").append("<li role='presentation'><a role='menuitem' tabindex='-1'  class='noteLinks' onclick='changeNote(event)'>"+data[i]+"</a><span class='trashNote glyphicon glyphicon-trash'onclick='trashNote()'></span></li>");
            }
        },
        fail: function (err) {
            console.log(err);
        }
    });


function changeNote(event) {
    $("#noteChoiceButton").html(event.target.innerHTML);
}

 function changePage(event) {
     $("#pageChoiceButton").html(event.target.innerHTML);
     $("#titleTextArea").html(event.target.innerHTML);
 }

 $("#noteChoiceButton").bind('DOMNodeInserted',function () {
     var noteName=$("#noteChoiceButton").html();
     var account=$("#user").html();
     if(noteName!=="选择笔记本"){
         console.log(noteName);
         $.ajax({
             url: '/main/getPages',
             type: 'get',
             data:{
                 noteName:noteName,
                 account:account
             },
             success: function (data) {
                 $("#choicePage").html("");
                 if(data.length===0){
                     $("#choicePage").append("<p>暂无笔记</p>") ;
                 }else {
                     for(var i=0;i<data.length;i++){
                         $("#choicePage").append("<li role='presentation'><a role='menuitem' tabindex='-1'  class='noteLinks' onclick='changePage(event)'>"+data[i]+"</a><span class='trashPage glyphicon glyphicon-trash'onclick='trashPage()'></span></li>");
                     }
                 }
             },
             fail: function (err) {
                 console.log(err);
             }
         });
     }
 });

 $("#titleTextArea").bind('DOMNodeInserted',function () {
     var title=$("#titleTextArea").html();
     $.ajax({
         url: '/main/getPagesContext',
         type: 'get',
         data:{
             title:title
         },
         success: function (data) {
             CKEDITOR.instances.mainTextArea.setData(data.context);
         },
         fail: function (err) {
             console.log(err);
         }
     });
 });
 
$("#submitPage").click(function () {
    var note;
    var title;
    var context;
    var account;
    if($("#noteChoiceButton").html()!=="选择笔记本"){
        note=$("#noteChoiceButton").html();
        title=$("#titleTextArea").val();
        context=CKEDITOR.instances.mainTextArea.getData();
        account=$("#user").html();
        console.log(context);
        $.ajax({
            url: '/main/submit',
            type: 'get',
            data: {
                note:note,
                title:title,
                context:context,
                account:account
            },
            dataType: 'json',
            timeout: 5000,
            success: function (data) {
               alert(data.state);
                $(location).attr('href', '/main');
            },
            fail: function (err, status) {
                console.log(err);
            }
      })
    }else {
        alert("请选择笔记本");
    }
});

function trashNote() {
    var noteName=$("#noteChoiceButton").html();
    var owner=$("#user").html();
    $.ajax({
        url: '/main/deleteNote',
        type: 'get',
        data: {
            noteName:noteName,
            owner:owner
        },
        dataType: 'json',
        timeout: 5000,
        success: function (data) {
            alert(data.state);
            $(location).attr('href', '/main');
        },
        fail: function (err, status) {
            console.log(err);
        }
    })
}

function trashPage() {
    var title=$("#pageChoiceButton").html();
    var noteName=$("#noteChoiceButton").html();
    var owner=$("#user").html();
    $.ajax({
        url: '/main/deletePage',
        type: 'get',
        data: {
            title:title,
            noteName:noteName,
            owner:owner
        },
        dataType: 'json',
        timeout: 5000,
        success: function (data) {
            alert(data.state);
            $(location).attr('href', '/main');
        },
        fail: function (err, status) {
            console.log(err);
        }
    })
}

$("#createNoteButton").click(function () {
   var noteName=$("#inputNoteName").val();
   var owner=$("#user").html();
   if(noteName!==""){
       $.ajax({
           url: '/main/createNote',
           type: 'get',
           data: {
               noteName:noteName,
               owner:owner
           },
           dataType: 'json',
           timeout: 5000,
           success: function (data) {
               alert(data.state);
               $(location).attr('href', '/main');
           },
           fail: function (err, status) {
               console.log(err);
           }
       })
   }
});

CKEDITOR.replace('mainTextArea',{
    height: 350
});