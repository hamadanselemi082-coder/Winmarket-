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
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



/* =====================================================
   FIREBASE
===================================================== */

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


const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);



/* =====================================================
   CLOUDINARY
===================================================== */

const CLOUDINARY_CLOUD_NAME =
    "qargdhqd";


const CLOUDINARY_UPLOAD_PRESET =
    "winmarket_products";



/* =====================================================
   SETTINGS
===================================================== */

const MARKET_WHATSAPP =
    "255760615325";


const ADMIN_UID =
    "gBBdZRc75aamiX6EikyO2RdRniM2";


let currentUser = null;


/* =====================================================
   CURRENT COMMENT PRODUCT
===================================================== */

let currentCommentProductId = null;

let currentCommentProductName = "";



/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
    auth,
    function(user) {

        currentUser =
            user;


        const userArea =
            document.getElementById(
                "userArea"
            );


        const guestArea =
            document.getElementById(
                "guestArea"
            );


        const userName =
            document.getElementById(
                "userName"
            );


        const admin =
            document.getElementById(
                "adminPanelLink"
            );


        /* ADMIN */

        if (admin) {

            admin.style.display =
                user &&
                user.uid === ADMIN_UID
                    ? "block"
                    : "none";

        }


        /* USER LOGGED IN */

        if (user) {

            if (userArea) {

                userArea.style.display =
                    "flex";

            }


            if (guestArea) {

                guestArea.style.display =
                    "none";

            }


            if (userName) {

                userName.innerText =
                    "👤 " +
                    (
                        user.displayName ||
                        user.email?.split("@")[0] ||
                        "Mtumiaji"
                    );

            }

        }


        /* GUEST */

        else {

            if (userArea) {

                userArea.style.display =
                    "none";

            }


            if (guestArea) {

                guestArea.style.display =
                    "flex";

            }

        }

    }
);



/* =====================================================
   LOGOUT
===================================================== */

async function logoutUser() {

    try {

        await signOut(auth);

        window.location.reload();

    }

    catch (error) {

        console.error(error);

        alert(
            "Imeshindikana kutoka kwenye akaunti."
        );

    }

}


window.logoutUser =
    logoutUser;



/* =====================================================
   MENU
===================================================== */

function toggleMenu() {

    const menu =
        document.getElementById(
            "navMenu"
        );


    if (menu) {

        menu.classList.toggle(
            "show"
        );

    }

}


window.toggleMenu =
    toggleMenu;



function closeMenu() {

    const menu =
        document.getElementById(
            "navMenu"
        );


    if (menu) {

        menu.classList.remove(
            "show"
        );

    }

}


window.closeMenu =
    closeMenu;



/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    const productList =
        document.getElementById(
            "productList"
        );


    if (!productList) {

        return;

    }


    productList.innerHTML = `

        <div class="loading">

            ⏳ Inapakia bidhaa...

        </div>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "products"
                )
            );


        productList.innerHTML =
            "";


        if (snapshot.empty) {

            productList.innerHTML = `

                <div class="empty-products">

                    <div>
                        🛍️
                    </div>

                    <h3>
                        Hakuna bidhaa bado
                    </h3>

                    <p>

                        Kuwa wa kwanza kuweka bidhaa
                        kwenye WIN MARKET.

                    </p>

                </div>

            `;

            return;

        }


        snapshot.forEach(
            function(doc) {

                createProductCard(
                    doc.data(),
                    doc.id
                );

            }
        );

    }

    catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );


        productList.innerHTML = `

            <div class="empty-products">

                <div>
                    ⚠️
                </div>

                <h3>
                    Imeshindikana kupakia bidhaa
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


window.loadProducts =
    loadProducts;



/* =====================================================
   CREATE PRODUCT CARD
===================================================== */

function createProductCard(
    product,
    id
) {

    const productList =
        document.getElementById(
            "productList"
        );


    if (!productList) {

        return;

    }


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "product-card";


    card.dataset.category =
        product.category ||
        "Other";


    const name =
        product.name ||
        "Bidhaa";


    const category =
        product.category ||
        "Other";


    const price =
        Number(
            product.price ||
            0
        );


    const location =
        product.location ||
        "Tanzania";


    const description =
        product.description ||
        "Hakuna maelezo.";


    const imageUrl =
        product.imageUrl ||
        "";



    /* =================================================
       IMAGE
    ================================================= */

    let imageHTML;


    if (imageUrl) {

        imageHTML = `

            <img
                src="${escapeAttribute(imageUrl)}"
                alt="${escapeAttribute(name)}"
                loading="lazy"
            >

        `;

    }

    else {

        imageHTML = `

            <span class="product-emoji">

                📦

            </span>

        `;

    }



    /* =================================================
       CARD
    ================================================= */

    card.innerHTML = `

        <div
            class="product-image"

            ${
                imageUrl
                    ? `onclick="openImageViewer('${escapeAttribute(imageUrl)}')"`
                    : ""
            }>

            ${imageHTML}


            <span class="product-label">

                MPYA

            </span>

        </div>



        <div class="product-info">


            <span class="product-category">

                ${escapeHTML(category)}

            </span>


            <h3>

                ${escapeHTML(name)}

            </h3>


            <div class="price">

                TSh ${price.toLocaleString()}

            </div>


            <p class="location">

                📍 ${escapeHTML(location)}

            </p>


            <p class="description">

                ${escapeHTML(description)}

            </p>


            <!-- ACTIONS -->

            <div class="product-actions">


                <button
                    class="comment-btn"
                    type="button">

                    💬 Comments

                </button>


                <button
                    class="contact-btn"
                    type="button">

                    📞 Wasiliana

                </button>


            </div>


        </div>

    `;



    /* =================================================
       COMMENTS BUTTON
    ================================================= */

    const commentButton =
        card.querySelector(
            ".comment-btn"
        );


    if (commentButton) {

        commentButton.addEventListener(
            "click",
            function() {

                openCommentsModal(
                    id,
                    name
                );

            }
        );

    }



    /* =================================================
       CONTACT BUTTON
    ================================================= */

    const contactButton =
        card.querySelector(
            ".contact-btn"
        );


    if (contactButton) {

        contactButton.addEventListener(
            "click",
            function() {

                contactSeller(
                    name
                );

            }
        );

    }


    productList.appendChild(
        card
    );

}



/* =====================================================
   OPEN COMMENTS MODAL
===================================================== */

async function openCommentsModal(
    productId,
    productName
) {

    /* ================================================
       LOGIN CHECK
    ================================================= */

    if (!auth.currentUser) {

        const register =
            confirm(

                "🔐 Ingia kwanza\n\n" +

                "Ili kuona na kuandika comments " +
                "kwenye bidhaa hii unatakiwa kuwa " +
                "na akaunti ya WIN MARKET.\n\n" +

                "Bonyeza OK kujisajili."

            );


        if (register) {

            window.location.href =
                "register.html";

        }
        else {

            const login =
                confirm(

                    "Tayari una akaunti?\n\n" +

                    "Bonyeza OK kwenda Login."

                );


            if (login) {

                window.location.href =
                    "login.html";

            }

        }


        return;

    }



    /* ================================================
       SAVE CURRENT PRODUCT
    ================================================= */

    currentCommentProductId =
        productId;


    currentCommentProductName =
        productName;



    /* ================================================
       MODAL
    ================================================= */

    const modal =
        document.getElementById(
            "commentsModal"
        );


    const productNameElement =
        document.getElementById(
            "commentProductName"
        );


    const input =
        document.getElementById(
            "commentInput"
        );


    if (!modal) {

        return;

    }


    if (productNameElement) {

        productNameElement.innerText =
            "📦 " +
            productName;

    }


    if (input) {

        input.value =
            "";

    }


    updateCommentCounter();


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    await loadComments(
        productId
    );

}


window.openCommentsModal =
    openCommentsModal;



/* =====================================================
   CLOSE COMMENTS MODAL
===================================================== */

function closeCommentsModal() {

    const modal =
        document.getElementById(
            "commentsModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    currentCommentProductId =
        null;


    currentCommentProductName =
        "";


    document.body.style.overflow =
        "";

}


window.closeCommentsModal =
    closeCommentsModal;



/* =====================================================
   LOAD COMMENTS
===================================================== */

async function loadComments(
    productId
) {

    const commentsList =
        document.getElementById(
            "commentsList"
        );


    if (!commentsList) {

        return;

    }


    commentsList.innerHTML = `

        <div class="comments-loading">

            ⏳ Inapakia comments...

        </div>

    `;


    try {

        /*
         * Tunatumia getDocs bila orderBy
         * ili kuepuka Firebase composite index.
         */

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "comments"
                )
            );


        const comments = [];


        snapshot.forEach(
            function(doc) {

                const data =
                    doc.data();


                if (
                    data.productId ===
                    productId
                ) {

                    comments.push({

                        id:
                            doc.id,

                        ...data

                    });

                }

            }
        );


        /* SORT NEWEST FIRST */

        comments.sort(
            function(a, b) {

                const timeA =
                    a.createdAt?.seconds ||
                    0;


                const timeB =
                    b.createdAt?.seconds ||
                    0;


                return timeB - timeA;

            }
        );


        commentsList.innerHTML =
            "";


        /* NO COMMENTS */

        if (comments.length === 0) {

            commentsList.innerHTML = `

                <div class="comments-empty">

                    💬

                    <br><br>

                    Bado hakuna comment.

                    <br>

                    Kuwa wa kwanza kutoa maoni.

                </div>

            `;

            return;

        }


        /* DISPLAY COMMENTS */

        comments.forEach(
            function(comment) {

                createCommentElement(
                    comment
                );

            }
        );

    }

    catch (error) {

        console.error(
            "LOAD COMMENTS ERROR:",
            error
        );


        commentsList.innerHTML = `

            <div class="comments-empty">

                ⚠️ Imeshindikana kupakia comments.

                <br><br>

                ${escapeHTML(
                    error.message
                )}

            </div>

        `;

    }

}



/* =====================================================
   CREATE COMMENT ELEMENT
===================================================== */

function createCommentElement(
    comment
) {

    const commentsList =
        document.getElementById(
            "commentsList"
        );


    if (!commentsList) {

        return;

    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "comment-item";


    const username =
        comment.userName ||
        "Mtumiaji";


    const text =
        comment.text ||
        "";


    const date =
        formatCommentDate(
            comment.createdAt
        );


    item.innerHTML = `

        <div class="comment-header">

            <span class="comment-user">

                👤 ${escapeHTML(username)}

            </span>


            <span class="comment-date">

                ${escapeHTML(date)}

            </span>

        </div>


        <div class="comment-text">

            ${escapeHTML(text)}

        </div>

    `;


    commentsList.appendChild(
        item
    );

}



/* =====================================================
   SUBMIT COMMENT
===================================================== */

async function submitComment() {

    const user =
        auth.currentUser;


    /* ================================================
       LOGIN CHECK
    ================================================= */

    if (!user) {

        alert(
            "🔐 Lazima uingie kwenye akaunti kwanza."
        );


        window.location.href =
            "login.html";


        return;

    }



    /* ================================================
       PRODUCT CHECK
    ================================================= */

    if (!currentCommentProductId) {

        alert(
            "⚠️ Bidhaa haijachaguliwa."
        );


        return;

    }



    /* ================================================
       INPUT
    ================================================= */

    const input =
        document.getElementById(
            "commentInput"
        );


    const button =
        document.getElementById(
            "submitCommentBtn"
        );


    if (!input) {

        return;

    }


    const text =
        input.value.trim();


    /* ================================================
       EMPTY
    ================================================= */

    if (!text) {

        alert(
            "✍️ Andika comment kwanza."
        );


        input.focus();


        return;

    }


    /* ================================================
       MAX
    ================================================= */

    if (text.length > 500) {

        alert(
            "Comment haiwezi kuzidi herufi 500."
        );


        return;

    }



    /* ================================================
       BUTTON
    ================================================= */

    if (button) {

        button.disabled =
            true;


        button.innerText =
            "⏳ Inatuma...";

    }



    try {

        /* ============================================
           USER NAME
        ============================================ */

        const userName =

            user.displayName ||

            user.email?.split("@")[0] ||

            "Mtumiaji";



        /* ============================================
           FIRESTORE
        ============================================ */

        await addDoc(

            collection(
                db,
                "comments"
            ),

            {

                productId:
                    currentCommentProductId,

                productName:
                    currentCommentProductName,

                text:
                    text,

                userId:
                    user.uid,

                userName:
                    userName,

                userEmail:
                    user.email || "",

                isAdmin:
                    user.uid === ADMIN_UID,

                createdAt:
                    serverTimestamp()

            }

        );


        /* ============================================
           CLEAR
        ============================================ */

        input.value =
            "";


        updateCommentCounter();


        /* ============================================
           RELOAD COMMENTS
        ============================================ */

        await loadComments(
            currentCommentProductId
        );


    }

    catch (error) {

        console.error(
            "SUBMIT COMMENT ERROR:",
            error
        );


        alert(

            "❌ Imeshindikana kutuma comment.\n\n" +

            error.message

        );

    }


    finally {

        if (button) {

            button.disabled =
                false;


            button.innerText =
                "💬 Tuma Comment";

        }

    }

}


window.submitComment =
    submitComment;



/* =====================================================
   COMMENT CHARACTER COUNTER
===================================================== */

function updateCommentCounter() {

    const input =
        document.getElementById(
            "commentInput"
        );


    const counter =
        document.getElementById(
            "commentCount"
        );


    if (
        input &&
        counter
    ) {

        counter.innerText =
            input.value.length;

    }

}


const commentInput =
    document.getElementById(
        "commentInput"
    );


if (commentInput) {

    commentInput.addEventListener(
        "input",
        updateCommentCounter
    );

}



/* =====================================================
   FORMAT COMMENT DATE
===================================================== */

function formatCommentDate(
    timestamp
) {

    if (
        !timestamp ||
        !timestamp.seconds
    ) {

        return "Sasa hivi";

    }


    const date =
        new Date(
            timestamp.seconds * 1000
        );


    return date.toLocaleDateString(
        "sw-TZ",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );

}



/* =====================================================
   CLOSE COMMENTS WHEN CLICK OUTSIDE
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "commentsModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeCommentsModal();

        }

    }
);



/* =====================================================
   ESC CLOSE COMMENTS
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeCommentsModal();

        }

    }
);



/* =====================================================
   SEARCH
===================================================== */

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {

        return;

    }


    const search =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(
            function(card) {

                const text =
                    card.innerText
                        .toLowerCase();


                card.style.display =
                    text.includes(search)
                        ? ""
                        : "none";

            }
        );

}


window.searchProducts =
    searchProducts;



/* =====================================================
   CATEGORY FILTER
===================================================== */

function filterCategory(
    category
) {

    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(
            function(card) {

                card.style.display =
                    card.dataset.category ===
                    category
                        ? ""
                        : "none";

            }
        );


    const section =
        document.getElementById(
            "products"
        );


    if (section) {

        section.scrollIntoView({
            behavior:
                "smooth"
        });

    }

}


window.filterCategory =
    filterCategory;



/* =====================================================
   CONTACT SELLER
===================================================== */

function contactSeller(
    product
) {

    if (!auth.currentUser) {

        const kwendaRegister =
            confirm(

                "🔐 Jisajili kwanza\n\n" +

                "Ili kuwasiliana na muuzaji wa \"" +

                product +

                "\", unatakiwa kuwa na akaunti " +

                "ya WIN MARKET.\n\n" +

                "Bonyeza OK kujisajili au " +

                "Cancel kama tayari una akaunti."

            );


        if (kwendaRegister) {

            window.location.href =
                "register.html";

        }

        else {

            const kwendaLogin =
                confirm(

                    "🔐 Tayari una akaunti " +
                    "ya WIN MARKET?\n\n" +

                    "Bonyeza OK kwenda kwenye Login."

                );


            if (kwendaLogin) {

                window.location.href =
                    "login.html";

            }

        }


        return;

    }


    const message =

        "Habari WIN MARKET 👋\n\n" +

        "Nimevutiwa na bidhaa hii:\n📦 " +

        product +

        "\n\n" +

        "Naomba maelezo zaidi kuhusu bidhaa hii.";


    const url =

        "https://wa.me/" +

        MARKET_WHATSAPP +

        "?text=" +

        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank"
    );

}


window.contactSeller =
    contactSeller;



/* =====================================================
   OPEN SELL FORM
===================================================== */

function openSellForm() {

    if (!auth.currentUser) {

        const kwendaRegister =
            confirm(

                "🔐 Jisajili kwanza\n\n" +

                "Ili kuweka bidhaa kwenye WIN MARKET, " +

                "unatakiwa kuwa na akaunti.\n\n" +

                "Bonyeza OK kujisajili au " +

                "Cancel kama tayari una akaunti."

            );


        if (kwendaRegister) {

            window.location.href =
                "register.html";

        }

        else {

            const kwendaLogin =
                confirm(

                    "🔐 Tayari una akaunti " +
                    "ya WIN MARKET?\n\n" +

                    "Bonyeza OK kwenda kwenye Login."

                );


            if (kwendaLogin) {

                window.location.href =
                    "login.html";

            }

        }


        return;

    }


    const modal =
        document.getElementById(
            "sellModal"
        );


    if (modal) {

        modal.style.display =
            "block";


        document.body.style.overflow =
            "hidden";

    }

}


window.openSellForm =
    openSellForm;



/* =====================================================
   CLOSE SELL FORM
===================================================== */

function closeSellForm() {

    const modal =
        document.getElementById(
            "sellModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    document.body.style.overflow =
        "";

}


window.closeSellForm =
    closeSellForm;



/* =====================================================
   IMAGE PREVIEW
===================================================== */

const imageInput =
    document.getElementById(
        "sellerImage"
    );


if (imageInput) {

    imageInput.addEventListener(
        "change",
        function() {

            const preview =
                document.getElementById(
                    "imagePreview"
                );


            if (!preview) {

                return;

            }


            preview.innerHTML =
                "";


            const file =
                imageInput.files[0];


            if (!file) {

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "📸 Tafadhali chagua picha tu."
                );


                imageInput.value =
                    "";


                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    preview.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Preview ya picha"
                        >

                    `;

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}



/* =====================================================
   CLOUDINARY
===================================================== */

async function uploadImageToCloudinary(
    file
) {

    const uploadURL =

        "https://api.cloudinary.com/v1_1/" +

        CLOUDINARY_CLOUD_NAME +

        "/image/upload";


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );


    let response;


    try {

        response =
            await fetch(
                uploadURL,
                {

                    method:
                        "POST",

                    body:
                        formData

                }
            );

    }

    catch (error) {

        throw new Error(
            "Cloudinary haipatikani. Hakikisha internet ipo."
        );

    }


    let data;


    try {

        data =
            await response.json();

    }

    catch (error) {

        throw new Error(
            "Cloudinary imerudisha majibu yasiyotambulika."
        );

    }


    if (!response.ok) {

        throw new Error(

            "Cloudinary: " +

            (
                data?.error?.message ||

                "Upload ya picha imekataa."
            )

        );

    }


    if (!data.secure_url) {

        throw new Error(
            "Cloudinary haikutoa URL ya picha."
        );

    }


    return data.secure_url;

}



/* =====================================================
   SUBMIT PRODUCT
===================================================== */

async function submitProduct(
    event
) {

    event.preventDefault();


    const user =
        auth.currentUser;


    if (!user) {

        alert(
            "🔐 Lazima uingie kwenye akaunti kwanza."
        );


        window.location.href =
            "login.html";


        return;

    }


    const productInput =
        document.getElementById(
            "sellerProduct"
        );


    const categoryInput =
        document.getElementById(
            "sellerCategory"
        );


    const priceInput =
        document.getElementById(
            "sellerPrice"
        );


    const locationInput =
        document.getElementById(
            "sellerLocation"
        );


    const phoneInput =
        document.getElementById(
            "sellerPhone"
        );


    const imageInput =
        document.getElementById(
            "sellerImage"
        );


    const descriptionInput =
        document.getElementById(
            "sellerDescription"
        );


    const button =
        document.getElementById(
            "submitProductBtn"
        );


    const product =
        productInput.value.trim();


    const category =
        categoryInput.value;


    const price =
        Number(
            priceInput.value
        );


    const location =
        locationInput.value.trim();


    const phone =
        phoneInput.value.trim();


    const description =
        descriptionInput.value.trim();


    const file =
        imageInput.files[0];


    if (
        !product ||
        !category ||
        !price ||
        !location ||
        !phone ||
        !description
    ) {

        alert(
            "Tafadhali jaza taarifa zote."
        );


        return;

    }


    if (!file) {

        alert(
            "📸 Tafadhali chagua picha ya bidhaa."
        );


        return;

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "📸 Faili lazima liwe picha."
        );


        return;

    }


    if (button) {

        button.disabled =
            true;


        button.innerText =
            "⏳ Inapakia picha...";

    }


    try {

        const imageUrl =
            await uploadImageToCloudinary(
                file
            );


        if (button) {

            button.innerText =
                "⏳ Inahifadhi bidhaa...";

        }


        const productRef =
            await addDoc(

                collection(
                    db,
                    "products"
                ),

                {

                    name:
                        product,

                    category:
                        category,

                    price:
                        price,

                    location:
                        location,

                    description:
                        description,

                    imageUrl:
                        imageUrl,

                    sellerId:
                        user.uid,

                    sellerName:
                        user.displayName ||

                        user.email ||

                        "Muuzaji",

                    createdAt:
                        serverTimestamp()

                }

            );


        await addDoc(

            collection(
                db,
                "sellerContacts"
            ),

            {

                productId:
                    productRef.id,

                sellerId:
                    user.uid,

                sellerName:
                    user.displayName ||

                    user.email ||

                    "Muuzaji",

                phone:
                    phone,

                createdAt:
                    serverTimestamp()

            }

        );


        alert(
            "✅ Bidhaa yako imewekwa kwenye WIN MARKET!"
        );


        const form =
            document.getElementById(
                "sellForm"
            );


        if (form) {

            form.reset();

        }


        const preview =
            document.getElementById(
                "imagePreview"
            );


        if (preview) {

            preview.innerHTML =
                "";

        }


        const selectedImageName =
            document.getElementById(
                "selectedImageName"
            );


        if (selectedImageName) {

            selectedImageName.innerText =
                "Hakuna picha iliyochaguliwa";

        }


        closeSellForm();


        await loadProducts();

    }

    catch (error) {

        console.error(
            "PRODUCT ERROR:",
            error
        );


        alert(

            "❌ Imeshindikana kuweka bidhaa.\n\n" +

            error.message

        );

    }

    finally {

        if (button) {

            button.disabled =
                false;


            button.innerText =
                "🚀 Weka Bidhaa";

        }

    }

}


window.submitProduct =
    submitProduct;



/* =====================================================
   CLOSE SELL MODAL OUTSIDE
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "sellModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeSellForm();

        }

    }
);



/* =====================================================
   IMAGE VIEWER
===================================================== */

function openImageViewer(
    imageUrl
) {

    const viewer =
        document.getElementById(
            "imageViewer"
        );


    const image =
        document.getElementById(
            "viewerImage"
        );


    if (
        !viewer ||
        !image
    ) {

        return;

    }


    image.src =
        imageUrl;


    viewer.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


window.openImageViewer =
    openImageViewer;



/* =====================================================
   CLOSE IMAGE VIEWER
===================================================== */

function closeImageViewer() {

    const viewer =
        document.getElementById(
            "imageViewer"
        );


    const image =
        document.getElementById(
            "viewerImage"
        );


    if (viewer) {

        viewer.classList.remove(
            "show"
        );

    }


    if (image) {

        image.src =
            "";

    }


    document.body.style.overflow =
        "";

}


window.closeImageViewer =
    closeImageViewer;



/* =====================================================
   CLOSE IMAGE VIEWER BLACK AREA
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const viewer =
            document.getElementById(
                "imageViewer"
            );


        if (
            viewer &&
            event.target === viewer
        ) {

            closeImageViewer();

        }

    }
);



/* =====================================================
   SECURITY
===================================================== */

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


function escapeAttribute(
    text
) {

    return escapeHTML(
        text
    );

}



/* =====================================================
   SELLER NOTIFICATION
===================================================== */

const sellerNotification =
    document.getElementById(
        "sellerNotification"
    );


let notificationTimer =
    null;


let notificationLoop =
    null;



function showSellerNotification() {

    if (!sellerNotification) {

        return;

    }


    if (notificationTimer) {

        clearTimeout(
            notificationTimer
        );

    }


    sellerNotification.classList.add(
        "show"
    );


    notificationTimer =
        setTimeout(
            function() {

                sellerNotification.classList.remove(
                    "show"
                );

            },
            60000
        );

}


function closeSellerNotification() {

    if (!sellerNotification) {

        return;

    }


    sellerNotification.classList.remove(
        "show"
    );


    if (notificationTimer) {

        clearTimeout(
            notificationTimer
        );

        notificationTimer =
            null;

    }

}


window.closeSellerNotification =
    closeSellerNotification;



/* =====================================================
   IMAGE FILE NAME
===================================================== */

const sellerImageInput =
    document.getElementById(
        "sellerImage"
    );


const selectedImageName =
    document.getElementById(
        "selectedImageName"
    );


if (sellerImageInput) {

    sellerImageInput.addEventListener(
        "change",
        function() {

            const file =
                sellerImageInput.files[0];


            if (!file) {

                if (selectedImageName) {

                    selectedImageName.innerText =
                        "Hakuna picha iliyochaguliwa";

                }

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "❌ Tafadhali chagua picha tu."
                );


                sellerImageInput.value =
                    "";


                return;

            }


            if (selectedImageName) {

                selectedImageName.innerText =
                    "✅ " + file.name;

            }

        }
    );

}



/* =====================================================
   START
===================================================== */

loadProducts();



/* =====================================================
   AUTOMATIC SELLER NOTIFICATION
===================================================== */

setTimeout(
    function() {

        showSellerNotification();


        notificationLoop =
            setInterval(
                function() {

                    showSellerNotification();

                },
                120000
            );

    },
    2000
);