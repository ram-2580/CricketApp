$(function (){
 var socket  = io.connect('http://localhost:3000')
 var form = $('#form')
 var chats = $('#messages')
 var message = $('#message')
 var handel = $('#handel')
 var typing = $('#typing')

 form.submit((e)=>{
   e.preventDefault()
   chats.append('<li><strong>'+handel.val()+' : </strong>'+message.val()+'</li>')
   socket.emit('chat',{handel:handel.val(),msg:message.val()})
   message.val('')
 })
 socket.on('chat',(data)=>{
  typing.html('')
   chats.append('<li><strong>'+data.handel+' : </strong>'+data.msg+'</li>')
 })
 message.keypress(()=>{
   socket.emit('typing',handel.val())
 })
 socket.on('typing',(data)=>{
   typing.html(data + ' is typing')
 })
 message.keyup(()=>{
  socket.emit('clear',{})
 })
 socket.on('clear',(data)=>{
   typing.html('')
 })
})