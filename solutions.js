document.addEventListener("DOMContentLoaded", function () {
const solutionResult = document.getElementById("solutionResult");
const item = sessionStorage.getItem("terraturnItem");
let selectedType = null;
const itemNames = {
shirt: "Shirt or clothing",
shoes: "Shoes",
phone: "Phone",
box: "Cardboard box",
can: "Can",
plasticBottle: "Plastic bottle",
paper: "Paper",
glass: "Glass",
battery: "Battery",
electronics: "Other electronics",
other: "Other item"
};
const solutionDescriptions = {
repair: {
shirt: "Repair small tears, loose buttons, or damaged seams to make your clothing last longer.",
shoes: "Fix loose soles, replace laces, or clean your shoes to extend their life.",
phone: "Protect your phone with a case and screen protector. Get damaged parts repaired by a professional.",
box: "Reinforce a damaged cardboard box with tape so it can be used again.",
can: "If the can is reusable, clean it carefully and check for sharp edges. Do not use damaged cans for food or drinks.",
plasticBottle: "Check whether the bottle is reusable. Clean it and replace a damaged cap if possible.",
paper: "Repair torn paper or books with suitable tape, glue, or a simple binding fix.",
glass: "If a glass container has a damaged lid, replace the lid. Never try to repair cracked glass yourself.",
battery: "Do not attempt to repair a damaged battery. Keep it away from heat and follow local battery-disposal guidance.",
electronics: "Check cables and connections first. For internal faults, seek help from a qualified repair service.",
other: "Check whether the item can be safely repaired before replacing it."
},
reuse: {
shirt: "Turn old clothing into cleaning cloths, bags, or craft materials.",
shoes: "Use old shoes for gardening or other suitable activities if they are still safe to wear.",
phone: "Use an old working phone as a music player, camera, or backup device.",
box: "Reuse cardboard boxes for storage, moving, or creative projects.",
can: "Reuse a clean can for crafts or storage only if it is safe and has no sharp edges.",
plasticBottle: "Reuse a clean bottle for its intended purpose if it is designed for repeated use, or use it for a craft project.",
paper: "Reuse one-sided paper for notes, drafts, or drawing.",
glass: "Reuse a clean glass jar to store small items, stationery, or craft supplies.",
battery: "Rechargeable batteries should only be recharged with the correct charger. Do not reuse damaged or leaking batteries.",
electronics: "Reuse working electronics for learning, entertainment, or everyday tasks.",
other: "Find a new purpose for the item instead of throwing it away."
},
rehome: {
shirt: "Donate clean clothing in good condition to someone who needs it.",
shoes: "Give away clean, wearable shoes to friends, family, or a donation organization.",
phone: "Pass on a working phone to someone who needs it, after securely removing your personal data.",
box: "Give usable boxes to someone moving house or a local shop that can reuse them.",
can: "Offer safe, clean, reusable containers to someone who can use them.",
plasticBottle: "Offer clean, reusable bottles to someone who can use them.",
paper: "Give unused notebooks, paper, or art supplies to a student or school.",
glass: "Give clean jars or containers to someone who can use them safely.",
battery: "Do not give away damaged batteries. Take unwanted batteries to an appropriate collection point.",
electronics: "Donate working electronics to someone who needs them, or to a reputable donation program.",
other: "Give the item to someone who can use it rather than discarding it."
},
recycle: {
shirt: "Check whether your local textile collection accepts old clothing. Donate wearable clothes when possible.",
shoes: "Look for shoe recycling or collection programs in your area.",
phone: "Take unwanted phones to an approved e-waste collection point. Remove personal data first.",
box: "Flatten clean, dry cardboard and recycle it where cardboard collection is available.",
can: "Check local recycling rules and place accepted metal cans in the correct recycling collection.",
plasticBottle: "Check the recycling rules in your emirate and place accepted plastic bottles in the correct recycling collection.",
paper: "Keep clean, dry paper separate from food waste and recycle it where accepted.",
glass: "Check whether your local recycling service accepts glass and follow its sorting instructions.",
battery: "Take batteries to a designated battery collection point. Do not put them in ordinary household waste unless local guidance specifically permits it.",
electronics: "Take unwanted electronics to an approved e-waste collection point instead of putting them in general waste.",
other: "Check the item's material and your local recycling rules to find the correct disposal option."
}
};
const tutorialSteps = {
repair: {
shirt: [
"Check the clothing for loose buttons, small tears, or damaged seams.",
"Gather a needle, thread, or suitable fabric glue.",
"Carefully repair the damaged area.",
"Check that the repair is secure before wearing it."
],
shoes: [
"Check the shoes for loose soles, broken laces, or dirt.",
"Clean the shoes and identify what needs fixing.",
"Replace laces or use a suitable shoe repair service.",
"Make sure the shoes are safe and comfortable to wear."
],
phone: [
"Identify the problem with the phone.",
"Back up important data if the phone still works.",
"Check for simple issues such as loose cables or settings.",
"Ask a qualified repair service to handle damaged parts."
],
box: [
"Check whether the cardboard box is dry and clean.",
"Straighten any bent sides.",
"Reinforce weak corners and seams with tape.",
"Check that the box can safely hold its contents."
],
can: [
"Check whether the container is safe to handle.",
"Do not handle cans with sharp or damaged edges.",
"Clean a safe, reusable container thoroughly.",
"Use it only for a suitable purpose."
],
plasticBottle: [
"Check whether the bottle is designed for repeated use.",
"Wash it thoroughly with soap and water.",
"Check the bottle and cap for cracks or damage.",
"Reuse it only if it is safe and intended for that purpose."
],
paper: [
"Check whether the paper or book can be repaired.",
"Gather suitable tape, glue, or binding materials.",
"Carefully fix small tears or loose pages.",
"Keep the repaired paper dry and use it again."
],
glass: [
"Check the glass container for cracks or chips without running your fingers over damaged areas.",
"Do not use cracked or chipped glass.",
"If only the lid is damaged, find a suitable replacement.",
"Handle intact glass carefully and recycle damaged glass according to local guidance."
],
battery: [
"Check for visible damage without opening the battery.",
"Do not charge, open, or attempt to repair a damaged battery.",
"Keep damaged batteries away from heat and metal objects.",
"Follow local guidance for safe battery collection and disposal."
],
electronics: [
"Identify the electronic item's problem.",
"Disconnect the item from power before checking external cables.",
"Do not open power supplies or attempt unsafe electrical repairs.",
"Ask a qualified repair service for help with internal faults."
],
other: [
"Identify what is damaged.",
"Check whether the item can be repaired safely.",
"Find suitable tools or professional help.",
"Test the repair carefully before using the item again."
]
},
reuse: {
shirt: [
"Choose clothing that is too old or damaged to wear normally.",
"Cut suitable fabric into useful shapes.",
"Turn it into a cleaning cloth, bag, or craft material.",
"Use the new item instead of buying another one."
],
shoes: [
"Check whether the shoes are still safe to use.",
"Clean them thoroughly.",
"Choose a suitable alternative use, such as gardening.",
"Stop using them if they are unsafe or badly damaged."
],
phone: [
"Check that the old phone still works.",
"Back up anything important.",
"Remove personal information before changing its purpose.",
"Use it as a camera, music player, or backup device."
],
box: [
"Choose a clean, dry cardboard box.",
"Remove old labels if necessary.",
"Strengthen the bottom if needed.",
"Use it for storage, moving, or crafts."
],
can: [
"Check that the container is safe and has no sharp edges.",
"Clean it thoroughly.",
"Choose a suitable craft or storage purpose.",
"Avoid using it for food or drinks unless it is designed for that use."
],
plasticBottle: [
"Check whether the bottle is designed for repeated use.",
"Wash and dry it thoroughly.",
"Inspect it for cracks, damage, or signs of wear.",
"Reuse it only for a safe, suitable purpose."
],
paper: [
"Collect paper with one clean, unused side.",
"Cut or organize it into smaller sheets.",
"Keep the sheets together in a notebook or folder.",
"Use them for notes, drafts, or drawing."
],
glass: [
"Choose an intact glass jar or container.",
"Wash and dry it thoroughly.",
"Remove labels if desired.",
"Use it for storing suitable small items."
],
battery: [
"Check whether the battery is rechargeable and compatible with your device.",
"Never reuse a swollen, leaking, or damaged battery.",
"Use only the correct charger and follow the manufacturer's instructions.",
"Take batteries that are no longer usable to an appropriate collection point."
],
electronics: [
"Check that the electronic item works properly.",
"Clean it according to the manufacturer's instructions.",
"Choose a useful new purpose for it.",
"Keep it maintained so it can be used for longer."
],
other: [
"Check the item's condition.",
"Think of another way it could be useful.",
"Clean or prepare it for its new purpose.",
"Use it again instead of throwing it away."
]
},
rehome: {
shirt: [
"Choose clothing that is clean and wearable.",
"Wash it and check for damage.",
"Find someone who needs it or a suitable donation organization.",
"Pass it on in a clean and usable condition."
],
shoes: [
"Check that the shoes are wearable and safe.",
"Clean them and pair them together.",
"Find a person or organization that accepts shoes.",
"Donate them in good condition."
],
phone: [
"Check that the phone works.",
"Back up important files.",
"Sign out of accounts and securely erase personal data.",
"Give it to someone who can use it."
],
box: [
"Check that the box is clean and sturdy.",
"Flatten it if convenient for transport.",
"Ask a friend, shop, or someone moving whether they need it.",
"Pass it on for reuse."
],
can: [
"Check that the container is safe and clean.",
"Make sure it has no sharp edges.",
"Ask whether someone can use it for a suitable purpose.",
"Pass it on only if it is safe and useful."
],
plasticBottle: [
"Check that the bottle is intended for repeated use.",
"Wash it thoroughly and inspect it for damage.",
"Ask whether someone needs a reusable bottle.",
"Pass it on only if it is clean and safe."
],
paper: [
"Gather clean, unused paper or notebooks.",
"Check that they are in usable condition.",
"Ask a student, school, or community group if they need them.",
"Donate the supplies they can accept."
],
glass: [
"Choose intact jars or containers.",
"Wash them and remove any contents.",
"Check that the recipient can use them safely.",
"Pass them on carefully."
],
battery: [
"Do not give away damaged or leaking batteries.",
"Keep unwanted batteries separate from ordinary rubbish.",
"Find an appropriate battery collection point.",
"Deliver the batteries according to its safety instructions."
],
electronics: [
"Check whether the electronic item works.",
"Back up and remove personal data where applicable.",
"Find a reputable donation program or someone who needs it.",
"Pass it on with any necessary accessories and safety information."
],
other: [
"Check that the item is clean and usable.",
"Take a photo or describe its condition.",
"Find someone who could use it.",
"Arrange a safe way to pass it on."
]
},
recycle: {
shirt: [
"Check whether the clothing is still wearable.",
"Donate wearable clothing when possible.",
"Look for a textile collection program for unsuitable clothing.",
"Follow the program's sorting instructions."
],
shoes: [
"Check whether the shoes can still be worn.",
"Donate wearable pairs if appropriate.",
"Look for a shoe collection or recycling program.",
"Follow its instructions for accepted materials."
],
phone: [
"Back up important information.",
"Sign out of accounts and erase personal data.",
"Remove accessories if the collection point requests it.",
"Take the phone to an approved electronic-waste collection point."
],
box: [
"Remove plastic wrapping and other materials.",
"Make sure the cardboard is clean and dry.",
"Flatten the box.",
"Place it in a cardboard recycling collection that accepts it."
],
can: [
"Empty the can completely.",
"Check local rules for accepted metal cans.",
"Rinse it if required by the recycling service.",
"Place it in the correct collection."
],
plasticBottle: [
"Empty the bottle.",
"Check the recycling symbol and local acceptance rules.",
"Rinse it if required by the collection service.",
"Place it in the appropriate recycling collection."
],
paper: [
"Remove food, plastic, and other contaminants.",
"Keep the paper clean and dry.",
"Check which paper types your local service accepts.",
"Place accepted paper in the correct collection."
],
glass: [
"Do not handle broken glass with bare hands.",
"Check whether your local service accepts the type of glass.",
"Keep glass separate if the collection service requires it.",
"Follow the collection point's safety and sorting instructions."
],
battery: [
"Do not place batteries in ordinary household recycling.",
"Keep damaged or leaking batteries away from heat and metal objects.",
"Find a designated battery collection point.",
"Follow its instructions for safe delivery."
],
electronics: [
"Back up important data and remove personal information.",
"Remove batteries only if the manufacturer says it is safe to do so.",
"Find an approved electronic-waste collection point.",
"Deliver the item according to its instructions."
],
other: [
"Identify the item's main material.",
"Check your local recycling rules.",
"Separate materials if the instructions require it.",
"Use an approved collection point for the material."
]
}
};
const ideas = {
repair: {
shirt: ["Sew on a loose button", "Patch a small tear", "Fix a loose seam"],
shoes: ["Replace worn laces", "Clean and condition the material", "Ask a shoe repair shop about loose soles"],
phone: ["Replace a damaged case", "Check the charging cable", "Seek professional screen repair"],
box: ["Reinforce corners with tape", "Repair small tears", "Strengthen the bottom"],
can: ["Use a safe container for crafts", "Turn an intact can into a pencil holder", "Avoid handling sharp or damaged edges"],
plasticBottle: ["Replace a suitable damaged cap", "Clean a reusable bottle", "Recycle a cracked bottle if accepted locally"],
paper: ["Tape a small tear", "Repair a loose book cover", "Rebind loose pages"],
glass: ["Replace a damaged lid", "Reuse an intact jar", "Recycle cracked glass according to local guidance"],
battery: ["Check the device for battery warnings", "Ask a qualified technician for help", "Use a designated battery collection point"],
electronics: ["Check external cables", "Clean vents according to instructions", "Seek professional repair for internal faults"],
other: ["Look for a missing part", "Check whether a small repair is possible", "Ask a repair professional for advice"]
},
reuse: {
shirt: ["Make cleaning cloths", "Create a reusable tote bag", "Use fabric for crafts"],
shoes: ["Use safe old shoes for gardening", "Clean them for outdoor activities", "Reuse laces for crafts"],
phone: ["Use it as a music player", "Turn it into a backup camera", "Use it for offline learning"],
box: ["Organize household items", "Store decorations", "Create a craft project"],
can: ["Make a pencil holder if safe", "Use it for craft storage", "Create a small organizer"],
plasticBottle: ["Use it for its intended reusable purpose", "Use it for a craft project", "Use it to organize small items if safe"],
paper: ["Use the blank side for notes", "Make scrap paper", "Use it for drawing"],
glass: ["Store stationery in a jar", "Use a jar for craft supplies", "Organize small household items"],
battery: ["Recharge a compatible rechargeable battery correctly", "Use batteries only in compatible devices", "Recycle batteries that can no longer be used"],
electronics: ["Use a working tablet for reading", "Use an old computer for learning", "Repurpose working accessories"],
other: ["Use it for storage", "Turn it into a craft project", "Find another practical purpose"]
},
rehome: {
shirt: ["Donate wearable clothes", "Give clothes to friends or family", "Find a clothing donation program"],
shoes: ["Donate wearable shoes", "Offer them to someone who needs them", "Check local donation programs"],
phone: ["Give a working phone to a family member", "Donate it through a reputable program", "Erase your personal data before passing it on"],
box: ["Offer boxes to someone moving", "Ask local shops if they can reuse them", "Give boxes to neighbors"],
can: ["Offer a safe reusable container", "Share suitable craft materials", "Pass on only clean and safe items"],
plasticBottle: ["Give away a clean reusable bottle", "Offer it to someone who needs one", "Check whether a local group accepts reusable items"],
paper: ["Donate unused notebooks", "Share art supplies with students", "Give clean paper to a school that accepts it"],
glass: ["Give intact jars to someone who can use them", "Offer clean containers to a community group", "Check that the recipient can use them safely"],
battery: ["Find a designated battery collection program", "Take unwanted batteries to an approved collection point", "Never pass on damaged or leaking batteries"],
electronics: ["Donate working electronics", "Give a working keyboard or mouse to someone", "Use a reputable electronics donation program"],
other: ["Offer it to friends", "Donate it if accepted", "Post it in a suitable reuse group"]
},
};
function renderList(titleText, items) {
const section = document.createElement("section");
const heading = document.createElement("h4");
heading.textContent = titleText;
const list = document.createElement("ol");
items.forEach(function (itemText) {
const listItem = document.createElement("li");
listItem.textContent = itemText;
list.appendChild(listItem);
});
section.append(heading, list);
return section;
}
function renderSolution(type) {
if (!solutionResult) return;
const currentItem = sessionStorage.getItem("terraturnItem");
solutionResult.replaceChildren();
if (!currentItem) {
solutionResult.textContent =
"No item was identified. Go back, upload a photo, and click Analyze Photo.";
return;
}
selectedType = type;
const heading = document.createElement("h2");
heading.textContent =
type.charAt(0).toUpperCase() + type.slice(1);
const identifiedItem = document.createElement("p");
const customItem = sessionStorage.getItem("terraturnCustomItem");
identifiedItem.textContent =
"Identified item: " +
(customItem && currentItem === "electronics"
? customItem
: (itemNames[currentItem] || "Other item"));
const description = document.createElement("p");
description.textContent =
(solutionDescriptions[type] || {})[currentItem] ||
(solutionDescriptions[type] || {}).other ||
"Choose a suitable solution for this item.";
solutionResult.append(heading, identifiedItem, description);

// Show nearby places for repair, rehoming, or recycling
const locationSection = document.getElementById("actionLocationSection");
if (locationSection) {
locationSection.hidden = !["repair", "rehome", "recycle"].includes(type);
}
if (type === "repair") {
const homeButton = document.createElement("button");
homeButton.type = "button";
homeButton.textContent = "Repair at Home";
homeButton.dataset.tutorial = "home";
const shopsButton = document.createElement("button");
shopsButton.type = "button";
shopsButton.textContent = "Find Repair Shops";
shopsButton.dataset.tutorial = "shops";
solutionResult.append(homeButton, shopsButton);
} else {
const tutorialButton = document.createElement("button");
tutorialButton.type = "button";
tutorialButton.textContent = "Show Tutorial";
tutorialButton.dataset.tutorial = "tutorial";
solutionResult.appendChild(tutorialButton);
}

// Display estimated carbon savings
const carbonEstimate = document.createElement("p");
const estimatedAmount = window.TerraCarbon
? TerraCarbon.getEstimate(currentItem, type)
: 0;
carbonEstimate.textContent =
"Estimated CO₂e avoided if completed: " +
estimatedAmount.toFixed(1) +
" kg CO₂e (illustrative estimate).";

// Create the completion button
const completedButton = document.createElement("button");
completedButton.type = "button";
completedButton.textContent = "I Completed This Action";
completedButton.addEventListener("click", function () {
if (completedButton.disabled) return;
if (!window.TerraCarbon) {
carbonEstimate.textContent =
"Carbon tracker could not load. Please refresh the page.";
return;
}
TerraCarbon.addCompletedAction(currentItem, type);
completedButton.disabled = true;
completedButton.textContent = "Action Completed ✓";
});
solutionResult.append(carbonEstimate, completedButton);
}

// Connect the four solution buttons
document.querySelectorAll("[data-solution]").forEach(function (button) {
button.addEventListener("click", function () {
renderSolution(button.dataset.solution);
});
});

// Handle tutorial buttons and repair-shop searches
document.addEventListener("click", function (event) {
const button = event.target.closest("button");
if (!button || !button.dataset.tutorial) return;
const currentItem = sessionStorage.getItem("terraturnItem");
if (!currentItem || !selectedType) return;
const action = button.dataset.tutorial;
const oldTutorial = document.getElementById("tutorialContent");
if (oldTutorial) oldTutorial.remove();
if (action === "shops") {
const shopSection = document.createElement("div");
shopSection.id = "tutorialContent";
const heading = document.createElement("h3");
heading.textContent = "Find Repair Shops Near You";
const message = document.createElement("p");
message.textContent =
"Search for repair services near you. Check the shop's services, reviews, and distance before visiting.";
const link = document.createElement("a");
link.href = "https://www.google.com/maps/search/" +
encodeURIComponent(
(itemNames[currentItem] || "item") +
" repair shops near me"
);
link.target = "_blank";
link.rel = "noopener noreferrer";
link.textContent = "Open Google Maps";
shopSection.append(heading, message, link);
solutionResult.appendChild(shopSection);
return;
}
const tutorial = document.createElement("div");
tutorial.id = "tutorialContent";
const heading = document.createElement("h3");
heading.textContent = selectedType === "repair"
? "Repair at Home: Step-by-Step Tutorial"
: selectedType.charAt(0).toUpperCase() +
selectedType.slice(1) + " Tutorial";
const intro = document.createElement("p");
intro.textContent =
"Item: " + (itemNames[currentItem] || "Other item");
const steps = tutorialSteps[selectedType] || {};
const itemSteps = steps[currentItem] || steps.other || [];
const ideasBySolution = ideas[selectedType] || {};
const itemIdeas =
ideasBySolution[currentItem] || ideasBySolution.other || [];
const stepsSection = renderList("Steps to Follow", itemSteps);
const titles = {
repair: "Three Repair Ideas",
reuse: "Three Reuse Ideas",
rehome: "Three Rehoming Ideas",

};
const ideasSection = renderList(
    titles[selectedType] || "",
    itemIdeas
);
tutorial.append(heading, intro, stepsSection, ideasSection);
solutionResult.appendChild(tutorial);
});

// Find places for the selected action
document.addEventListener("click", function (event) {
const button = event.target.closest("#actionFindLocationsButton");
if (!button) return;

const emirateSelect = document.getElementById("actionEmirateSelect");
const locationResults = document.getElementById("actionLocationResults");
if (!emirateSelect || !locationResults) return;

const emirate = emirateSelect.value;
const currentItem = sessionStorage.getItem("terraturnItem") || "other";
const action = selectedType;
let searchTerm = "recycling centers";

if (action === "repair") {
searchTerm = "repair shops";
} else if (action === "rehome") {
searchTerm = "charity donation centers";
} else if (action === "recycle") {
if (["phone", "battery", "electronics"].includes(currentItem)) {
searchTerm = "electronic waste recycling";
} else if (["shirt", "shoes"].includes(currentItem)) {
searchTerm = "clothing and shoe recycling";
} else {
searchTerm = "recycling centers";
}
}

const query = encodeURIComponent(searchTerm + " in " + emirate);
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + query;

locationResults.replaceChildren();

const message = document.createElement("p");
message.textContent = "Search for " + searchTerm + " in " + emirate + ":";

const link = document.createElement("a");
link.href = mapsUrl;
link.target = "_blank";
link.rel = "noopener noreferrer";
link.textContent = "View places on Google Maps";

locationResults.append(message, link);
});
});