// Rotation automatique entre photo et vidéo toutes les 4 secondes
let currentMediaIndex = 0;
const mediaElements = document.querySelectorAll('.media-content');
const dots = document.querySelectorAll('.dot');
let mediaInterval;

// Prix des produits et packs
const productPrices = {
    'Vitmanie C Serum': 1999,
    'Produit 1': 1499,
    'Produit 2': 1799,
    'Pack Vitamine C Essentiel': 3580,
    'Pack Peau Parfaite — Routine Complète': 5870,
    'PACK COLLAGEN': 6200,
    'BOITE COLLAGEN': 1590
};

// Variables du panier
let currentCart = {
    productName: '',
    quantity: 1,
    price: 0,
    packType: '',
    wilaya: '',
    deliveryPrice: 0
};

function updateDots(index) {
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function showMedia(index) {
    // Masquer tous les éléments
    mediaElements.forEach((element, i) => {
        element.classList.remove('active');
        // Pause toutes les vidéos
        if (element.tagName === 'VIDEO') {
            element.pause();
            element.currentTime = 0;
        }
    });
    
    // Afficher l'élément sélectionné
    mediaElements[index].classList.add('active');
    
    // Si c'est une vidéo, la lire
    if (mediaElements[index].tagName === 'VIDEO') {
        mediaElements[index].play();
    }
    
    // Mettre à jour les points
    updateDots(index);
    currentMediaIndex = index;
}

function initMediaRotation() {
    if (mediaElements.length === 0) return;
    
    // Démarrer avec le premier élément
    showMedia(0);
    
    // Rotation toutes les 4 secondes
    mediaInterval = setInterval(() => {
        const nextIndex = (currentMediaIndex + 1) % mediaElements.length;
        showMedia(nextIndex);
    }, 4000); // 4 secondes
    
    // Ajouter les événements de clic sur les points
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(mediaInterval);
            showMedia(index);
            // Redémarrer la rotation après 4 secondes
            mediaInterval = setInterval(() => {
                const nextIndex = (currentMediaIndex + 1) % mediaElements.length;
                showMedia(nextIndex);
            }, 4000);
        });
    });
}

// Ouvrir le panier (avec choix de pack pour le hero)
function openCart() {
    console.log('openCart appelé');
    const cartModal = document.getElementById('cartModal');
    const cartSummary = document.getElementById('cartSummary');
    const continueBtn = document.getElementById('continueBtn');
    const packsSelection = document.querySelector('.cart-packs-selection');
    
    if (!cartModal) {
        console.error('Modal panier non trouvé');
        return;
    }
    
    // Réinitialiser le panier
    currentCart = {
        productName: '',
        quantity: 1,
        price: 0,
        packType: '',
        wilaya: '',
        deliveryPrice: 0
    };
    
    // Afficher la sélection des packs, masquer le résumé
    if (packsSelection) packsSelection.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'none';
    if (continueBtn) continueBtn.style.display = 'none';
    
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Panier ouvert');
}

// Ouvrir le panier directement avec un produit (pour les produits en bas)
function openCartDirect(productName, price) {
    console.log('openCartDirect appelé:', productName, price);
    const cartModal = document.getElementById('cartModal');
    const cartSummary = document.getElementById('cartSummary');
    const continueBtn = document.getElementById('continueBtn');
    const packsSelection = document.querySelector('.cart-packs-selection');
    
    if (!cartModal) {
        console.error('Modal panier non trouvé');
        return;
    }
    
    // Définir le produit directement
    currentCart = {
        productName: productName,
        quantity: 1,
        price: price,
        packType: productName,
        wilaya: '',
        deliveryPrice: 0
    };
    
    // Masquer la sélection des packs, afficher le résumé
    if (packsSelection) packsSelection.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    if (continueBtn) continueBtn.style.display = 'block';
    
    // Mettre à jour l'affichage
    const cartProductName = document.getElementById('cartProductName');
    const cartQuantity = document.getElementById('cartQuantity');
    
    if (cartProductName) cartProductName.textContent = productName;
    if (cartQuantity) cartQuantity.textContent = '1';
    
    updateCartTotal();
    
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Panier ouvert avec produit:', productName);
}

// Sélectionner un pack
function selectPack(packName, price) {
    currentCart.productName = packName;
    currentCart.packType = packName;
    currentCart.price = price;
    currentCart.quantity = 1;
    
    // Mettre à jour l'affichage
    const cartProductName = document.getElementById('cartProductName');
    const cartQuantity = document.getElementById('cartQuantity');
    const cartSummary = document.getElementById('cartSummary');
    const continueBtn = document.getElementById('continueBtn');
    const packsSelection = document.querySelector('.cart-packs-selection');
    
    if (cartProductName) cartProductName.textContent = packName;
    if (cartQuantity) cartQuantity.textContent = '1';
    
    // Masquer la sélection, afficher le résumé
    if (packsSelection) packsSelection.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    if (continueBtn) continueBtn.style.display = 'block';
    
    updateCartTotal();
    
    // Mettre en évidence le pack sélectionné
    document.querySelectorAll('.pack-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Trouver et sélectionner le pack cliqué
    const packOptions = document.querySelectorAll('.pack-option');
    packOptions.forEach(option => {
        const packHeader = option.querySelector('.pack-option-header h3');
        if (packHeader && packHeader.textContent.includes(packName.split(' ')[0])) {
            option.classList.add('selected');
        }
    });
}

// Fermer le panier
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    const cartSummary = document.getElementById('cartSummary');
    const continueBtn = document.getElementById('continueBtn');
    const packsSelection = document.querySelector('.cart-packs-selection');
    
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Réinitialiser l'affichage
    if (packsSelection) packsSelection.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'none';
    if (continueBtn) continueBtn.style.display = 'none';
    
    // Retirer la sélection des packs
    document.querySelectorAll('.pack-option').forEach(option => {
        option.classList.remove('selected');
    });
}

// Changer la quantité
function changeQuantity(delta) {
    const newQuantity = Math.max(1, currentCart.quantity + delta);
    currentCart.quantity = newQuantity;
    document.getElementById('cartQuantity').textContent = newQuantity;
    updateCartTotal();
}

// Mettre à jour le total du panier
function updateCartTotal() {
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const cartDeliveryPrice = document.getElementById('cartDeliveryPrice');
    
    if (!cartSubtotal || !cartTotal) {
        console.error('Éléments du panier non trouvés');
        return;
    }
    
    // S'assurer que le prix et la quantité sont valides
    const price = currentCart.price || 0;
    const quantity = currentCart.quantity || 1;
    const deliveryPrice = currentCart.deliveryPrice || 0;
    
    const subtotal = price * quantity;
    const total = subtotal + deliveryPrice;
    
    cartSubtotal.textContent = subtotal + ' DA';
    cartTotal.textContent = total + ' DA';
    
    // Mettre à jour le prix de livraison (0 dans le panier car wilaya pas encore sélectionnée)
    if (cartDeliveryPrice) {
        cartDeliveryPrice.textContent = 'À définir';
    }
    
    console.log('Total mis à jour:', { price, quantity, subtotal, deliveryPrice, total });
}

// Continuer vers le formulaire
function continueToForm() {
    closeCart();
    setTimeout(() => {
        openOrderForm(currentCart.productName, currentCart.quantity, currentCart.price);
    }, 300);
}

// Ouvrir le formulaire de commande
function openOrderForm(productName, quantity = 1, price = 0) {
    const modal = document.getElementById('orderModal');
    const productInput = document.getElementById('productName');
    
    if (productInput) {
        productInput.value = productName;
    }
    
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.value = quantity;
    }
    
    // Si pas de prix fourni, utiliser le prix par défaut
    if (price === 0) {
        price = productPrices[productName] || 0;
    }
    
    currentCart.price = price;
    currentCart.quantity = quantity;
    currentCart.productName = productName;
    
    // Réinitialiser les sélections
    const packSelect = document.getElementById('packType');
    const wilayaSelect = document.getElementById('wilaya');
    if (packSelect) {
        // Si le produit correspond à un pack, le sélectionner dans le dropdown
        if (productName === 'Pack Vitamine C Essentiel' || productName === 'Pack Peau Parfaite — Routine Complète') {
            packSelect.value = productName;
            currentCart.packType = productName;
        } else {
            packSelect.value = '';
            currentCart.packType = '';
        }
    }
    if (wilayaSelect) wilayaSelect.value = '';
    currentCart.deliveryPrice = 0; // Réinitialiser à 0 jusqu'à ce qu'une wilaya soit sélectionnée
    
    updateOrderSummary();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fermer le formulaire de commande
function closeOrderForm() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Réinitialiser le formulaire
    document.getElementById('orderForm').reset();
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const orderModal = document.getElementById('orderModal');
    
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === orderModal) {
        closeOrderForm();
    }
}

// Soumettre la commande vers WhatsApp
function submitOrder(event) {
    event.preventDefault();
    
    const packSelect = document.getElementById('packType');
    const wilayaSelect = document.getElementById('wilaya');
    const quantityInput = document.getElementById('quantity');
    
    const packType = packSelect?.value || '';
    const wilaya = wilayaSelect?.value || '';
    const quantity = parseInt(quantityInput?.value || 1);
    
    if (!packType) {
        alert('Veuillez sélectionner un type de pack');
        return;
    }
    
    if (!wilaya) {
        alert('Veuillez sélectionner une wilaya');
        return;
    }
    
    const price = productPrices[packType] || 0;
    const deliveryPrice = wilayasDelivery[wilaya];
    
    if (deliveryPrice === 9999) {
        alert('La livraison n\'est pas disponible pour cette wilaya. Veuillez choisir une autre wilaya.');
        return;
    }
    
    const subtotal = price * quantity;
    const total = subtotal + (deliveryPrice || 0);
    
    const formData = {
        packType: packType,
        wilaya: wilaya,
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerAddress: document.getElementById('customerAddress').value,
        quantity: quantity,
        price: price,
        subtotal: subtotal,
        delivery: deliveryPrice || 0,
        total: total
    };
    
    // Créer le message pour WhatsApp
    const deliveryText = deliveryPrice === 0 ? 'Gratuite' : `${formData.delivery} DA`;
    const message = `Bonjour, je souhaite passer une commande :%0A%0A` +
        `📦 Pack : ${formData.packType}%0A` +
        `🔢 Quantité : ${formData.quantity}%0A` +
        `💰 Prix unitaire : ${formData.price} DA%0A` +
        `📊 Sous-total : ${formData.subtotal} DA%0A` +
        `🏛️ Wilaya : ${formData.wilaya}%0A` +
        `🚚 Livraison : ${deliveryText}%0A` +
        `💵 Total : ${formData.total} DA%0A%0A` +
        `👤 Nom : ${formData.customerName}%0A` +
        `📱 Téléphone : ${formData.customerPhone}%0A` +
        `📍 Adresse : ${formData.customerAddress}%0A%0A` +
        `Merci !`;
    
    // Numéro WhatsApp (format international sans espaces)
    const whatsappNumber = '213670422850';
    
    // Ouvrir WhatsApp avec le message
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Fermer le modal après un court délai
    setTimeout(() => {
        closeOrderForm();
        alert('Votre commande a été envoyée sur WhatsApp !');
    }, 500);
}

// Rotation des images des produits - DÉSACTIVÉE
function initProductImageRotation() {
    // La rotation est désactivée, les images sont fixes
    // Cette fonction est conservée pour éviter les erreurs mais ne fait rien
}

// Remplir la liste des wilayas
function populateWilayas() {
    const wilayaSelect = document.getElementById('wilaya');
    if (!wilayaSelect) return;
    
    // Trier les wilayas par ordre alphabétique
    const sortedWilayas = Object.keys(wilayasDelivery).sort();
    
    sortedWilayas.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya;
        option.textContent = `${wilaya} (${wilayasDelivery[wilaya]} DA)`;
        option.setAttribute('data-price', wilayasDelivery[wilaya]);
        wilayaSelect.appendChild(option);
    });
}

// Mettre à jour le prix de livraison
function updateDeliveryPrice() {
    const wilayaSelect = document.getElementById('wilaya');
    const deliveryPriceSpan = document.getElementById('summaryDelivery');
    
    if (wilayaSelect && wilayaSelect.value) {
        const selectedOption = wilayaSelect.options[wilayaSelect.selectedIndex];
        const price = parseInt(selectedOption.getAttribute('data-price')) || 0;
        currentCart.deliveryPrice = price;
        currentCart.wilaya = wilayaSelect.value;
        
        if (deliveryPriceSpan) {
            if (price === 0) {
                deliveryPriceSpan.textContent = 'Gratuite';
            } else if (price === 9999) {
                deliveryPriceSpan.textContent = 'Non disponible';
                deliveryPriceSpan.style.color = 'red';
            } else {
                deliveryPriceSpan.textContent = price + ' DA';
                deliveryPriceSpan.style.color = '';
            }
        }
        updateOrderSummary();
    }
}

// Mettre à jour le prix du pack
function updatePackPrice() {
    const packSelect = document.getElementById('packType');
    const quantityInput = document.getElementById('quantity');
    
    if (packSelect && packSelect.value) {
        const packPrice = productPrices[packSelect.value] || 0;
        const quantity = parseInt(quantityInput?.value || 1);
        currentCart.packType = packSelect.value;
        currentCart.price = packPrice;
        currentCart.quantity = quantity;
        
        // Toujours mettre à jour le résumé, même si le prix est 0
        updateOrderSummary();
    } else {
        // Si aucun pack n'est sélectionné, réinitialiser
        currentCart.price = 0;
        currentCart.quantity = parseInt(quantityInput?.value || 1);
        updateOrderSummary();
    }
}

// Mettre à jour le résumé de commande
function updateOrderSummary() {
    const packPriceSpan = document.getElementById('summaryPackPrice');
    const deliveryPriceSpan = document.getElementById('summaryDelivery');
    const totalSpan = document.getElementById('summaryTotal');
    
    // S'assurer que le prix est correctement récupéré si un pack est sélectionné
    const packSelect = document.getElementById('packType');
    if (packSelect && packSelect.value && currentCart.price === 0) {
        currentCart.price = productPrices[packSelect.value] || 0;
    }
    
    const packPrice = currentCart.price * (currentCart.quantity || 1);
    const deliveryPrice = currentCart.deliveryPrice || 0;
    const total = packPrice + deliveryPrice;
    
    if (packPriceSpan) {
        packPriceSpan.textContent = packPrice + ' DA';
    }
    
    if (deliveryPriceSpan) {
        if (deliveryPrice === 0) {
            deliveryPriceSpan.textContent = 'Gratuite';
            deliveryPriceSpan.style.color = 'green';
        } else if (deliveryPrice === 9999) {
            deliveryPriceSpan.textContent = 'Non disponible';
            deliveryPriceSpan.style.color = 'red';
        } else {
            deliveryPriceSpan.textContent = deliveryPrice + ' DA';
            deliveryPriceSpan.style.color = '';
        }
    }
    
    if (deliveryPrice === 9999) {
        if (totalSpan) {
            totalSpan.textContent = 'Non disponible';
            totalSpan.style.color = 'red';
        }
    } else {
        if (totalSpan) {
            totalSpan.textContent = total + ' DA';
            totalSpan.style.color = '';
        }
    }
}

// Rotation des images dans le hero (2 photos)
let heroImageIndex = 0;
let heroImageInterval;

function initHeroImageRotation() {
    const heroImages = document.querySelectorAll('.hero-product .pack-image');
    
    console.log('Images trouvées:', heroImages.length);
    
    if (heroImages.length === 0) {
        console.log('Aucune image trouvée pour la rotation');
        return;
    }
    
    // Masquer toutes les images d'abord
    heroImages.forEach((img, index) => {
        img.classList.remove('active');
        img.style.display = 'none';
        console.log(`Image ${index} masquée:`, img.src);
    });
    
    // Afficher uniquement la première image
    if (heroImages[0]) {
        heroImages[0].classList.add('active');
        heroImages[0].style.display = 'block';
        console.log('Première image affichée:', heroImages[0].src);
    }
    
    heroImageIndex = 0;
    
    // Rotation automatique toutes les 3 secondes
    if (heroImageInterval) {
        clearInterval(heroImageInterval);
    }
    
    heroImageInterval = setInterval(() => {
        console.log('Rotation - Image actuelle:', heroImageIndex);
        
        // Masquer l'image actuelle
        if (heroImages[heroImageIndex]) {
            heroImages[heroImageIndex].classList.remove('active');
            heroImages[heroImageIndex].style.display = 'none';
            console.log('Image masquée:', heroImages[heroImageIndex].src);
        }
        
        // Passer à l'image suivante
        heroImageIndex = (heroImageIndex + 1) % heroImages.length;
        
        // Afficher la nouvelle image
        if (heroImages[heroImageIndex]) {
            heroImages[heroImageIndex].classList.add('active');
            heroImages[heroImageIndex].style.display = 'block';
            console.log('Nouvelle image affichée:', heroImages[heroImageIndex].src);
        }
    }, 3000);
}

// Initialiser la rotation des médias au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initMediaRotation();
    populateWilayas();
    initHeroImageRotation();
    
    // Vérifier que les images du produit 1 se chargent
    const productImages = document.querySelectorAll('.product-card-1 .product-image');
    productImages.forEach((img, index) => {
        img.onerror = function() {
            console.error('Erreur de chargement de l\'image:', img.src);
            this.style.display = 'none';
        };
        img.onload = function() {
            console.log('Image chargée:', img.src);
            if (index === 0) {
                this.style.opacity = '1';
                this.style.zIndex = '2';
            }
        };
    });
    
    initProductImageRotation();
});

// Arrêter la rotation quand la page n'est plus visible (pour économiser les ressources)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(mediaInterval);
        clearInterval(heroImageInterval);
        if (productImageIntervals[1]) clearInterval(productImageIntervals[1]);
        if (productImageIntervals[2]) clearInterval(productImageIntervals[2]);
    } else {
        initMediaRotation();
        initProductImageRotation();
        initHeroImageRotation();
    }
});
