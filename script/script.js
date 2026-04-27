// shared.js — AltHack Security ortak JS

// Dropdown
function toggleDD(id){var el=document.getElementById(id);var was=el.classList.contains('open');closeDD();if(!was)el.classList.add('open')}
function closeDD(){document.querySelectorAll('.nd').forEach(function(d){d.classList.remove('open')})}
document.addEventListener('click',function(e){if(!e.target.closest('.nd'))closeDD()});

// Reveal on scroll
function triggerReveal(){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){
      if(e.isIntersecting){setTimeout(function(){e.target.classList.add('vis')},i*60);io.unobserve(e.target)}
    })
  },{threshold:0.06});
  document.querySelectorAll('.rv:not(.vis)').forEach(function(el){io.observe(el)})
}
document.addEventListener('DOMContentLoaded', triggerReveal);

// Glow orb mouse follow
document.addEventListener('mousemove',function(e){
  var orb=document.getElementById('glowOrb');
  if(orb)orb.style.transform='translate('+e.clientX*0.012+'px,'+e.clientY*0.012+'px)'
});

// Nav scroll border
window.addEventListener('scroll',function(){
  var nav=document.getElementById('mainNav');
  if(nav)nav.style.borderBottomColor=window.scrollY>40?'rgba(0,212,255,.12)':'rgba(255,255,255,.055)'
});

// Category search/filter
function filterPosts(cat,query){
  var q=query.toLowerCase().trim();
  var container=document.getElementById('posts-'+cat);
  var noResult=document.getElementById('no-'+cat);
  var countEl=document.getElementById('count-'+cat);
  var clearBtn=document.getElementById('clear-'+cat);
  if(clearBtn)clearBtn.classList.toggle('visible',q.length>0);
  if(!container)return;
  var items=container.querySelectorAll('.cat-post-item');
  var visible=0;
  items.forEach(function(item){
    var text=((item.getAttribute('data-search')||'')+' '+(item.innerText||'')).toLowerCase();
    var match=q===''||text.includes(q);
    item.classList.toggle('hidden',!match);
    if(match)visible++
  });
  if(noResult)noResult.style.display=(visible===0&&q!=='')?'block':'none';
  if(countEl)countEl.textContent=(q&&items.length>0)?visible+' / '+items.length+' sonuç':''
}
function clearSearch(cat){var inp=document.getElementById('search-'+cat);if(inp){inp.value='';filterPosts(cat,'');inp.focus()}}


// --- TR / EN DİL SEÇİCİ MOTORU (COOKIE YÖNTEMİ) ---
document.addEventListener('DOMContentLoaded', () => {
  const langSelector = document.getElementById('langSelector');
  
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Çerezden dili oku, yoksa varsayılan 'tr' yap
  let currentLang = 'tr';
  const googtrans = getCookie('googtrans');
  if (googtrans) {
    currentLang = googtrans.split('/')[2] || 'tr';
  }
  
  // Seçiciyi mevcut dile ayarla
  if (langSelector) langSelector.value = currentLang;

  // Değişim olduğunda cookie'yi yaz ve sayfayı yenile
  if (langSelector) {
    langSelector.addEventListener('change', function() {
      const selectedLang = this.value;
      if (selectedLang === 'tr') {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      } else {
        document.cookie = `googtrans=/tr/${selectedLang}; path=/;`;
        document.cookie = `googtrans=/tr/${selectedLang}; path=/; domain=${window.location.hostname}`;
      }
      location.reload();
    });
  }
});

// --- MARKA İSİMLERİNİ ÇEVİRİDEN KORUMA MOTORU ---
document.addEventListener('DOMContentLoaded', () => {
  // 'gi' bayrağı sayesinde althack, AltHack, ALTHACK vb. tüm varyasyonları yakalar
  const brandRegex = /althack/gi; 

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  const nodesToReplace = [];

  // 1. Aşama: İçinde "althack" geçen ve önceden korunmamış text nodelarını bul
  while(node = walker.nextNode()) {
    // Eğer parent elementi zaten notranslate ise atla (sonsuz döngüyü önler)
    if (node.parentElement && node.parentElement.classList.contains('notranslate')) {
      continue;
    }
    
    // Regex eşleşmesi var mı kontrol et
    if (node.nodeValue.match(brandRegex)) {
      nodesToReplace.push(node);
    }
  }

  // 2. Aşama: Bulunan kelimeleri 'notranslate' kalkanı içine al
  nodesToReplace.forEach(textNode => {
    const parent = textNode.parentElement;
    
    // match parametresi, kelimenin orijinal halinde (AltHack vs) kalmasını sağlar
    const newHTML = textNode.nodeValue.replace(brandRegex, match => `<span class="notranslate">${match}</span>`);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newHTML;
    
    // Yeni oluşturulan span'leri asıl text node'unun yerine yerleştir
    while (tempDiv.firstChild) {
      parent.insertBefore(tempDiv.firstChild, textNode);
    }
    parent.removeChild(textNode);
  });
});
