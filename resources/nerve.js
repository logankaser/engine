function set(n,p,v) {if(n[p]==null){n.setAttribute(p,v)}else{n[p]=v};}
function get(n,p) {return n[p]==null?n.getAttribute(p):n[p];}

var nerve = {

toggle:function(e,n,arg) {
  if (n.hidden) {n.removeAttribute("hidden");} 
  else {set(n,"hidden", true);}
},

appear:function(e,n,arg) {
  if (n.getAttribute("data-class") == null) {
    n.setAttribute("data-class",n.className);
    n.className = n.className + ' ' + arg.replace('|',' ');
  } else {
    n.className = n.getAttribute("data-class");
    n.removeAttribute("data-class");
  }
},

content:function(e,n,arg) {
  if (n.getAttribute("data-content") == null) {
    n.setAttribute("data-content",n.innerText);
    n.innerText = arg;
  } else {
    n.innerText = n.getAttribute("data-content");
    n.removeAttribute("data-content");
  }
},

_mod:function(e,n,arg) {
  args = arg.split("|");
  set(n,args[0],args[1]);
},

_copy:function(e,n,arg) {
  args = arg.split("|");
  set(n,args[0],get(e.target,args[1]));
},

_get:function(e,n,arg) {
  args = arg.split("|");
  set(n,args[2],get(document.getElementById(args[0]),args[1]));
},

_run:function(e,n,arg) {
  window[arg](e,n);
},

_log:function(_,_,arg) {console.log(arg);},

process:function(n,muscles) {
  var nv = get(n,"data-n").split(" ")[0]
  var nerveMuscles = muscles.filter(function(x,_,_){
    return (x.getAttribute("data-n").split(" ")[0] == nv)});
  var effect = function(reaction) {
    for (var i=0; i < nerveMuscles.length; i++) {
      var data = (nerveMuscles[i].getAttribute("data-n")).split(" ");
      for (var k=1; k < data.length; k++) {
        var parts = data[k].split("=");
        nerve[parts[0]](reaction, nerveMuscles[i], parts[1]);
      }
    }
  }
  return effect
},

processReflex:function(n) {
  var reflex = function(reaction) {
    var data = get(n,"data-n").split(" ");
    for (var i=0; i < data.length; i++) {
      var parts = data[i].split("=");
      nerve[parts[0]](reaction, n, parts[1]);
    }
  }
  n.onclick = reflex;
},

init:function() {
  var muscles = [].slice.call(document.getElementsByClassName("nMuscle"));
  var nerves = document.getElementsByClassName("nNerve");
  var senses = document.getElementsByClassName("nSense");
  var reflexes = document.getElementsByClassName("nReflex");
  for (var i=0;i < nerves.length;++i) {
    nerves[i].onclick = nerve.process(nerves[i], muscles);
  }
  for (var i=0;i < senses.length;++i) {
    nerve.process(senses[i], muscles)({target:senses[i]});
  }
  for (var i=0;i < reflexes.length;++i) {
    nerve.processReflex(reflexes[i]);
  }
}
};

document.addEventListener("DOMContentLoaded", nerve.init);
