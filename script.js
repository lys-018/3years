/* =========================================================
   EDIT ME
   Everything about the story lives in this array. Change the
   text, swap the image/video paths, or reorder steps — the
   rest of the file just renders whatever is here.
   ========================================================= */
const steps = [
  {
    type: "text",
    message: "Puku , Ready for a surprise? I wanted to give it to you at 12 AM, but it’s okay. ❤️ "
  },
  {
    type: "text",
    message: "Surprise bhanda aagadi Let’s look back at our memories. ❤️"
  },
  {
    type: "image",
    src: "images/img9.png",
    caption: "Hera na 2 jana baccha haru kati cute",
    animation: "zoom"
  },
  {
    type: "image",
    src: "images/img5.jpeg",
    caption: "Hera na timi kati cute maya ..",
    animation: "slide"
  },
  {
    type: "image",
    src: "images/img8.jpeg",
    caption: "Hera na kasto sxy Kiss",
    animation: "zoom"
  },
  {
    type: "image",
    src: "images/img1.png",
    caption: "Aw Mero babe lai bokeko",
    animation: "slide"
  },
  {
    type: "video",
    src: "images/keema.mp4",
    caption: "Hera na jodi dhukur le keema khako",
    autoplay: true,
  controls: false,
  muted: true
  },
  {
    type: "text",
    message: "Okay... now you're getting close."
  },
  {
    type: "text",
    message: "Puku , Ready for a surprise?"
  },
  // {
  //   type: "camera",
  //   message: "One last thing before the reveal.",
  //   caption: "This is completely optional — you can skip it."
  // },
  {
    type: "final",
    title: "Sano xa but accept gara la",
    message: "Aani Timi mero ho , i loveeeeeeeeeeeeeee youuuuuuuuuuuuuuuu mayaaaaaaaaaaaa"
  },
    {
    type: "video",
    src: "images/sry.mp4",
    caption: "Surprise! (SOUND FULL BANAU AND LAST SAMMA HERA LA Please)",
    autoplay: true,
  controls: false,
 
  },
];

/* =========================================================
   State
   ========================================================= */
let current = -1; // -1 = landing screen
let cameraStream = null;

/* =========================================================
   Elements
   ========================================================= */
const landing = document.getElementById("landing");
const startBtn = document.getElementById("startBtn");
const cardWrap = document.getElementById("cardWrap");
const card = document.getElementById("card");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const progressHeader = document.getElementById("progressHeader");
const progressCount = document.getElementById("progressCount");
const progressFill = document.getElementById("progressFill");
const bottomBar = document.getElementById("bottomBar");
const bottomBarFill = document.getElementById("bottomBarFill");

/* =========================================================
   Particles — a handful of soft floating photos behind everything

   Add as many small images as you like here (any number, any
   names) and each particle will pick one at random. Square-ish
   crops work best since particles are circular.
   ========================================================= */
const particlePhotos = [
  "images/img1.png",
  "images/img2.JPG",
    "images/img3.jpeg",
    "images/img4.jpeg",
    "images/img5.jpeg",
    "images/img6.jpeg",
    "images/img7.jpeg",
    "images/img8.jpeg",
    "images/img10.jpg",

  // "images/particle2.jpg",
  // "images/particle3.jpg",
];

function spawnParticles(count = 50) {
  const field = document.getElementById("particles");
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 28 + Math.random() * 26; // bigger than plain dots so the photo reads
    const photo = particlePhotos[Math.floor(Math.random() * particlePhotos.length)];
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.backgroundImage = `url(${photo})`;
    p.style.animationDuration = `${14 + Math.random() * 14}s`;
    p.style.animationDelay = `${Math.random() * -20}s`;
    field.appendChild(p);
  }
}

/* =========================================================
   Navigation
   ========================================================= */
startBtn.addEventListener("click", () => {
  landing.hidden = true;
  cardWrap.hidden = false;
  progressHeader.hidden = false;
  bottomBar.hidden = false;
  goTo(0);
});

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    goTo(current + 1);
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    goTo(current - 1);
  }
});

function goTo(index) {
  if (steps[current] && steps[current].type === "camera") {
    stopCamera();
  }
  current = index;
  updateProgress();
  transitionCard(() => renderStep(steps[current]));
}

function updateProgress() {
  const total = steps.length;
  const position = current + 1;
  progressCount.textContent = `${position} / ${total}`;
  const pct = (position / total) * 100;
  progressFill.style.width = `${pct}%`;
  bottomBarFill.style.width = `${pct}%`;
  backBtn.hidden = current === 0;
  nextBtn.textContent = current === steps.length - 1 ? "Done" : "Next →";
}

/* Fade the current content out, swap it, then fade the new content in */
function transitionCard(renderFn) {
  const existing = card.querySelector(".card__content");
  if (!existing) {
    renderFn();
    return;
  }
  existing.classList.add("fade-out");
  window.setTimeout(renderFn, 320);
}

/* =========================================================
   Rendering
   ========================================================= */
function renderStep(step) {
  card.innerHTML = "";
  const content = document.createElement("div");
  content.className = "card__content enter";

  switch (step.type) {
    case "text":
      content.appendChild(makeTitle(step.message));
      break;

    case "image":
      content.appendChild(makeMediaFrame("image", step));
      if (step.caption) content.appendChild(makeCaption(step.caption));
      break;

    case "video":
      content.appendChild(makeMediaFrame("video", step));
      if (step.caption) content.appendChild(makeCaption(step.caption));
      break;

    case "camera":
      content.appendChild(makeTitle(step.message));
      if (step.caption) content.appendChild(makeCaption(step.caption));
      content.appendChild(makeCameraBlock());
      break;

    case "final":
      content.appendChild(makeTitle(step.title, true));
      content.appendChild(makeCaption(step.message));
      break;
  }

  card.appendChild(content);
}

function makeTitle(text, isFinal = false) {
  const h2 = document.createElement("h2");
  h2.className = isFinal ? "card__title card__title--final" : "card__title";
  h2.textContent = text;
  return h2;
}

function makeCaption(text) {
  const p = document.createElement("p");
  p.className = "card__caption";
  p.textContent = text;
  return p;
}

function makeMediaFrame(kind, step) {
  const frame = document.createElement("div");
  frame.className = `card__media-frame card__media-frame--${step.animation || "zoom"}`;

  if (kind === "image") {
    const img = document.createElement("img");
    img.src = step.src;
    img.alt = step.caption || "";
    img.onerror = () => {
      frame.replaceWith(makePlaceholder("🖼", "Image not found yet — drop it into /images"));
    };
    frame.appendChild(img);
  } else {
    const video = document.createElement("video");
    video.src = step.src;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.onerror = () => {
      frame.replaceWith(makePlaceholder("🎬", "Video not found yet — drop it into /videos"));
    };
    frame.appendChild(video);
  }
  return frame;
}

function makePlaceholder(icon, label) {
  const div = document.createElement("div");
  div.className = "card__placeholder";
  const iconEl = document.createElement("div");
  iconEl.className = "card__placeholder-icon";
  iconEl.textContent = icon;
  const labelEl = document.createElement("div");
  labelEl.textContent = label;
  div.appendChild(iconEl);
  div.appendChild(labelEl);
  return div;
}

// /* =========================================================
//    Camera step — only ever requested after an explicit click
//    ========================================================= */
// function makeCameraBlock() {
//   const wrap = document.createElement("div");
//   wrap.style.display = "flex";
//   wrap.style.flexDirection = "column";
//   wrap.style.alignItems = "center";
//   wrap.style.gap = "16px";
//   wrap.style.width = "100%";

//   const allowBtn = document.createElement("button");
//   allowBtn.className = "btn btn--primary";
//   allowBtn.textContent = "Allow Camera 📷";

//   const preview = document.createElement("div");
//   preview.className = "camera-preview";
//   preview.hidden = true;

//   const status = document.createElement("p");
//   status.className = "camera-status";

//   allowBtn.addEventListener("click", async () => {
//     allowBtn.disabled = true;
//     status.textContent = "Requesting camera access…";
//     try {
//       cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       const video = document.createElement("video");
//       video.autoplay = true;
//       video.playsInline = true;
//       video.muted = true;
//       video.srcObject = cameraStream;
//       preview.innerHTML = "";
//       preview.appendChild(video);
//       preview.hidden = false;
//       status.textContent = "Camera on — you can move to the next step.";
//       allowBtn.hidden = true;
//     } catch (err) {
//       status.textContent = "No worries — camera access wasn't granted, so we'll skip it.";
//       allowBtn.disabled = false;
//     }
//   });

//   wrap.appendChild(allowBtn);
//   wrap.appendChild(preview);
//   wrap.appendChild(status);
//   return wrap;
// }

// /* Stop the camera if the user navigates away from that step */
// function stopCamera() {
//   if (cameraStream) {
//     cameraStream.getTracks().forEach((track) => track.stop());
//     cameraStream = null;
//   }
// }

/* =========================================================
   Init
   ========================================================= */
spawnParticles();
