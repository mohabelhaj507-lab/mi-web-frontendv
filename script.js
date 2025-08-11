// CONFIG: pega aquí la URL de tu Web App de Google Apps Script si usas fetch externo.
// Si sirves la página desde Apps Script (HtmlService), usa google.script.run (ver README).
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxcvP1Vzy5bUaJOCF3olq2YCi7ZlfGdfrYieRAfnyUhPTB_uc8egtv7SONPqfSgXqbO/exechttps://script.google.com/macros/s/AKfycbxcvP1Vzy5bUaJOCF3olq2YCi7ZlfGdfrYieRAfnyUhPTB_uc8egtv7SONPqfSgXqbO/exec'; // Ej: https://script.google.com/macros/s/XXXX/exec
const SECRET_KEY = ''; // Opcional: si configuras secretKey en Apps Script

let products = [];
let cart = [];

function money(n){return Number(n||0).toFixed(2);}

// Cargar catálogo
function loadCatalog(){
  if (!WEBAPP_URL || WEBAPP_URL.includes('REPLACE_WITH')) {
    document.getElementById('catalog').innerText = '👉 Aún no has configurado WEBAPP_URL en script.js';
    return;
  }
  fetch(WEBAPP_URL + '?type=products')
    .then(r=>r.json())
    .then(data=>{ products = data; renderCatalog(); })
    .catch(e=>{ document.getElementById('catalog').innerText = 'Error al cargar catálogo: ' + e; console.error(e); });
}

function renderCatalog(){
  const el = document.getElementById('catalog'); el.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    if(p.imagen_url) { const img = document.createElement('img'); img.src = p.imagen_url; card.appendChild(img); }
    const name = document.createElement('h4'); name.innerText = p.nombre || p.name || 'Sin nombre';
    const price = document.createElement('div'); price.innerText = '€' + money(p.precio || p.price || 0) + ' / ' + (p.unidad || 'u');
    const qty = document.createElement('input'); qty.type='number'; qty.min=1; qty.value=1;
    const add = document.createElement('button'); add.innerText='Añadir'; add.onclick = ()=>{ addToCart(p, Number(qty.value)); };
    card.appendChild(name); card.appendChild(price); card.appendChild(qty); card.appendChild(add);
    el.appendChild(card);
  });
}

function addToCart(product, qty){
  if (!qty || qty<=0) return;
  let existing = cart.find(c=>c.id==product.id);
  if (existing){ existing.qty += qty; }
  else { cart.push({ id: product.id, nombre: product.nombre||product.name, precio: Number(product.precio||product.price||0), qty: qty}); }
  renderCart();
}

function renderCart(){
  const el = document.getElementById('cartItems'); el.innerHTML = '';
  if (cart.length===0) { el.innerText='(vacío)'; document.getElementById('total').innerText='0.00'; return; }
  cart.forEach((c, idx)=>{
    const row = document.createElement('div'); row.innerText = c.nombre + ' x ' + c.qty + ' -> €' + money(c.precio*c.qty);
    const rem = document.createElement('button'); rem.className='small'; rem.innerText='Eliminar'; rem.onclick=()=>{ cart.splice(idx,1); renderCart(); };
    row.appendChild(document.createTextNode(' ')); row.appendChild(rem);
    el.appendChild(row);
  });
  const total = cart.reduce((s,i)=>s + (i.precio*i.qty), 0);
  document.getElementById('total').innerText = money(total);
}

document.getElementById('sendOrder').onclick = function(){
  const name = document.getElementById('clientName').value.trim();
  const contact = document.getElementById('clientContact').value.trim();
  if (!name || !contact) { alert('Indica nombre y contacto'); return; }
  if (cart.length===0){ alert('Carrito vacío'); return; }
  const payload = { clientName: name, clientContact: contact, items: cart, total: cart.reduce((s,i)=>s + (i.precio*i.qty), 0) };
  if (SECRET_KEY && !SECRET_KEY.includes('REPLACE_WITH')) payload.secretKey = SECRET_KEY;
  document.getElementById('status').innerText = 'Enviando...';
  fetch(WEBAPP_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    .then(r=>r.json()).then(resp=>{
      if(resp.status==='success'){ document.getElementById('status').innerText='Pedido enviado ✅'; cart=[]; renderCart(); }
      else { document.getElementById('status').innerText = 'Error: ' + (resp.message || JSON.stringify(resp)); }
    }).catch(e=>{ document.getElementById('status').innerText = 'Error al enviar: ' + e; console.error(e); });
};

// Inicializar
loadCatalog();
