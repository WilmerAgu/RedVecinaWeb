(function(){
  var img=document.querySelector('.ver-youtube img');
  var c=document.querySelector('.ambiente');
  if(!img||!c||!c.getContext) return;
  var ctx=c.getContext('2d');
  function pintar(){ctx.drawImage(img,0,0,c.width,c.height)}
  if(img.complete) pintar(); else img.addEventListener('load',pintar);
})();
(function(){
  var lector=document.getElementById('lector');
  var cuerpo=lector.querySelector('.lector-cuerpo');
  var barra=lector.querySelector('.progreso span');
  var links=[].slice.call(lector.querySelectorAll('.indice a'));
  var origen=null;

  function irA(id,suave){
    var t=document.getElementById(id);
    if(!t||id==='inicio-ensayo'){cuerpo.scrollTo({top:0});return;}
    var y=t.getBoundingClientRect().top-cuerpo.getBoundingClientRect().top+cuerpo.scrollTop-24;
    cuerpo.scrollTo({top:Math.max(0,y),behavior:suave?'smooth':'auto'});
  }
  function abrir(id,boton){
    origen=boton;
    if(typeof lector.showModal==='function') lector.showModal(); else lector.setAttribute('open','');
    irA(id||'inicio-ensayo',false);
    lector.querySelector('.cerrar').focus({preventScroll:true});
  }
  function cerrar(){
    if(typeof lector.close==='function') lector.close(); else lector.removeAttribute('open');
  }

  document.querySelectorAll('[data-ir]').forEach(function(b){
    b.addEventListener('click',function(){abrir(b.getAttribute('data-ir'),b)});
  });
  lector.querySelector('.cerrar').addEventListener('click',cerrar);
  lector.addEventListener('click',function(e){if(e.target===lector) cerrar();});
  lector.addEventListener('close',function(){if(origen) origen.focus();});

  links.forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault();irA(a.getAttribute('href').slice(1),true);});
  });

  var secciones=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  function actualizar(){
    var max=cuerpo.scrollHeight-cuerpo.clientHeight;
    barra.style.width=(max>0?cuerpo.scrollTop/max*100:0)+'%';
    var tope=cuerpo.getBoundingClientRect().top+cuerpo.clientHeight*.3, actual=-1;
    secciones.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=tope) actual=i;});
    if(max>0&&cuerpo.scrollTop>=max-2) actual=secciones.length-1;
    links.forEach(function(a,i){a.classList.toggle('activo',i===actual)});
  }
  cuerpo.addEventListener('scroll',actualizar,{passive:true});
  document.querySelectorAll('[data-ir]').forEach(function(b){b.addEventListener('click',function(){requestAnimationFrame(actualizar)})});
})();
