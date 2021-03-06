const fs = require('fs');
const {v4} = require('uuid');
const { getMsgInfo } = require('./reader');

//file to save messages on a json file
fs.open('chat/messages.json','r',(err,file)=>{
  if(err){
    fs.open('chat/messages.json','w',(err,file)=>{
      if(err){
        console.log(err);
      }else{
        const content = {};
        fs.writeFile('chat/messages.json',JSON.stringify(content),err=>{
          if(err){
            console.log(err);
          }else{
            console.log("messages is on now");
          }
        });
      }
    });
  }else {
    console.log("tracking messages!");
  }
});

module.exports = {
  writeRecord:(data,callback)=>{

    const timestamp = new Date();
    const room = data.class_id;
    const msgID = v4();

     fs.readFile('chat/messages.json',(err,oldMsg)=>{

       if(err){
         console.log(err);
         return callback(err);
       }else{

         try{
           var newMsg = JSON.parse(oldMsg);
           if(newMsg[`${room}`] === undefined){
             data["id"]=msgID;
             newMsg[`${room}`] = [JSON.stringify(data)];
           }else{
             var currRoomMsg = newMsg[`${room}`];
             data["id"] = msgID;
             currRoomMsg.push(JSON.stringify(data));
             newMsg[`${room}`] = currRoomMsg;
           }

           fs.writeFile('chat/messages.json',JSON.stringify(newMsg),()=>{});
           return callback(null);

         }catch(err){
           console.log(err);
           return callback(err);
         }

       }

     });
  },
  readRecord:({room:room_id,user_id},callback)=>{

    fs.readFile('chat/messages.json',(err,jsonData)=>{
      if(err){
        console.log(err);
        return callback(err);
      }else{
        const messages = JSON.parse(jsonData);
        const roomMsg = messages[`${room_id}`];
        let dataTosend = [];

        if(!roomMsg)
        return callback(null,[]);

        try{
          getMsgInfo(null,(err,readInfo)=>{

            if(err){
              return callback(err);
            }

            roomMsg.forEach((item, i) => {
              let eachMsg = JSON.parse(item);
              if(readInfo[eachMsg.id] === undefined || readInfo[eachMsg.id][user_id] === undefined){
                eachMsg.isRead = false;
              }else{
                eachMsg.isRead = readInfo[eachMsg.id][user_id];
              }
              dataTosend.push(eachMsg);
            });
            // console.log(dataTosend);
            return callback(null,dataTosend);

          });
        }catch(e){
          console.log(e);
          return callback(e);
        }

        // return callback(null,roomMsg);
      }
    });

  }
}
