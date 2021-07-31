$(function(){
  let form=layui.form
  initArtCateList()

  //获取列表
 function initArtCateList(){
   $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success:function(res){
   const str= template("tpl-table",res)
$('tbody').html(str)
    }
   })
 }

 //增加点击事件弹出添加列表弹出层
 let indexAdd=null
$('#btnAddCate').on('click',function(){
  indexAdd= layer.open({
    type: 1,
    area: ['500px', '250px'],
    title: '添加文章分类',
    content: $('#dialog-add').html()
  })
})


//发送添加的数据重新获取数据
$('body').on('submit','#form-add',function(e){
  e.preventDefault()
  $.ajax({
    method: 'POST',
      url: '/my/article/addcates',
      data:$(this).serialize(),
      success:function(res){
        console.log(res);
        if(res.status!==0){
          return layer.msg(res.message)
        }
        initArtCateList()
        layer.msg('新增成功')
        layer.close(indexAdd)
      }

  })
})

 //增加点击事件弹出修改列表弹出层
var indexEdit = null
$('tbody').on('click','.btn-edit',function(){
  indexEdit=layer.open({
    type: 1,
    area: ['500px', '250px'],
    title: '修改文章分类',
    content: $('#dialog-edit').html()
  })

  const id=$(this).data('id')
  
  $.ajax({
    method: 'GET',
    url:'/my/article/cates/' + id,
  success:function(res){
    form.val('form-edit',res.data)
  }
  })
})

//发送修改的数据重新获取数据

$('body').on('submit','#form-edit',function(e){
  e.preventDefault()
  $.ajax({
    method:'post',
    url: '/my/article/updatecate',
    data:$(this).serialize(),
    success:function(res){
      if(res.status!==0){
        return layer.msg(res.message)
      }
      layer.msg('获取数据成功')
      layer.close(indexEdit)
      initArtCateList()
    }
  })
})


//通过代理的形式，为删除按钮绑定点击事件

$('tbody').on('click', '.btn-delete',function(){
  const id=$(this).data('id')
  layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
  $.ajax({
    method:'get',
    url:'/my/article/deletecate/' + id,
    success:function(res){
      if(res.status!==0){
        return layer.msg(res.message)
      }layer.msg('删除分类成功！')
      layer.close(index)
          initArtCateList()
    }
  })
})
})
})