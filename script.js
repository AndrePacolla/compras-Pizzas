let cart =[];
let modalQt = 1;
let modalKey = 0;


const q = (el) => document.querySelector(el); // representa pagina toda , restritivo para document html.Deixa o cpo mais semantico.
const qAll = (el) => document.querySelectorAll(el);   



// 1- Reconstruindo  com clone.  2- append(), no .pizza-area .

pizzaJson.map((item  , index) =>{
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    

    pizzaItem.setAttribute('data-key' , index); 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click' , (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1; // reset ao entrar no modal
        modalKey = key; // passei key na variavel global para utilizar ela tbm fora desse click;


        // 5- modal é unico! Ao clicar ele reponde a chave que indentifica a pizza.
        
        q('.pizzaBig img').src = pizzaJson[key].img
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; 
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        q('.pizzaInfo--size.selected').classList.remove('selected');// reset-Modal-size
        qAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        q('.pizzaInfo--qt').innerHTML = modalQt ;// sempre que abrir o modal ele preenche a variavel com valor definido;

        // 3- Ao clicar aparace o window (modal) 

        q('.pizzaWindowArea').style.display = 'flex';
        q('.pizzaWindowArea').style.opacity = 0;
        setTimeout(()=>{
            q('.pizzaWindowArea').style.opacity = 1;
        },200);
    });

     q('.pizza-area').append(pizzaItem)
  
});


//Eventos do modal

function closeModal(){
    q('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=>{
        q('.pizzaWindowArea').style.display = 'none';
      },500);
    };

    qAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((button) =>{
        button.addEventListener('click', closeModal); 
    });
    
    
    q('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
        if(modalQt > 1 ){
            modalQt--; 
            q('.pizzaInfo--qt').innerHTML = modalQt ;
        }
    });

    q('.pizzaInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        q('.pizzaInfo--qt').innerHTML = modalQt;
    });

    qAll('.pizzaInfo--size').forEach((size , sizeIndex) =>{
        size.addEventListener('click',()=>{
           q('.pizzaInfo--size.selected').classList.remove('selected');
           size.classList.add('selected');
        })
    })
    

    q('.pizzaInfo--addButton').addEventListener('click', ()=>{

    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size; 

    let key = cart.findIndex((index)=> index.identifier == identifier);
        if(key > -1){
            cart[key].qt += modalQt 
        }else{ 
          cart.push({
          identifier,
          id: pizzaJson[modalKey].id, 
          size,
          qt: modalQt
        })
    }
      updateCart();
      closeModal();
    });



    // Comando no mobile open , close .
    q('.menu-openner').addEventListener('click' , ()=>{
        if(cart.length > 0){
            q('aside').style.left = '0';
        }
    });

    q('.menu-closer').addEventListener('click',()=>{
        q('aside').style.left = '100vw';
    });


    
    // tem dois papeis 1-  mostra o carrinho  se tiver item  e  2- preencher ( mostrar ) o que tem dentro do carrinho atravez do id ,usando for e find


    function updateCart(){

        q('.menu-openner span').innerHTML = cart.length;
        if(cart.length > 0){
            q('aside').classList.add('show');
            q('.cart').innerHTML = '';

            let subtotal = 0;
            let desconto = 0;
            let total = 0;
            
           for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id === cart[i].id)//return apenas os ids iguais  dentro do carrinho.
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = q('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName = '';
            
            switch(cart[i].size){
                case 0:
                 pizzaSizeName = 'P'
                 break;
                case 1:
                 pizzaSizeName = 'M'
                 break;
                case 2:
                 pizzaSizeName = 'G'
                 break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);//primeiro parametro remove o item , segunfo quantidade a ser removido
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });

            q('.cart').append(cartItem);
           }

           desconto = subtotal * 0.1; // pega 10% do valor subtotal
           total = subtotal - desconto;
           q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
           q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
           q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

        }else{
            q('aside').classList.remove('show');
            q('aside').style.left = '100vw';
        }
    }