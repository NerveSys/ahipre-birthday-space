const dateInput = document.getElementById("birthdate");
const button = document.getElementById("showJourney");
const result = document.getElementById("result");

const mainCard = document.getElementById("mainCard");
const cosmicCard = document.getElementById("cosmicCard");
const cosmicMessage = document.getElementById("cosmicMessage");
const fact = document.getElementById("fact");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;
const eventCard = document.getElementById("eventCard");
const eventDescription = document.getElementById("eventDescription");
const apodInfo = document.getElementById("apodInfo");
const apodTitle = document.getElementById("apodTitle");
const apodNote = document.getElementById("apodNote");
const localEvents = [
    "Humans launched powerful space telescopes that can see deep into the cosmos.",
    "New exoplanets were discovered, proving that other worlds like ours exist.",
    "Groundbreaking missions flew past distant planets and sent back stunning images.",
    "Scientists detected signals from colliding black holes, bending space and time."
];


function formatDateForApod(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`; // APOD expects YYYY-MM-DD[web:177][web:185]
}

function getAgeInYears(birthDate) {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        years--;
    }
    return years; // standard date‑difference pattern[web:62][web:65]
}

function getEraMessage(year) {
    if (year >= 1995 && year <= 2005) {
        return "You were born in the era when humanity was building the foundations of the modern digital and space age.";
    } else if (year > 2005) {
        return "You arrived when space exploration was accelerating and new telescopes were opening fresh windows into the universe.";
    } else {
        return "You came from a time when the first great space missions were inspiring the entire planet.";
    }
}

function getCosmicFact(ageYears) {
    const orbits = ageYears;
    const rotations = ageYears * 365; // simple estimate[web:64][web:72]
    return `In your lifetime, Earth has carried you on about ${orbits} journeys around the Sun and spun you through roughly ${rotations.toLocaleString()} rotations.`;
}

async function showApodForDate(birthDate) {
    const apodDate = formatDateForApod(birthDate);
    const apiKey = "fp5enluuc7nziSq8HjnUmQftxexapCwSMaw68uIN";

    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${apodDate}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("APOD request failed");
        }
        const data = await response.json();

        if (data.media_type === "image") {
            document.body.style.backgroundImage = `url(${data.url})`;
        }

        apodTitle.textContent = data.title || "Astronomy Picture of the Day";
        // Use the APOD explanation as info text (shortened).
        const explanation = data.explanation || "";
        apodNote.textContent =
            `This is NASA's Astronomy Picture of the Day for ${apodDate}. ` +
            explanation;

        apodInfo.classList.add("apod-visible");
    } catch (err) {
        console.error("APOD error:", err);
        apodTitle.textContent = "Space is mysterious today.";
        apodNote.textContent = "NASA's image for this date could not be loaded.";
        apodInfo.classList.add("apod-visible");
    }
}



button.addEventListener("click", () => {
    const value = dateInput.value;
    if (!value) {
        result.textContent = "Please select your birth date first.";
        return;
    }

    const birthDate = new Date(value);
    const age = getAgeInYears(birthDate);
    const year = birthDate.getFullYear();

    const eraMessage = getEraMessage(year);
    const factText = getCosmicFact(age);

    // show in main card (as you already do)
    result.textContent = `You are about ${age} years old in Earth time. ${eraMessage}`;

    // existing fade timings (keep your current values)
    setTimeout(() => {
        mainCard.style.opacity = "0";
        mainCard.style.transform = "translateY(-8px)";
    }, 800);

    setTimeout(() => {
        mainCard.style.display = "none";

        cosmicMessage.textContent =
            "From the moment you were born, the universe has been quietly moving with you.";
        fact.textContent = factText;

        cosmicCard.style.opacity = "1";
        cosmicCard.style.transform = "translateY(0)";
        cosmicCard.style.pointerEvents = "auto";

        cosmicMessage.classList.add("show-text");
        fact.classList.add("show-text");
      const randomIndex = Math.floor(Math.random() * localEvents.length);
       eventDescription.textContent = localEvents[randomIndex];
       eventCard.classList.add("event-visible");

    }, 800 + 2000);

    // NEW: after a few seconds, fade cards and show APOD
    setTimeout(() => {
        cosmicCard.style.opacity = "0";
        eventCard.style.opacity = "0";

        setTimeout(() => {
            showApodForDate(birthDate);
        }, 800);
    }, 800 + 2000 + 5000); // wait extra 5s before APOD reveal
});

musicToggle.addEventListener("click", () => {
    if (!isPlaying) {
        bgMusic.play(); // starts the audio[web:164][web:166]
        isPlaying = true;
        musicToggle.textContent = "Pause Space Music";
    } else {
        bgMusic.pause();
        isPlaying = false;
        musicToggle.textContent = "Play Space Music";
    }
});

