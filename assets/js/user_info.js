$(function(){
  const {form,layer}=layui

  form.verify({
    nickname:function(value){
      if(value.length>6){
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })
  initUserInfo()
  function initUserInfo(){
    $.ajax({
      url:'/my/userinfo',
      mothod:'get',
      success:function(res){
     console.log(res);
        form.val('formUserInfo', res.data)
      }
    })
  }
// 重置表单的数据
  $('#btnReset').on('click',function(e){
    // 阻止表单的默认重置行为
e.preventDefault()
//重新调用赋值
initUserInfo()
  })

$('.layui-form').on('submit',function(e){
  console.log(e);
  e.preventDefault()
  $.ajax({
    url:'/my/userinfo',
    method:'POST',
    data:$(this).serialize(),
    success:function(res){
      if(res.status!==0){
        
        return layer.msg(res.message||'更新用户信息失败')
      }
      window.parent.getUser()
    }
  })
})

})