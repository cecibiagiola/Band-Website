
// Listado de todos los productos
const lista = document.querySelector('#row')

fetch('../data.json')
    .then( (res) => res.json ())
    .then( (data) => {
        data.forEach((producto) => {
            const card = document.createElement("div")
            card.innerHTML = `
             <div class="col-sm mb-4">
                <div class="card text-center articulo">
                    <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                      <img src="${producto.imagen}" class="img-fluid" />
                      <a href="#!">
                        <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)" ></div>
                      </a>
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre}<span class="price">$${producto.Precio}</span></h5>
                      <button type="button" class="btn btn-primary button agregarProductoAlert" id="agregarProducto" onclick="sweetAlert()">Agregar al carrito</button>
                    </div>
                </div>
            </div>`

            lista.append(card);     
        });

        const clickButton = document.querySelectorAll('.button');

        clickButton.forEach(btn => {
          btn.addEventListener('click', addToCarritoItem)
      });
    });

// Buscador

document.addEventListener('keyup', e=> {
  if(e.target.matches('#buscador')){

   document.querySelectorAll('.articulo').forEach(art => {
       art.textContent.toLowerCase().includes(e.target.value.toLowerCase())
       ?art.classList.remove('filtro')
       :art.classList.add('filtro')
   })
  }
}); 



// Carrito 
let agregarProductoCarrito = document.getElementById('agregarProducto') 
agregarProductoCarrito.addEventListener('click', addToCarritoItem)



//const clickButton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []

/* clickButton.forEach(btn => {
    btn.addEventListener('click', addToCarritoItem)
}) */

function addToCarritoItem(e){
    const button = e.target
    const item = button.closest('.card')
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.price').textContent;
    const itemImage = item.querySelector('.img-fluid').src;
    
    const newItem = {
        title : itemTitle,
        precio: itemPrice,
        img: itemImage,
        cantidad: 1
    }
    addItemCarrito(newItem)
}

function addItemCarrito(newItem){

  const alert = document.querySelector('.alert')

   /*  setTimeout( function(){
    alert.classList.add('hide')
  }, 1000)
  alert.classList.remove('hide') */

  const inputElemento = tbody.getElementsByClassName('input__elemento')
  for(let i = 0; i < carrito.length; i++){
      if(carrito[i].title.trim() === newItem.title.trim()){
        carrito[i].cantidad ++;
        const inputValue = inputElemento[i]
        inputValue.value ++;
        carritoTotal()
        return null;
      }
    }

    carrito.push(newItem)
      
    renderCarrito()
}



function renderCarrito() {
    tbody.innerHTML = ''
    carrito.map(item => {
      const tr = document.createElement('tr')
      tr.classList.add('ItemCarrito')
      const content = `
      
      
          <td class="table__productos">
            <img src=${item.img}  alt="">
            <h6 class="title">${item.title}</h6>
          </td>
          <td class="table__price"><p>${item.precio}</p></td>
          <td class="table__cantidad">
            <input type="number" min="1" value=${item.cantidad} class="input__elemento">
            <button class="delete btn-shop btn-danger" onclick="removido()">x</button>
          </td>
      
      `
      tr.innerHTML = content;
      tbody.append(tr)

      tr.querySelector('.delete').addEventListener('click', removeItemCarrito)
      tr.querySelector('.input__elemento').addEventListener('change', sumaCantidad)
    })
     carritoTotal() 
} 

 function carritoTotal(){
  let total = 0;
  const itemCartTotal = document.querySelector('.itemCartTotal')
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ''))
    total = total + precio*item.cantidad
  })

  itemCartTotal.innerHTML = `Total $${total}`
  addLocalStorage()

  const precioTotal = total >= 300 ? true : false
  precioTotal ? itemCartTotal.innerHTML = `Total con descuento $${total*0.80}` : itemCartTotal.innerHTML = `Total $${total}`
}

function removeItemCarrito(e){
  const buttonDelete = e.target
  const tr = buttonDelete.closest('.ItemCarrito')
  const title = tr.querySelector('.title').textContent;
  for(let i = 0; i < carrito.length; i++){
    if(carrito[i].title.trim() === title.trim()){
      carrito.splice(i, 1)
      
    }
  }

  const alert = document.querySelector('.remove')

  /* setTimeout( function(){
    alert.classList.add('remove')
  }, 2000)
    alert.classList.remove('remove') */

  tr.remove()
  carritoTotal()
}

function sumaCantidad(e){
  const sumaInput = e.target
  const tr = sumaInput.closest('.ItemCarrito')
  const title = tr.querySelector('.title').textContent
  carrito.forEach(item => {
    if(item.title.trim() === title){
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      carritoTotal()
    }
  })
}

function addLocalStorage(){
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function(){
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if(storage){
    carrito = storage;
    renderCarrito()
  }
}  

// Alertas 

function sweetAlert(){
  Swal.fire({
    title: 'Producto agregado al carrito!',
    icon: 'success',
    confirmButtonText: 'OK'
  })
}

function suscribe(){
  Swal.fire({
    title: 'Gracias por suscribirte!',
    text: 'En breve recibirás noticias y descuentos exclusivos',
    icon: 'success',
    confirmButtonText: 'OK'
  })
}

function removido(){
  Swal.fire({
    title: 'Producto removido',
    icon: 'error',
    confirmButtonText: 'OK'
  })
}

// Botón comprar en la pestaña carrito
const comprar = document.getElementById('comprar')
comprar.addEventListener('click', () =>{
  window.open('http://www.mercadopago.com.ar');
})

