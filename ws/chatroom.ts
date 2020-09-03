import {WebSocket, isWebSocketCloseEvent } from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

let sockets = new Map<string,WebSocket>();

interface event {
     name : string,
     msg : string
};

// broadcast event to other clients
const broadcastMessage = (eventObj : event) => {
    sockets.forEach(ws => {
        ws.send(JSON.stringify(eventObj));
    });
}

export const chatConnection = async (ws: WebSocket)=>{
    // console.log(ws);
    const uid = v4.generate();
    sockets.set(uid, ws);
    for await(const event of ws){
        // console.log(event);{"name":"anonymous","msg":"hi"}

        // delete a socket if connection is closed
        if(isWebSocketCloseEvent(event)){
            sockets.delete(uid);
        }

        // create event object if event is string means if its a json string like above
        if(typeof event == 'string'){
           const eventObj = JSON.parse(event);
            broadcastMessage(eventObj);
        }
    } 

}