import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyC_4QehikPfVElfPe4j9Jr-aG1xd-E54-U",

    authDomain:
        "win-market-10eaf.firebaseapp.com",

    projectId:
        "win-market-10eaf",

    storageBucket:
        "win-market-10eaf.firebasestorage.app",

    messagingSenderId:
        "82624065101",

    appId:
        "1:82624065101:web:6b0b822141010644057604"

};


/* =========================
   INITIALIZE FIREBASE
========================= */

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


/* =========================
   ADMIN UID
========================= */

const ADMIN_UID =
    "gBBdZRc75aamiX6EikyO2RdRniM2";


/* =========================
   START ADMIN
========================= */

onAuthStateChanged(
    auth,
    async function(user) {

        if (!user) {

            alert(
                "🔐 Tafadhali login kwanza."
            );

            window.location.href =
                "login.html";

            return;
        }


        console.log(
            "LOGIN UID:",
            user.uid
        );


        if (
            user.uid !==
            ADMIN_UID
        ) {

            alert(
                "❌ Account hii si Admin."
            );

            window.location.href =
                "index.html";

            return;
        }


        console.log(
            "✅ ADMIN CONFIRMED"
        );


        await loadAdminProducts();

    }
);


/* =========================
   LOAD PRODUCTS + CONTACTS
========================= */

async function loadAdminProducts() {

    const container =
        document.getElementById(
            "adminProducts"
        );


    if (!container) {

        console.error(
            "adminProducts haipo kwenye HTML."
        );

        return;
    }


    container.innerHTML = `

        <div class="loading">

            ⏳ Inapakia bidhaa...

        </div>

    `;


    try {

        /* =========================
           GET PRODUCTS
        ========================= */

        const productsSnapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        /* =========================
           GET SELLER CONTACTS
        ========================= */

        const contactsSnapshot =
            await getDocs(
                collection(
                    db,
                    "sellerContacts"
                )
            );


        /*
         * Tengeneza map ya:
         *
         * sellerId → phone
         *
         */

        const sellerPhones =
            new Map();


        contactsSnapshot.forEach(
            function(item) {

                const contact =
                    item.data();


                if (
                    contact.sellerId &&
                    contact.phone
                ) {

                    sellerPhones.set(
                        contact.sellerId,
                        contact.phone
                    );

                }

            }
        );


        console.log(
            "PRODUCTS:",
            productsSnapshot.size
        );

        console.log(
            "SELLER CONTACTS:",
            contactsSnapshot.size
        );


        container.innerHTML = "";


        if (
            productsSnapshot.empty
        ) {

            container.innerHTML = `

                <div class="empty">

                    <div style="font-size:45px;">
                        🛍️
                    </div>

                    <h3>
                        Hakuna bidhaa
                    </h3>

                    <p>
                        Hakuna bidhaa zilizowekwa.
                    </p>

                </div>

            `;

            return;
        }


        /* =========================
           CREATE CARDS
        ========================= */

        productsSnapshot.forEach(
            function(item) {

                const product =
                    item.data();


                const phone =
                    sellerPhones.get(
                        product.sellerId
                    ) ||
                    "Namba haijawekwa";


                createAdminCard(
                    product,
                    item.id,
                    phone
                );

            }
        );

    }

    catch(error) {

        console.error(
            "FIRESTORE ERROR:",
            error
        );


        container.innerHTML = `

            <div class="empty">

                <div style="font-size:45px;">
                    ⚠️
                </div>

                <h3>
                    Imeshindikana kupakia bidhaa
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


/* =========================
   ADMIN PRODUCT CARD
========================= */

function createAdminCard(
    product,
    productId,
    phone
) {

    const container =
        document.getElementById(
            "adminProducts"
        );


    if (!container) {
        return;
    }


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "product";


    const name =
        product.name ||
        "Bidhaa";


    const category =
        product.category ||
        "Other";


    const price =
        Number(
            product.price || 0
        );


    const location =
        product.location ||
        "Tanzania";


    const description =
        product.description ||
        "Hakuna maelezo.";


    const seller =
        product.sellerName ||
        "Muuzaji";


    card.innerHTML = `

        <div class="product-icon">
            📦
        </div>


        <div class="category">

            ${escapeHTML(category)}

        </div>


        <h3>

            ${escapeHTML(name)}

        </h3>


        <div class="price">

            TSh ${price.toLocaleString()}

        </div>


        <div class="location">

            📍 ${escapeHTML(location)}

        </div>


        <div class="seller">

            👤 Seller:
            ${escapeHTML(seller)}

        </div>


        <div class="seller">

            📝 ${escapeHTML(description)}

        </div>


        <!-- =====================
             SELLER PHONE
        ====================== -->

        <div style="
            margin-top:15px;
            padding:14px;
            background:#fff7ed;
            border:1px solid #fed7aa;
            border-radius:12px;
        ">

            <strong style="
                display:block;
                margin-bottom:6px;
                color:#9a3412;
            ">

                📞 Namba ya Muuzaji

            </strong>


            <span style="
                font-size:16px;
                font-weight:bold;
                color:#172033;
            ">

                ${escapeHTML(phone)}

            </span>


            ${
                phone !== "Namba haijawekwa"
                ?

                `

                <br>

                <a
                    href="tel:${escapeAttribute(phone)}"
                    style="
                        display:inline-block;
                        margin-top:10px;
                        padding:9px 14px;
                        background:#172033;
                        color:white;
                        text-decoration:none;
                        border-radius:8px;
                        font-size:13px;
                        font-weight:bold;
                    "
                >

                    📞 Piga Simu

                </a>

                `

                :

                ""

            }

        </div>


        <!-- =====================
             DELETE
        ====================== -->

        <button
            class="delete-btn"
            type="button"
        >

            🗑️ IMEUZWA — ONDOA

        </button>

    `;


    const deleteButton =
        card.querySelector(
            ".delete-btn"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function() {

                deleteProduct(
                    productId,
                    name
                );

            }
        );

    }


    container.appendChild(
        card
    );

}


/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(
    productId,
    productName
) {

    const user =
        auth.currentUser;


    if (!user) {

        alert(
            "❌ Admin hajaingia."
        );

        return;
    }


    if (
        user.uid !==
        ADMIN_UID
    ) {

        alert(
            "❌ Huna ruhusa ya Admin."
        );

        return;
    }


    const confirmed =
        confirm(

            "⚠️ THIBITISHA\n\n" +

            "Je, bidhaa hii imeuzwa?\n\n" +

            "📦 " +
            productName +

            "\n\n" +

            "Bidhaa itaondolewa kabisa."

        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "products",
                productId
            )
        );


        alert(
            "✅ Bidhaa imeondolewa."
        );


        await loadAdminProducts();

    }

    catch(error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        alert(
            "❌ Imeshindikana kufuta bidhaa.\n\n" +
            error.message
        );

    }

}


/* =========================
   LOGOUT
========================= */

async function logoutAdmin() {

    try {

        await signOut(auth);

        window.location.href =
            "login.html";

    }

    catch(error) {

        console.error(
            error
        );

        alert(
            "❌ Imeshindikana kutoka."
        );

    }

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(text) {

    return String(text)
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================
   GLOBAL
========================= */

window.deleteProduct =
    deleteProduct;

window.logoutAdmin =
    logoutAdmin;