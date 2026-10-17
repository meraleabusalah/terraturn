const startButton = document.getElementById("startButton");
const uploadSection = document.getElementById("uploadSection");
const imageInput = document.getElementById("imageInput");
const uploadButton = document.getElementById("uploadButton");
const cameraButton = document.getElementById("cameraButton");
const cameraContainer = document.getElementById("cameraContainer");
const cameraPreview = document.getElementById("cameraPreview");
const captureButton = document.getElementById("captureButton");
const closeCameraButton = document.getElementById("closeCameraButton");
const preview = document.getElementById("preview");
const analyzeButton = document.getElementById("analyzeButton");
const result = document.getElementById("result");
const impactCount = document.getElementById("impactCount");

// Location finder elements
const emirateSelect = document.getElementById("emirateSelect");
const locationType = document.getElementById("locationType");
const findLocationsButton = document.getElementById("findLocationsButton");
const locationResults = document.getElementById("locationResults");

// Variables
let cameraStream = null;
let photoReady = false;
let photoUrl = null;
let aiModel = null;

let analyzedCount = Number(
    sessionStorage.getItem("terraturnAnalyzedCount") || 0
);

if (impactCount) {
    impactCount.textContent = analyzedCount;
}

// ------------------------------
// LOAD THE AI MODEL
// ------------------------------

async function loadTerraTurnAI() {
    if (!result) return;

    result.textContent = "Loading AI model...";

    try {
        if (typeof mobilenet === "undefined") {
            throw new Error("MobileNet did not load.");
        }

        aiModel = await mobilenet.load();

        result.textContent =
            "AI ready! Upload a photo or take a picture.";
    
} catch (error) {
    console.error("AI loading error:", error);

    result.textContent =
        "AI loading failed: " +
        (error && error.message
            ? error.message
            : "Unknown error. Check your internet connection.");
}

}

loadTerraTurnAI();

// ------------------------------
// OPEN THE PHOTO SECTION
// ------------------------------

if (startButton && uploadSection) {
    startButton.addEventListener("click", function () {
        uploadSection.hidden = false;

        uploadSection.scrollIntoView({
            behavior: "smooth"
        });
    });
}

// ------------------------------
// UPLOAD A PHOTO
// ------------------------------

if (uploadButton && imageInput) {
    uploadButton.addEventListener("click", function () {
        imageInput.click();
    });

    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];

        if (file) {
            showPhoto(file);
        }
    });
}

// ------------------------------
// DISPLAY THE SELECTED PHOTO
// ------------------------------

function showPhoto(file) {
    if (!file || !file.type.startsWith("image/")) {
        result.textContent = "Please choose a valid image.";
        return;
    }

    if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
    }

    photoUrl = URL.createObjectURL(file);

    preview.src = photoUrl;
    preview.hidden = false;

    photoReady = true;

    // Enable Analyze after a photo is selected.
    analyzeButton.disabled = false;

    result.textContent = "Photo ready! Click Analyze Item.";

    // Save the photo for this browser session.
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            sessionStorage.setItem(
                "terraturnPhoto",
                event.target.result
            );
        } catch (error) {
            console.error("Photo saving error:", error);
        }
    };

    reader.readAsDataURL(file);
}

// ------------------------------
// OPEN THE CAMERA
// ------------------------------

if (cameraButton) {
    cameraButton.addEventListener("click", async function () {
        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {
            result.textContent =
                "Your browser does not support camera access.";
            return;
        }

        try {
            cameraStream =
                await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false
                });

            cameraPreview.srcObject = cameraStream;
            cameraContainer.hidden = false;

            await cameraPreview.play();

        } catch (error) {
            console.error("Camera error:", error);

            result.textContent =
                "Camera access failed. Please allow camera permission or upload a photo.";
        }
    });
}

// ------------------------------
// TAKE A PICTURE
// ------------------------------

if (captureButton) {
    captureButton.addEventListener("click", function () {
        if (!cameraPreview.videoWidth) {
            result.textContent =
                "Please wait for the camera to start.";
            return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;

        const context = canvas.getContext("2d");

        context.drawImage(
            cameraPreview,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(function (blob) {
            if (!blob) {
                result.textContent =
                    "Could not capture the photo. Please try again.";
                return;
            }

            const photoFile = new File(
                [blob],
                "terraturn-photo.jpg",
                { type: "image/jpeg" }
            );

            showPhoto(photoFile);
            stopCamera();

        }, "image/jpeg", 0.9);
    });
}

// ------------------------------
// CLOSE THE CAMERA
// ------------------------------

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(function (track) {
            track.stop();
        });

        cameraStream = null;
    }

    if (cameraPreview) {
        cameraPreview.srcObject = null;
    }

    if (cameraContainer) {
        cameraContainer.hidden = true;
    }
}

if (closeCameraButton) {
    closeCameraButton.addEventListener("click", stopCamera);
}

// ------------------------------
// ANALYZE THE PHOTO WITH AI
// ------------------------------


if (analyzeButton) {
    analyzeButton.addEventListener("click", async function () {
        if (!photoReady || !preview.src) {
            result.textContent =
                "Please take or upload a photo first.";
            return;
        }

        if (!aiModel) {
            result.textContent =
                "The AI is still loading. Please wait a moment.";
            return;
        }

        analyzeButton.disabled = true;
        result.textContent = "AI is analyzing your photo...";

        try {
            
const predictions = await aiModel.classify(preview, 5);

if (!predictions || predictions.length === 0) {
    result.textContent =
        "I couldn't identify this item. Please try another photo.";
    return;
}

const labels = predictions.map(prediction =>
    prediction.className.toLowerCase()
);

let item = "";

// Batteries
if (labels.some(label =>
    /battery|cell battery|power cell/.test(label)
)) {
    item = "battery";
}

// Phones
else if (labels.some(label =>
    /cellular telephone|mobile phone|cellphone|smartphone|iphone|telephone|hand-held computer/.test(label)
)) {
    item = "phone";
}

// Other electronics
else if (labels.some(label =>
    /laptop|notebook computer|desktop computer|computer keyboard|computer mouse|monitor|printer|remote control|tablet|headphone|earphone|webcam|joystick|modem/.test(label)
)) {
    item = "electronics";
}

// Clothing
else if (labels.some(label =>
    /jersey|t-shirt|tee shirt|shirt|sweatshirt|cardigan|coat|dress|sock|jean|trouser|pants|suit|sweater|hoodie|skirt/.test(label)
)) {
    item = "shirt";
}

// Shoes
else if (labels.some(label =>
    /running shoe|shoe|sandal|boot|sneaker|loafer|slipper|clog/.test(label)
)) {
    item = "shoes";
}

// Cardboard boxes
else if (labels.some(label =>
    /carton|cardboard|packing box|cardboard box|box|corrugated/.test(label)
)) {
    item = "box";
}

// Paper products
else if (labels.some(label =>
    /paper towel|toilet tissue|envelope|notebook|newspaper|comic book|book jacket|bookshop|paper/.test(label)
)) {
    item = "paper";
}

// Glass items
else if (labels.some(label =>
    /wineglass|beer glass|drinking glass|glass bottle|water glass|goblet/.test(label)
)) {
    item = "glass";
}

// Plastic bottles
else if (labels.some(label =>
    /plastic bottle|pop bottle|water bottle|soda bottle|pill bottle/.test(label)
)) {
    item = "plasticBottle";
}

// Cans
else if (labels.some(label =>
    /beer can|soda can|tin can|aluminum can|aluminium can|drink can|pop can|can opener/.test(label)
)) {
    item = "can";
}


if (!item) {
    result.innerHTML = `
        <div class="manual-item-entry">
            <h3>Not sure what this item is?</h3>
            <p>The AI couldn't confidently identify your item.
            Type its name below and we'll help you find the right options.</p>

            <input
                type="text"
                id="manualItemInput"
                placeholder="e.g. plastic bottle, headphones, book"
                aria-label="Enter the item's name"
            >

            <button type="button" id="manualItemButton">
                Find My Recommendations
            </button>

            <p id="manualItemError" role="alert"></p>
        </div>
    `;

    const manualInput = document.getElementById("manualItemInput");
    const manualButton = document.getElementById("manualItemButton");
    const manualError = document.getElementById("manualItemError");

    manualInput.focus();

    manualButton.addEventListener("click", () => {
        const typedItem = manualInput.value.trim().toLowerCase();

        if (!typedItem) {
            manualError.textContent = "Please type the item's name.";
            return;
        }

       
let manualCategory = "";

// Normalize the typed item
const name = typedItem.toLowerCase().trim();

// Batteries — check before electronics
if (/\b(battery|batteries|rechargeable battery|aa battery|aaa battery)\b/.test(name)) {
    manualCategory = "battery";
}

// Electronics accessories — check before phones
else if (/\b(headphones|earphones|earbuds|headset|keyboard|computer mouse|mouse|laptop|computer|desktop|monitor|printer|tablet|charger|remote control|webcam|speaker|electronics|electronic device)\b/.test(name)) {
    manualCategory = "electronics";
}

// Phones
else if (/\b(phone|smartphone|iphone|cell phone|mobile phone|mobile|cellphone)\b/.test(name)) {
    manualCategory = "phone";
}

// Clothing
else if (/\b(shirt|t-shirt|t shirt|clothes|clothing|jeans|pants|trousers|dress|jacket|coat|sweater|hoodie|skirt|socks|fabric|uniform)\b/.test(name)) {
    manualCategory = "shirt";
}

// Shoes
else if (/\b(shoe|shoes|sneaker|sneakers|boots|sandals|slippers|heels|trainers)\b/.test(name)) {
    manualCategory = "shoes";
}

// Cardboard and boxes
else if (/\b(box|boxes|cardboard|carton|packing box|shipping box|cardboard box)\b/.test(name)) {
    manualCategory = "box";
}

// Paper products
else if (/\b(paper|newspaper|notebook|book|textbook|envelope|magazine|worksheet|paper bag|cardstock)\b/.test(name)) {
    manualCategory = "paper";
}

// Glass items
else if (/\b(glass|glass jar|glass bottle|drinking glass|wineglass|jar|mason jar)\b/.test(name)) {
    manualCategory = "glass";
}

// Plastic bottles — distinguish from glass bottles
else if (/\b(plastic bottle|water bottle|plastic flask|soda bottle|pop bottle|drink bottle)\b/.test(name)) {
    manualCategory = "plasticBottle";
}

// Cans
else if (/\b(can|cans|tin can|soda can|aluminum can|aluminium can|drink can)\b/.test(name)) {
    manualCategory = "can";
}

// Unknown items
else {
    manualCategory = "other";
}


        sessionStorage.setItem("terraturnItem", manualCategory);
        sessionStorage.setItem("terraturnCustomItem", manualInput.value.trim());

        analyzedCount++;
        sessionStorage.setItem("terraturnAnalyzedCount", analyzedCount);

        if (impactCount) {
            impactCount.textContent = analyzedCount;
        }

        window.location.href = "solutions.html";
    });
    return;
}



            sessionStorage.setItem("terraturnItem", item);

            analyzedCount++;
            sessionStorage.setItem(
                "terraturnAnalyzedCount",
                analyzedCount
            );

            if (impactCount) {
                impactCount.textContent = analyzedCount;
            }

            window.location.href = "solutions.html";

        } catch (error) {
            console.error("Image analysis error:", error);

            result.textContent =
                "Analysis failed. Please try another photo.";
        } finally {
            analyzeButton.disabled = false;
        }
    });
}


// ------------------------------
// FIND RECYCLING / REUSE LOCATIONS
// ------------------------------

if (findLocationsButton) {
    findLocationsButton.addEventListener("click", function () {
        const emirate = emirateSelect ? emirateSelect.value : "";
        const type = locationType ? locationType.value : "";

        if (!emirate || !type) {
            locationResults.textContent =
                "Please select your emirate and the type of location.";
            return;
        }

        const searchText = type + " near " + emirate + ", UAE";

        const mapsUrl =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(searchText);

        locationResults.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            "Find nearby locations in " + emirate + ":";

        const link = document.createElement("a");
        link.href = mapsUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Open locations in Google Maps";

        locationResults.append(message, link);
    });
}

// ------------------------------
// RECOMMENDATIONS AND TUTORIALS
// ------------------------------

// These tutorials can be displayed by calling toggleTutorial()
// with the matching tutorial ID from a button.

const recommendations = {
    shirt: [
        {
            id: "shirt1",
            title: "Donate wearable clothing",
            description: `
                <h3>How to donate your clothes</h3>
                <ol>
                    <li>Check that the clothing is clean and wearable.</li>
                    <li>Wash it and let it dry completely.</li>
                    <li>Fold it neatly and place it in a clean bag.</li>
                    <li>Find a clothing donation point or charity near you.</li>
                    <li>Donate the clothing so someone else can use it.</li>
                </ol>
            `
        },
        {
            id: "shirt2",
            title: "Turn old clothing into cleaning cloths",
            description: `
                <h3>How to reuse old clothing</h3>
                <ol>
                    <li>Choose an old shirt that is no longer wearable.</li>
                    <li>Wash and dry it.</li>
                    <li>Cut it into smaller squares with scissors.</li>
                    <li>Use the pieces to clean surfaces or wipe up spills.</li>
                    <li>Wash reusable cloths after use when possible.</li>
                </ol>
            `
        },
        {
            id: "shirt3",
            title: "Repair a damaged shirt",
            description: `
                <h3>How to repair a shirt</h3>
                <ol>
                    <li>Check the shirt for a loose button, small hole, or open seam.</li>
                    <li>Choose matching thread and a needle.</li>
                    <li>Sew a loose button back on or stitch a small hole closed.</li>
                    <li>Trim loose thread carefully.</li>
                    <li>Wash the shirt and wear it again.</li>
                </ol>
            `
        }
    ],

    shoes: [
        {
            id: "shoes1",
            title: "Donate wearable shoes",
            description: `
                <h3>How to donate shoes</h3>
                <ol>
                    <li>Check that the shoes are still safe and wearable.</li>
                    <li>Clean off dirt and let the shoes dry.</li>
                    <li>Tie the pair together or place them in a bag.</li>
                    <li>Find a suitable shoe donation point.</li>
                    <li>Donate the shoes instead of throwing them away.</li>
                </ol>
            `
        },
        {
            id: "shoes2",
            title: "Reuse old shoes",
            description: `
                <h3>How to reuse old shoes</h3>
                <ol>
                    <li>Clean the shoes and let them dry.</li>
                    <li>Use wearable shoes for gardening or messy activities.</li>
                    <li>Use old shoes as planters only if they can safely hold soil and water.</li>
                    <li>Keep them in a suitable place so they do not collect standing water.</li>
                    <li>Recycle them through a suitable shoe collection program if available.</li>
                </ol>
            `
        },
        {
            id: "shoes3",
            title: "Repair damaged shoes",
            description: `
                <h3>How to repair shoes</h3>
                <ol>
                    <li>Check whether the problem is a loose sole, lace, or small tear.</li>
                    <li>Replace broken laces if needed.</li>
                    <li>Use a shoe repair adhesive only when its instructions allow it.</li>
                    <li>For serious damage, visit a shoe repair shop.</li>
                    <li>Allow repairs to set fully before wearing the shoes.</li>
                </ol>
            `
        }
    ],

    phone: [
        {
            id: "phone1",
            title: "Give away an old phone",
            description: `
                <h3>How to rehome a phone</h3>
                <ol>
                    <li>Check that the phone works and can be safely used.</li>
                    <li>Back up any photos and files you want to keep.</li>
                    <li>Sign out of your accounts and remove the SIM card.</li>
                    <li>Perform a factory reset using the phone's settings.</li>
                    <li>Give it to someone who needs it or use a trusted donation program.</li>
                </ol>
            `
        },
        {
            id: "phone2",
            title: "Reuse an old phone",
            description: `
                <h3>How to reuse a phone</h3>
                <ol>
                    <li>Check that the phone is safe to use and its battery is not swollen.</li>
                    <li>Reset it if you no longer need the old data.</li>
                    <li>Use it as a music player, offline camera, or dedicated device.</li>
                    <li>Install only apps that are compatible with the phone.</li>
                    <li>Keep it charged and store it safely.</li>
                </ol>
            `
        },
        {
            id: "phone3",
            title: "Repair a broken phone",
            description: `
                <h3>How to repair a phone</h3>
                <ol>
                    <li>Identify the problem, such as a damaged screen or weak battery.</li>
                    <li>Back up important data if the phone still works.</li>
                    <li>Ask a qualified repair shop for an estimate.</li>
                    <li>Use a reputable repair service and suitable replacement parts.</li>
                    <li>If the phone cannot be repaired, use an approved electronics recycling service.</li>
                </ol>
            `
        }
    ],

    box: [
        {
            id: "box1",
            title: "Recycle a cardboard box",
            description: `
                <h3>How to recycle cardboard</h3>
                <ol>
                    <li>Remove tape, plastic wrapping, and other materials where possible.</li>
                    <li>Make sure the cardboard is clean and dry.</li>
                    <li>Flatten the box to save space.</li>
                    <li>Place it in a cardboard recycling collection point that accepts it.</li>
                    <li>Keep wet or food-contaminated cardboard out if the local service does not accept it.</li>
                </ol>
            `
        },
        {
            id: "box2",
            title: "Reuse a cardboard box",
            description: `
                <h3>How to reuse a box</h3>
                <ol>
                    <li>Check that the box is clean and strong enough.</li>
                    <li>Use it to store books, toys, or other belongings.</li>
                    <li>Label the outside so you can find items easily.</li>
                    <li>Reuse it when packing or moving.</li>
                    <li>Recycle it when it becomes damaged.</li>
                </ol>
            `
        },
        {
            id: "box3",
            title: "Turn a box into an organizer",
            description: `
                <h3>How to make a cardboard organizer</h3>
                <ol>
                    <li>Choose a clean cardboard box.</li>
                    <li>Cut it to the size you need, asking an adult for help if necessary.</li>
                    <li>Use smaller cardboard pieces as dividers.</li>
                    <li>Decorate it with reused paper or other safe materials.</li>
                    <li>Use it to organize stationery, cables, or craft supplies.</li>
                </ol>
            `
        }
    ],

    can: [
        {
            id: "can1",
            title: "Recycle a metal can",
            description: `
                <h3>How to recycle a can</h3>
                <ol>
                    <li>Check whether the can is accepted by your local recycling service.</li>
                    <li>Empty it and rinse away leftover food or drink.</li>
                    <li>Let it drain and dry.</li>
                    <li>Place it in the correct metal recycling container.</li>
                    <li>Do not handle sharp or damaged edges carelessly.</li>
                </ol>
            `
        },
        {
            id: "can2",
            title: "Reuse a can as a holder",
            description: `
                <h3>How to make a can holder</h3>
                <ol>
                    <li>Choose an empty can with no sharp or jagged edges.</li>
                    <li>Wash it thoroughly and let it dry.</li>
                    <li>Cover or protect the rim so it cannot cut you.</li>
                    <li>Decorate the outside with reused paper or paint.</li>
                    <li>Use it to hold pens or art supplies, not food unless it is food-safe.</li>
                </ol>
            `
        },
        {
            id: "can3",
            title: "Repurpose a can for storage",
            description: `
                <h3>How to reuse a can</h3>
                <ol>
                    <li>Make sure the can is clean and has no sharp edges.</li>
                    <li>Choose small items that fit inside safely.</li>
                    <li>Label the can to show what it contains.</li>
                    <li>Keep it in a dry place.</li>
                    <li>Recycle it when it is no longer useful.</li>
                </ol>
            `
        }
    ]
};

// Display a tutorial when a matching button is clicked.
function toggleTutorial(id) {
    const tutorial = document.getElementById(id);

    if (tutorial) {
        tutorial.hidden = !tutorial.hidden;
    }
}