$(function (){
 var socket  = io.connect('http://localhost:3000')
 var form = $('#form')
 var chats = $('#messages')
 var message = $('#message')
 var handel = $('#handel')
 var typing = $('#typing')
 var f_id = $('#followingsid').val()
 var u_id = $('#usersid').val()
 
 form.submit((e)=>{
   e.preventDefault()
   chats.append('<li><strong>'+handel.val()+' : </strong>'+message.val()+'</li>')
   socket.emit('chat',{user:u_id,fId:f_id,handel:handel.val(),msg:message.val()})
  
   message.val('')
 })
 socket.on('chat',(data)=>{
  typing.html('')
  console.log(data.user+' received : ' + data.fId)
   if(u_id == data.fId ){
    chats.append('<li><strong>'+data.handel+' : </strong>'+data.msg+'</li>')
   }
 })
 message.keypress(()=>{
   socket.emit('typing',{user:u_id,fId:f_id,handel:handel.val()})
 })
 socket.on('typing',(data)=>{
   if(u_id == data.fId){
    typing.html(data.handel + ' is typing')
   }
 })
 message.keyup(()=>{
  socket.emit('clear',{user:u_id,fId:f_id})
 })
 socket.on('clear',(data)=>{
   if(u_id == data.fId) typing.html('')
 })
})