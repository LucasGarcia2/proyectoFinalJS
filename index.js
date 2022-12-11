const productosArray = []
class Producto {
    constructor(id, price, title, image, description, category, all) {
        this.id = id
        this.price = price
        this.title = title
        this.image = image
        this.description = description
        this.category = category
        this.all = all
    }
}

productosArray.push(new Producto(1, 50, 'Aceite Motul', "./img/motul.jpg", 'Aceite semi sintetico primera marca', 'aceites', 'todos'))
productosArray.push(new Producto(2, 40, 'Aceite Castrol', "./img/castrol.jpg", 'Aceite mineral de primera marca', 'aceites', 'todos'))
productosArray.push(new Producto(3, 80, 'Casco Hawk', "./img/hawk.jpeg", 'Casco nacional de excelente calidad', 'cascos', 'todos'))
productosArray.push(new Producto(4, 120, 'Casco Shark', "./img/shark.jpeg", 'Casco importante de primera marca', 'cascos', 'todos'))
productosArray.push(new Producto(5, 150, 'Neumaticos Michelin', "./img/michelin.jpg", 'Neumatico de excelentes prestaciones', 'neumaticos', 'todos'))
productosArray.push(new Producto(6, 200, 'Neumaticos Pirelli', "./img/pirelli.jpg", 'Neumaticos imortados de calidad premium', 'neumaticos', 'todos'))
productosArray.push(new Producto(7, 40, 'Guantes ProBiker', "./img/probiker.jpg", 'Guantes de fabriacion nacional excelente calidad', 'guantes', 'todos'))
productosArray.push(new Producto(8, 200, 'Guantes HD', "./img/hd.jpg", 'Guantes Harley Davidson importados primera marca', 'guantes', 'todos'))
console.log(JSON.stringify(productosArray))


let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;


function renderizarProductos() {
    productosArray.forEach((info) => {
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.title;
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.image);
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${divisa}${info.price}`;
        const miNodoDescription = document.createElement('p');
        miNodoDescription.classList.add('card-text');
        miNodoDescription.textContent = info.description;
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = 'Agregar al carrito';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoDescription);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}


function anyadirProductoAlCarrito(evento) {
    carrito.push(evento.target.getAttribute('marcador'))
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}


function renderizarCarrito() {
    DOMcarrito.textContent = '';
    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {
        const miItem = productosArray.filter((itemProductosArray) => {
            return itemProductosArray.id === parseInt(item);
        });
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].title} - ${divisa}${miItem[0].price}`;
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    DOMtotal.textContent = calcularTotal();
}


function borrarItemCarrito(evento) {
    const id = evento.target.dataset.item;
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    renderizarCarrito();
    guardarCarritoEnLocalStorage();

}


function calcularTotal() {
    return carrito.reduce((total, item) => {
        const miItem = productosArray.filter((itemProductosArray) => {
            return itemProductosArray.id === parseInt(item);
        });
        return total + miItem[0].price;
    }, 0).toFixed(2);
}


function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
    localStorage.clear();

}

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    if (miLocalStorage.getItem('carrito') !== null) {
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

DOMbotonVaciar.addEventListener('click', vaciarCarrito);

cargarCarritoDeLocalStorage();
renderizarProductos();
renderizarCarrito();

const divCards = document.querySelector('.card')
const list = document.querySelector('#lista')
const botonBuscar = document.querySelector('#buscar')
const mostrarPorCategorias = async() => {
    const categoriasFetch = await fetch ('category.json')
    const categoriasJson = await categoriasFetch.json ()
    categoriasJson.forEach(cat=>{
        const option = document.createElement('option')
        option.innerText = `${cat}`
        lista.append(option)
    })
}


const buscarProductosXCategoria = async () => {
    items.innerHTML = ''
    const categoriaElegida = lista.value
    const productosFetch = await fetch ('productos.json')
    const productosJson = await productosFetch.json()
    const productosFiltrados = productosJson.filter(prod=>prod.category===categoriaElegida || prod.all===categoriaElegida)
    productosFiltrados.forEach(prod => {
        const {id, image, title, price, description, category} = prod
         const miNodo = document.createElement('div');
         miNodo.classList.add('card', 'col-sm-4');
         const miNodoCardBody = document.createElement('div');
         miNodoCardBody.classList.add('card-body');
         const miNodoTitle = document.createElement('h5');
         miNodoTitle.classList.add('card-title');
         miNodoTitle.textContent = prod.title;
         const miNodoImagen = document.createElement('img');
         miNodoImagen.classList.add('img-fluid');
         miNodoImagen.setAttribute('src', prod.image);
         const miNodoPrecio = document.createElement('p');
         miNodoPrecio.classList.add('card-text');
         miNodoPrecio.textContent = `${divisa}${prod.price}`;
         const miNodoDescription = document.createElement('p');
         miNodoDescription.classList.add('card-text');
         miNodoDescription.textContent = prod.description;
         const miNodoBoton = document.createElement('button');
         miNodoBoton.classList.add('btn', 'btn-primary');
         miNodoBoton.textContent = 'Agregar al carrito';
         miNodoBoton.setAttribute('marcador', prod.id);
         miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
         miNodoCardBody.appendChild(miNodoImagen);
         miNodoCardBody.appendChild(miNodoTitle);
         miNodoCardBody.appendChild(miNodoPrecio);
         miNodoCardBody.appendChild(miNodoDescription);
         miNodoCardBody.appendChild(miNodoBoton);
         miNodo.appendChild(miNodoCardBody);
         DOMitems.appendChild(miNodo);
     });
 }

mostrarPorCategorias()
botonBuscar.onclick = buscarProductosXCategoria
