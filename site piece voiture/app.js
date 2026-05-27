// App state and product catalog data
const app = (() => {
    const PHONE_NUMBER = "33758313813"; // WhatsApp target: +33 07 58 31 38 13 (french mobile, drops leading 0)

    const products = [
        {
            id: "BR-992-CC",
            name: "Disque de Frein Carbone-Céramique Brembo",
            brand: "Brembo Racing",
            price: 1250,
            category: "Freinage",
            condition: "Neuf",
            reference: "BR-992-CC",
            image: "assets/images/brake_disc.png",
            desc: "Conçu pour les véhicules de sport de haute puissance, ce disque en carbone-céramique Brembo offre un freinage infatigable même à des températures extrêmes. Gain de poids de 50% par rapport à l'acier classique pour une agilité accrue.",
            specs: ["Diamètre : 380mm x 34mm", "Composition : Carbone-Céramique", "Plaquettes haute performance incluses", "Homologué route & circuit"]
        },
        {
            id: "GT-3076R-TS",
            name: "Turbocompresseur Twin-Scroll Garrett",
            brand: "Garrett Motion",
            price: 890,
            category: "Moteur",
            condition: "Neuf",
            reference: "GT-3076R-TS",
            image: "assets/images/turbocharger.png",
            desc: "Le turbocompresseur Garrett GT-3076R intègre une technologie de roulement à billes en céramique double rangée et un carter d'échappement Twin-Scroll pour une réponse instantanée à bas régime et une puissance maximale de 550 chevaux.",
            specs: ["Roulements en céramique double", "Roue de compresseur usinée CNC", "Pression max : 2.2 bar", "Entrées d'eau et d'huile optimisées"]
        },
        {
            id: "AD-CF-VOLANT",
            name: "Volant Sport Carbone & Alcantara",
            brand: "ApexDrive",
            price: 420,
            category: "Habitacle",
            condition: "Neuf",
            reference: "AD-CF-VOLANT",
            image: "assets/images/steering_wheel.png",
            desc: "Améliorez votre expérience de conduite avec ce volant sport ergonomique à méplat. Alliant fibre de carbone 3K haute brillance et véritable alcantara italien pour un grip optimal et un design racing haut de gamme.",
            specs: ["Fibre de carbone 3K véritable", "Revêtement Alcantara premium", "Coutures rouges faites main", "Inserts palettes et commandes inclus"]
        },
        {
            id: "HL-LED-MTX-04",
            name: "Optique de Phare Matrix LED Intelligent",
            brand: "Hella OEM",
            price: 750,
            category: "Éclairage",
            condition: "Reconditionné",
            reference: "HL-LED-MTX-04",
            image: "assets/images/headlight.png",
            desc: "Phare avant gauche à technologie LED Matrix adaptative. Analyse la route pour orienter précisément les faisceaux lumineux et éviter d'éblouir les autres usagers tout en offrant une clarté nocturne maximale.",
            specs: ["Faisceau adaptatif matriciel", "Indicateurs séquentiels dynamiques", "Optique traitée anti-UV & rayures", "Garantie de 12 mois"]
        },
        {
            id: "KW-V3-102",
            name: "Combinés Filetés KW suspension V3",
            brand: "KW Automotive",
            price: 1480,
            category: "Suspension",
            condition: "Neuf",
            reference: "KW-V3-102",
            image: "assets/images/suspension.png",
            desc: "La suspension filetée KW V3 est le nec plus ultra pour la route et la piste. Permet un réglage indépendant de la détente et de la compression pour adapter l'amortissement à votre châssis de manière professionnelle.",
            specs: ["Amortissement réglable 16 clics", "Technologie inox brevetée", "Rabaissement homologué 20 à 45mm", "Stabilité accrue en appui serré"]
        },
        {
            id: "TX-EXH-BURN-09",
            name: "Ligne d'Échappement Titanium Sport",
            brand: "Akrapovič Edition",
            price: 1150,
            category: "Échappement",
            condition: "Occasion",
            reference: "TX-EXH-BURN-09",
            image: "assets/images/exhaust.png",
            desc: "Silencieux d'échappement sport en titane allégé avec embouts brûlés bleuis emblématiques. Offre une sonorité rauque et sportive sans résonance désagréable dans l'habitacle et optimise les flux de gaz pour un gain de couple.",
            specs: ["Allègement massif de 8.4 kg", "Embouts titane bleuis 102mm", "Sonorité homologuée valve fermée", "Excellent état, sans déformation"]
        }
    ];

    // Filter states
    let activeCategory = "all";
    let activeConditions = ["Neuf", "Reconditionné", "Occasion"];
    let priceMin = 0;
    let priceMax = 2000;
    let searchQuery = "";

    // DOM Elements
    let productsGrid, noResults, searchInput, searchClearBtn, priceMinInput, priceMaxInput, btnApplyFilters, btnResetFilters, detailsModal, btnCloseModal, modalContent;

    function init() {
        // Cache DOM Elements
        productsGrid = document.getElementById("products-grid");
        noResults = document.getElementById("no-results");
        searchInput = document.getElementById("search-input");
        searchClearBtn = document.getElementById("search-clear-btn");
        priceMinInput = document.getElementById("price-min");
        priceMaxInput = document.getElementById("price-max");
        btnApplyFilters = document.getElementById("btn-apply-filters");
        btnResetFilters = document.getElementById("btn-reset-filters");
        detailsModal = document.getElementById("details-modal");
        btnCloseModal = document.getElementById("btn-close-modal");
        modalContent = document.getElementById("modal-content");

        setupEventListeners();
        updateCategoryCounts();
        renderProducts();
    }

    function setupEventListeners() {
        // Live Search Input
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            searchClearBtn.style.display = searchQuery ? "block" : "none";
            renderProducts();
        });

        // Clear Search Input
        searchClearBtn.addEventListener("click", () => {
            searchInput.value = "";
            searchQuery = "";
            searchClearBtn.style.display = "none";
            renderProducts();
        });

        // Category Filter Items
        const categoryItems = document.querySelectorAll("#category-filters .filter-item");
        categoryItems.forEach(item => {
            item.addEventListener("click", () => {
                categoryItems.forEach(c => c.classList.remove("active"));
                item.classList.add("active");
                activeCategory = item.getAttribute("data-category");
                renderProducts();
            });
        });

        // Apply Price & Condition Filters
        btnApplyFilters.addEventListener("click", () => {
            // Get selected conditions
            const checkedConditions = document.querySelectorAll("input[name='condition']:checked");
            activeConditions = Array.from(checkedConditions).map(cb => cb.value);

            // Get prices
            priceMin = parseFloat(priceMinInput.value) || 0;
            priceMax = parseFloat(priceMaxInput.value) || 999999;

            renderProducts();
        });

        // Reset Filters Button (No Results State)
        btnResetFilters.addEventListener("click", resetAllFilters);

        // Modal Close (clicking X or background)
        btnCloseModal.addEventListener("click", closeModal);
        detailsModal.addEventListener("click", (e) => {
            if (e.target === detailsModal) closeModal();
        });

        // Esc key to close modal
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && detailsModal.style.display === "flex") {
                closeModal();
            }
        });
    }

    function resetAllFilters() {
        activeCategory = "all";
        activeConditions = ["Neuf", "Reconditionné", "Occasion"];
        priceMin = 0;
        priceMax = 2000;
        searchQuery = "";

        // Reset inputs in DOM
        searchInput.value = "";
        searchClearBtn.style.display = "none";
        priceMinInput.value = 0;
        priceMaxInput.value = 2000;

        document.querySelectorAll("input[name='condition']").forEach(cb => {
            cb.checked = true;
        });

        const categoryItems = document.querySelectorAll("#category-filters .filter-item");
        categoryItems.forEach(c => c.classList.remove("active"));
        document.querySelector("[data-category='all']").classList.add("active");

        renderProducts();
    }

    function updateCategoryCounts() {
        const counts = { all: products.length };
        products.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });

        document.getElementById("count-all").textContent = counts.all || 0;
        document.getElementById("count-moteur").textContent = counts["Moteur"] || 0;
        document.getElementById("count-echappement").textContent = counts["Échappement"] || 0;
        document.getElementById("count-freinage").textContent = counts["Freinage"] || 0;
        document.getElementById("count-suspension").textContent = counts["Suspension"] || 0;
        document.getElementById("count-habitacle").textContent = counts["Habitacle"] || 0;
        document.getElementById("count-eclairage").textContent = counts["Éclairage"] || 0;
    }

    function renderProducts() {
        // Filter logic
        const filtered = products.filter(p => {
            const matchesSearch = searchQuery === "" || 
                p.name.toLowerCase().includes(searchQuery) || 
                p.brand.toLowerCase().includes(searchQuery) || 
                p.reference.toLowerCase().includes(searchQuery) ||
                p.category.toLowerCase().includes(searchQuery);

            const matchesCategory = activeCategory === "all" || p.category === activeCategory;
            const matchesCondition = activeConditions.includes(p.condition);
            const matchesPrice = p.price >= priceMin && p.price <= priceMax;

            return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
        });

        // Update counts
        updateCategoryCounts();

        // Render logic
        productsGrid.innerHTML = "";
        if (filtered.length === 0) {
            productsGrid.style.display = "none";
            noResults.style.display = "flex";
        } else {
            productsGrid.style.display = "grid";
            noResults.style.display = "none";

            filtered.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";
                
                const conditionClass = `badge-${p.condition.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
                const specItems = p.specs.slice(0, 2).map(spec => `
                    <li>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>${spec}</span>
                    </li>
                `).join('');

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <span class="card-badge ${conditionClass}">${p.condition}</span>
                        <span class="category-tag">${p.category}</span>
                        <img src="${p.image}" alt="${p.name}" class="card-img">
                    </div>
                    <div class="card-info">
                        <h3>${p.name}</h3>
                        <ul class="product-specs">
                            ${specItems}
                        </ul>
                        <div class="price-row">
                            <span class="price-val">${p.price.toLocaleString('fr-FR')} €</span>
                            <button onclick="app.openDetail('${p.id}')" class="btn btn-primary btn-sm">Détails</button>
                        </div>
                    </div>
                `;
                productsGrid.appendChild(card);
            });
        }
    }

    function openDetail(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Custom Whatsapp Text Builder
        const messageText = `Bonjour, je suis très intéressé(e) par votre annonce pour la pièce automobile suivante :

🛠️ *${product.name}*
📌 Référence : ${product.reference}
🏷️ État : ${product.condition}
💰 Prix : ${product.price.toLocaleString('fr-FR')} €

Est-elle toujours disponible ?`;

        const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(messageText)}`;

        const conditionClass = `badge-${product.condition.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
        const specListHTML = product.specs.map(spec => `
            <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blue); flex-shrink: 0;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${spec}</span>
            </li>
        `).join('');

        modalContent.innerHTML = `
            <div class="modal-image-col">
                <div class="modal-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="modal-image">
                </div>
                <div class="modal-badges">
                    <span class="modal-badge ${conditionClass}">${product.condition}</span>
                    <span class="modal-badge modal-badge-category">${product.category}</span>
                </div>
            </div>
            
            <div class="modal-info-col">
                <div>
                    <h2>${product.name}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">Marque : ${product.brand} | Réf : ${product.reference}</p>
                </div>

                <div>
                    <h4 class="modal-desc-title">Description</h4>
                    <p class="modal-desc">${product.desc}</p>
                </div>

                <div>
                    <h4 class="modal-desc-title">Spécifications Techniques</h4>
                    <ul class="product-specs" style="gap: 0.5rem;">
                        ${specListHTML}
                    </ul>
                </div>

                <div class="modal-action-row">
                    <div class="modal-price-col">
                        <span>Prix de vente</span>
                        <span class="modal-price">${product.price.toLocaleString('fr-FR')} €</span>
                    </div>
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.86.002-2.638-1.016-5.118-2.87-6.974C16.608 1.916 14.133.89 11.5.89c-5.441 0-9.862 4.418-9.865 9.864-.001 1.638.5 3.238 1.452 4.836l-.994 3.634 3.73-.977zm11.567-5.613c-.31-.154-1.836-.906-2.12-.1-1.01.282-1.836 1.836.906-2.12-.1-.085-.154-.15-.226-.265-.115-.171-1.545-2.072-1.545-3.896 0-1.258.627-1.9.854-2.135.226-.235.49-.294.654-.294.162 0 .324.003.465.01.144.007.34.025.52.266.197.265.753 1.836.818 1.97.065.13.109.283.022.457-.087.174-.13.283-.26.435-.13.153-.274.34-.39.458-.13.13-.266.27-.115.52.15.25.663 1.089 1.422 1.764.978.87 1.802 1.14 2.057 1.268.255.127.404.108.553-.064.15-.174.64-.746.812-.998.172-.253.344-.212.576-.127.233.085 1.472.694 1.724.82.25.128.417.192.48.3.063.108.063.623-.143 1.201-.207.578-1.205 1.127-1.69 1.168-.485.04-1.604-.492-4.524-1.657z"/>
                        </svg>
                        <span>Contacter sur WhatsApp</span>
                    </a>
                </div>
            `;

        detailsModal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    function closeModal() {
        detailsModal.style.display = "none";
        document.body.style.overflow = ""; // Re-enable background scroll
    }

    function setCategory(cat) {
        activeCategory = cat;
        
        // Update class list in HTML filters
        const categoryItems = document.querySelectorAll("#category-filters .filter-item");
        categoryItems.forEach(item => {
            if (item.getAttribute("data-category") === cat) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        renderProducts();
    }

    // Initialize application when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Public API
    return {
        openDetail,
        setCategory,
        resetAllFilters
    };
})();
