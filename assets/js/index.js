$(function(){
  getUser() 
  

  $('#btnLogou').on('click',function(){
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
      
      // 1. 清空本地存储中的 token
     localStorage.removeItem('token')
  // 跳转到登录页面
     location.href='./login.html'
      // 关闭 confirm 询问框
      layer.close(index)
    })

  })

})
//获取用户基本信息
function getUser(){
  $.ajax({
    url:'/my/userinfo',
    method:'get',
    // headers:{
    //   Authorization:localStorage.getItem('token')||''
    // },
    success:function(res){
      if(res.status !== 0){
return layer.msg(res.message)
      }
      //渲染头像调用
      renDer(res.data)
    },
    // 不论成功还是失败，最终都会调用 complete 回调函数

  })
}
//渲染头像
function renDer(user){
const name=user.nickname || user.username
$('#welcome').html('欢迎　'+name)
if(user.user_pic){
  //渲染图片
  $('.layui-nav-img').attr('src',user.user_pic).show()
  $('.text-avatar').hide()
}else{
   //渲染文本头像
  $('.layui-nav-img').hide()
  const first=name[0].toUpperCase()
  $('.text-avatar').html(first).show()
}
}