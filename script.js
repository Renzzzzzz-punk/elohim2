// Funcionalidades de JavaScript para el Header / Hero

document.addEventListener("DOMContentLoaded", () => {
    console.log("Elohim Shop - Elegant Barber cargado correctamente.");
    
    // 1. Navbar sticky - Agrega la clase .scrolled al hacer scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Animaciones de entrada (Efecto cascada / Fade Up)
    const elementsToAnimate = [
        document.querySelector('.elegant-container'),
        document.querySelector('.elohim-title'),
        document.querySelector('.shop-container'),
        document.querySelector('.tagline'),
        document.querySelector('.buttons-container'),
        document.querySelector('.description')
    ];

    elementsToAnimate.forEach((el, index) => {
        if (el) {
            el.classList.add('animate-element');
            setTimeout(() => {
                el.classList.add('visible');
            }, 150 * (index + 1));
        }
    });

    // 3. Efecto Parallax interactivo con el movimiento del ratón
    const hero = document.querySelector('.hero');
    const carouselBg = document.querySelector('.carousel-bg');
    
    // Escalamos el carrusel un poco para que al moverse no se vean los bordes cortados
    carouselBg.style.transform = 'scale(1.05)';
    let isTransitioning = false;

    hero.addEventListener('mousemove', (e) => {
        if (isTransitioning) return;
        
        // Movimiento inverso a la posición del ratón
        const x = (window.innerWidth / 2 - e.pageX) / 60;
        const y = (window.innerHeight / 2 - e.pageY) / 60;
        
        // Aplicamos el movimiento mediante transform para que sea súper fluido
        carouselBg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
    });
    
    hero.addEventListener('mouseleave', () => {
        isTransitioning = true;
        carouselBg.style.transition = 'transform 0.5s ease-out';
        carouselBg.style.transform = 'scale(1.05) translate(0px, 0px)';
        
        setTimeout(() => {
            carouselBg.style.transition = 'none';
            isTransitioning = false;
        }, 500);
    });
    
    hero.addEventListener('mouseenter', () => {
        if (!isTransitioning) {
            carouselBg.style.transition = 'none';
        }
    });

    // 4. Carrusel de Imágenes de Fondo
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // Si hay más de 1 imagen, activamos el carrusel
    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Cambia la imagen cada 5 segundos
    }

    // 5. Scroll Animations (Intersection Observer para la sección Nosotros)
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100)));
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 85)) { // 85% de la pantalla para que se anime
                displayScrollElement(el);
            }
        });
    }
    
    // Initial check
    handleScrollAnimation();
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // 6. Scroll Spy (Active Nav Links al hacer scroll)
    const sections = document.querySelectorAll('header, section');
    const navItems = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Si hemos bajado un tercio de la sección
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // 7. Smooth scroll para los links de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. Lógica de la Sección de Productos y Lightbox Modal
    const productModal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-product-img');
    const modalTitle = document.getElementById('modal-product-title');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalWhatsappLink = document.getElementById('modal-whatsapp-link');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.querySelector('.product-modal-backdrop');
    const recentProductsList = document.getElementById('recent-products-list');

    // Cargar productos vistos recientemente desde localStorage
    let recentProducts = JSON.parse(localStorage.getItem('recent_products')) || [];

    // Función para renderizar los productos vistos recientemente en el Sidebar
    function renderRecentProducts() {
        if (!recentProductsList) return;
        
        if (recentProducts.length === 0) {
            recentProductsList.innerHTML = '<div class="no-recent">Ninguno visto aún</div>';
            return;
        }

        recentProductsList.innerHTML = '';
        recentProducts.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'recent-item-card';
            card.innerHTML = `
                <img src="${prod.img}" class="recent-item-img" alt="${prod.name}" onerror="this.src='https://placehold.co/100x100?text=Prod'">
                <div class="recent-item-info">
                    <h4 class="recent-item-name">${prod.name}</h4>
                    <span class="recent-item-price">${prod.price}</span>
                </div>
            `;
            
            // Hacer que al hacer clic en un producto del sidebar también se abra su proyección
            card.addEventListener('click', () => {
                openProductModal(prod);
            });
            
            recentProductsList.appendChild(card);
        });
    }

    // Función para abrir la proyección del producto
    function openProductModal(prod) {
        if (!productModal) return;
        
        modalImg.src = prod.img;
        modalTitle.textContent = prod.name;
        modalPrice.textContent = prod.price;
        modalDesc.textContent = prod.desc;
        
        // Crear mensaje personalizado para WhatsApp
        const textMessage = encodeURIComponent(`Hola Elohim Shop, estoy interesado en comprar el producto: *${prod.name}* por el precio de *${prod.price}*. ¿Tienen disponibilidad?`);
        modalWhatsappLink.href = `https://wa.me/51994511157?text=${textMessage}`;
        
        // Abrir Modal
        productModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Bloquear scroll de la página

        // Añadir a vistos recientemente
        addToRecent(prod);
    }

    // Agregar producto a la lista de vistos recientemente (máximo 4 productos y sin duplicar)
    function addToRecent(prod) {
        // Filtrar si ya existe
        recentProducts = recentProducts.filter(item => item.id !== prod.id);
        
        // Insertar al inicio de la lista
        recentProducts.unshift(prod);
        
        // Limitar a máximo 4 items
        if (recentProducts.length > 4) {
            recentProducts.pop();
        }
        
        // Guardar y renderizar
        localStorage.setItem('recent_products', JSON.stringify(recentProducts));
        renderRecentProducts();
    }

    // Cerrar modal
    function closeProductModal() {
        if (!productModal) return;
        productModal.classList.remove('open');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Event Listeners para cerrar modal
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);
    
    // Escuchar la tecla ESC para cerrar el modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProductModal();
    });

    // Registrar clics en las tarjetas de productos de la tienda
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price');
            const img = card.getAttribute('data-img');
            const desc = card.getAttribute('data-desc');
            
            openProductModal({ id, name, price, img, desc });
        });
    });

    // Render inicial del sidebar de vistos recientemente al cargar la página
    renderRecentProducts();

    // Resaltar dinámicamente el día actual en la sección de horarios
    const currentDay = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const dayRows = document.querySelectorAll('.day-row');
    dayRows.forEach(row => {
        if (parseInt(row.getAttribute('data-day')) === currentDay) {
            row.classList.add('current-day');
        }
    });

    // Inicializar mapa interactivo (Leaflet.js)
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Coordenadas exactas proporcionadas por el usuario para Barbería -spa "ELHOIM"
        const vesCoords = [-12.21568983753785, -76.952492491402];
        const map = L.map('map', {
            center: vesCoords,
            zoom: 17,
            scrollWheelZoom: false // Evita hacer zoom accidental al hacer scroll en la página
        });

        // Capa de mapa con estilo oscuro (CartoDB Dark Matter) para combinar con el diseño premium
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Icono naranja personalizado para el marcador
        const orangeIcon = L.divIcon({
            html: '<div style="background-color: #FF6B00; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(255, 107, 0, 0.8);"></div>',
            className: 'custom-map-pin',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        // Añadir el marcador y abrir popup
        L.marker(vesCoords, { icon: orangeIcon }).addTo(map)
            .bindPopup("<b style='color:#000;'>Barbería -spa ELHOIM</b><br><span style='color:#333;'>Av. María Elena Moyano con Av. Juan Velasco Alvarado, VES</span>")
            .openPopup();
    }
});
