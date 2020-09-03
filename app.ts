import { serve } from "https://deno.land/std/http/server.ts";
import {acceptable, acceptWebSocket} from "https://deno.land/std/ws/mod.ts";
import {chatConnection} from './ws/chatroom.ts';

const server = serve({port:3000});
console.log('started at port 3000');
for await(const req of server){
    // serve index page
    if(req.url == "/"){
        req.respond({
            body:await Deno.open('./public/index.html'),
            status:200
        });
    }  
    
    // accept websoket connection
    if(req.url == "/ws"){
        if(acceptable(req)){
            acceptWebSocket({
                conn : req.conn,
                bufReader : req.r,
                bufWriter:req.w,
                headers:req.headers
            }).then(chatConnection);
        }
    }   
    
}



