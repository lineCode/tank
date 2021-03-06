//绘图画布
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

// canvas.addEventListener("click", function(event){
//     Module._on_click_event(event.clientX, event.clientY);
// });

// canvas.addEventListener("touchmove", function(event){
//     Module._on_touch_move(event.touches[0].clientX, event.touches[0].clientY);
// });

var keyPress = {};

document.addEventListener("keyup", function(event){
    //console.log("keyup:", event.key);
    keyPress[event.key] = false;
    Module._on_keyup_event(allocateUTF8OnStack(event.key));
});

document.addEventListener("keydown", function(event){
    //console.log("keydown", event.key);
    if(!keyPress[event.key]){
        //console.log("keydown into:", event.key);
        keyPress[event.key] = true;
        Module._on_keydown_event(allocateUTF8OnStack(event.key));
    }
});

//下面是要导入webassembly的JS帮助函数
function _emscripten_prompt(title, default_msg){
    var val = prompt(UTF8ToString(title), UTF8ToString(default_msg));
    return allocateUTF8OnStack(val);
}

function _emscripten_alert(str){
    alert(UTF8ToString(str));
}
function _emscripten_current_time_millis(){
    return Date.now();
}
function _emscripten_console_log(str){
    console.log(UTF8ToString(str));
}
function _emscripten_current_time_millis(){
    return Date.now();
}
function _emscripten_random(){
    return Math.random();
}
function _emscripten_request_animation_frame(){
    window.requestAnimationFrame(Module._request_animation_frame_callback);
}
function _emscripten_load_resource(object){
    let json = UTF8ToString(object);
    var urls = JSON.parse(json);
    loadResources(urls, function(map, num, total){
        window.resMap = map;
        Module._on_resource_load(num, total);
    });
}
function _emscripten_set_canvas_height(height){
    canvas.height = height;
}
function _emscripten_set_canvas_width(width){
    canvas.width = width;
}
function _emscripten_set_canvas_style_margin(left, top, right, bottom){
    canvas.style.marginLeft = left+'px';
    canvas.style.marginTop = top+'px';
    canvas.style.marginRight = right+'px';
    canvas.style.marginBottom = bottom+'px';
}
function _emscripten_set_canvas_style_width(width){
    canvas.style.width = width+'px';
}
function _emscripten_set_canvas_style_height(height){
    canvas.style.height = height+'px';
}
function _emscripten_set_canvas_font(font){
    ctx.font = UTF8ToString(font);
}
function _emscripten_fill_style(st){
    ctx.fillStyle = UTF8ToString(st);
}
function _emscripten_fill_rect(x, y, width, height){
    ctx.fillRect(x, y, width, height);
}
function _emscripten_fill_text(text, x, y){
    ctx.fillText(UTF8ToString(text), x, y);
}
function _emscripten_draw_image_at(resId, x, y){
    if(window.resMap[resId]){
        ctx.drawImage(window.resMap[resId], x, y);
    }
}
function _emscripten_draw_image(resId, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight){
    if(window.resMap[resId]){
        ctx.drawImage(window.resMap[resId], sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    }
}
function _emscripten_send_message(str){
    if(socket){
        let msg = UTF8ToString(str);
        //console.log("send_message:", msg);
        socket.send(msg);
    }
}
function _emscripten_connect(url){
    connect(UTF8ToString(url));
}
function _emscripten_window_inner_width(){ return window.innerWidth; }
function _emscripten_window_inner_height(){ return window.innerHeight; }

//加载图片资源 srcMap为json对象
function loadResources(srcMap, listener){
    var total = Object.keys(srcMap).length;
    var resMap = {};
    function check(listener){
        if(listener)
            listener(resMap, Object.keys(resMap).length, total);
    }
    for(var key in srcMap){
            var image = new Image();
            image.key = key;
            image.src = srcMap[key];
            image.onload = function(){
                resMap[this.key] = this;
                check(listener);
            };
    }
}

var socket;
//连接websocket
function connect(url){
    socket = new WebSocket(url);
    socket.onopen = function(event) {
        Module._on_connect();
        
        socket.onmessage = function(event){
            //console.log("onmessage", event.data);
            Module._on_message(allocateUTF8OnStack(event.data));
        };

        socket.onclose = function(event) {
            Module._on_close();
        };
    }

    socket.onerror = function(){
        alert("连接失败，请重试");
    }
}

var Module = {
    onRuntimeInitialized: function(){
        console.log('onRuntimeInitialized');
        window.onresize = Module._on_window_resize;
        Module._start();
    },
};


/*
//启动游戏循环
        // var timer = new Timer(20);
        // timer.start();
        var frame_time = 1000/30;
        //var start_time = Date.now();
        var start_time = null;
        var next_time = 0;
        var last_time = 0;
        (function drawFrame (timestamp) {
            if(start_time==null){
                start_time = timestamp;
                next_time = start_time + frame_time;
                last_time = start_time;
            }
            if (timestamp>next_time) {
                console.log("frame_time=", timestamp-last_time);
                next_time = timestamp+frame_time;
                //next_time = now+frameTime;
                last_time = timestamp;
                //显示帧率
                //Module._request_animation_frame_callback();
                // ctx.fillStyle = '#ccc';
                // ctx.fillRect(0, 0, 1000, 1000);
                // ctx.fillStyle = '#fff';
                // ctx.fillText('FPS:'+(1000/(now-start_time)), 20, 30);
                // start_time = now;
            }
            window.requestAnimationFrame(drawFrame, canvas);
        }());
*/