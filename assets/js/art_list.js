$(function(){

   // 定义美化时间的过滤器
   template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)
  
    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())
  
    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())
  
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  // 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
  pagenum: 1, // 页码值，默认请求第一页的数据
  pagesize: 2, // 每页显示几条数据，默认每页显示2条
  cate_id: '', // 文章分类的 Id
  state: '' // 文章的发布状态
}

initTable()
// 获取文章列表数据的方法
function initTable(){
  $.ajax({
    method: 'GET',
      url: '/my/article/list',
      data:q,
      success:function(res){
        if(res.status!==0){
          return layer.msg(res.message)
        }
        layer.msg('获取成功')
     let str=  template('tpl-table',res)
      $('tbody').html(str)
      renderPage(res.total)
      }
  })
   
}

const {form,laypage}=layui

initCate()
// 初始化文章分类的方法
function initCate(){
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success:function(res){
      console.log(res);
      if (res.status !== 0) {
        return layer.msg('获取分类数据失败！')
      }
      const str=template('tpl-cate',res)
      console.log(str);
      $('[name=cate_id]').html(str)
      form.render()
    }
  })
}

//需要先绑定表单的 `submit` 事件
// 在事件里面获取到表单中选中的值
//然后把这个值同步到我们 参数对象 `q` 里面
// 再次调用 `initTable()` 方法即可

$('#form-search').on('submit',function(e){
  e.preventDefault()
  // 获取表单中选中项的值
  const cate_id=$('[name=cate_id]').val()
  const state=$('[name=state]').val()
  // 为查询参数对象 q 中对应的属性赋值
  q.cate_id=cate_id
  q.state=state
  // 根据最新的筛选条件，重新渲染表格的数据
  initTable()
})

// 通过 `jump` 回调来实现，当我们切换了 每页显示条目数后，会触发这个回调
// 通过 `obj.limit` 就能获取用户选择的是第几条
//拿到最新条目数后，我们设置给请求对象`q`里面
//然后重新调用 `initTable()` 来获取最新数据
function renderPage(total) {
  laypage.render({
    elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
    ,count: total ,//数据总数，从服务端得到
    limit: q.pagesize, // 每页显示几条数据
    curr: q.pagenum ,// 设置默认被选中的分页
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    limits: [2, 3, 5, 10],// 每页展示多少条
    jump(obj,first){
      q.pagenum=  obj.curr
      q.pagesize = obj.limit
      // 根据最新的 q 获取对应的数据列表，并渲染表格
      if(!first){
        initTable()
      }
    }
  });
}

//通过代理的形式，为删除按钮绑定点击事件处理函数

// 弹出确认取消框提示用户
// 用户点击确认，发送请求，删除当前文章，携带文章`id`
// 请求成功之后，获取最新的文章列表信息
// 关闭当前弹出层
$('tbody').on('click','.btn-delete',function(){
  const id=$(this).data('id')
  const len=$('.btn-delete').length
  layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
    $.ajax({
      method: 'GET',
          url: '/my/article/delete/' + id,
          success:function(res){
            if (res.status !== 0) {
              return layer.msg('删除文章失败！')
            }
            layer.msg('删除文章成功！')
            // if(len===1){
            //   q.pagenum=q.pagenum==1?1:q.pagenum-1
            // } //判断方法一

            if(len===1&&q.pagenum!==1){
              q.pagenum--
            } //判断方法二

          initTable()
          }
    })
    layer.close(index)
  })
})
}) 