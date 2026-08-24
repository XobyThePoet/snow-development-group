document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = nav?.querySelectorAll("a") ?? [];

const setNavigation = (isOpen) => {
  if (!header || !nav || !navToggle) return;

  header.classList.toggle("is-open", isOpen);
  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.querySelector(".nav-toggle-label").textContent = isOpen ? "Close" : "Menu";
  document.body.classList.toggle("nav-open", isOpen);
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") !== "true";
  setNavigation(isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", () => setNavigation(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavigation(false);
});

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  reveals.forEach((element) => observer.observe(element));
}

const storyChapters = [...document.querySelectorAll("[data-story-chapter]")];
const storyImages = [...document.querySelectorAll("[data-story-image]")];
const storyCount = document.querySelector("[data-story-count]");

const setActiveStoryChapter = (activeIndex) => {
  storyChapters.forEach((chapter, index) => {
    const isActive = index === activeIndex;
    chapter.classList.toggle("is-active", isActive);

    if (isActive) {
      chapter.setAttribute("aria-current", "step");
    } else {
      chapter.removeAttribute("aria-current");
    }
  });

  storyImages.forEach((image, index) => {
    image.classList.toggle("is-active", index === activeIndex);
  });

  if (storyCount) {
    storyCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
      storyChapters.length,
    ).padStart(2, "0")}`;
  }
};

if (storyChapters.length && storyImages.length) {
  setActiveStoryChapter(0);

  if ("IntersectionObserver" in window) {
    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const chapterIndex = storyChapters.indexOf(entry.target);
          if (chapterIndex >= 0) setActiveStoryChapter(chapterIndex);
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );

    storyChapters.forEach((chapter) => storyObserver.observe(chapter));
  }
}

const form = document.querySelector("[data-interest-form]");
const formStatus = document.querySelector("[data-form-status]");

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand("copy");
  helper.remove();

  if (!copied) throw new Error("Copy unavailable");
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const inquiry = [
    "Snow Development Group — Inquiry",
    "",
    `Interest: ${data.get("interest")}`,
    `Name: ${data.get("name")}`,
    `Organization: ${data.get("organization") || "Not provided"}`,
    `Email: ${data.get("email")}`,
    "",
    "Message:",
    data.get("message"),
  ].join("\n");

  try {
    await copyText(inquiry);
    formStatus.textContent =
      "Inquiry copied. Paste it into a message to John, Coby, or your Snow Development Group contact.";
  } catch {
    formStatus.textContent =
      "Copying is unavailable in this browser. Please select your message and share it directly with your Snow Development Group contact.";
  }
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
