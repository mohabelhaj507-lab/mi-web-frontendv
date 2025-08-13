// CONFIG LOCAL: leer el catálogo desde un archivo local JSON
const CATALOG_FILE = 'catalogo.json'; // archivo que subas a tu repo
let products = [];
let cart = [];

function money(n){return Number(n||0).toFixed(2);}

// Cargar catálogo desde archivo local
function loadCatalog(){
  fetch(CATALOG_FILE)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => { products = data; renderCatalog(); })
    .catch(e => { 
      document.getElementById('catalog').innerText = 'Error al cargar catálogo: ' + e;
      console.error(e);
    });
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
  alert('Este modo solo muestra el catálogo local y no envía pedidos.');  
};

// Inicializar
loadCatalog();
// CONFIG LOCAL: leer el catálogo desde un archivo local JSON
const CATALOG_FILE = 'catalogo.json'; // archivo que subas a tu repo
let products = [];
let cart = [];

function money(n){return Number(n||0).toFixed(2);}

// Cargar catálogo desde archivo local
function loadCatalog(){
  fetch(CATALOG_FILE)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => { products = data; renderCatalog(); })
    .catch(e => { 
      document.getElementById('catalog').innerText = 'Error al cargar catálogo: ' + e;
      console.error(e);
    });
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
  alert('Este modo solo muestra el catálogo local y no envía pedidos.');  
};

// Inicializar
loadCatalog();
