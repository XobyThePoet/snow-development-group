document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = nav?.querySelectorAll("a") ?? [];
const mobileNavigation = window.matchMedia("(max-width: 820px)");
let lockedScrollPosition = 0;
let navigationReturnFocus = null;

const setNavigation = (isOpen, { restoreFocus = true } = {}) => {
  if (!header || !nav || !navToggle) return;

  const shouldOpen = Boolean(isOpen && mobileNavigation.matches);
  const wasOpen = header.classList.contains("is-open");

  if (shouldOpen && !wasOpen) {
    lockedScrollPosition = window.scrollY;
    navigationReturnFocus = document.activeElement;
    document.body.style.top = `-${lockedScrollPosition}px`;
  }

  header.classList.toggle("is-open", shouldOpen);
  nav.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  navToggle.querySelector(".nav-toggle-label").textContent = shouldOpen ? "Close" : "Menu";
  document.body.classList.toggle("nav-open", shouldOpen);

  if (mobileNavigation.matches) {
    nav.toggleAttribute("inert", !shouldOpen);
    nav.setAttribute("aria-hidden", String(!shouldOpen));
  } else {
    nav.removeAttribute("inert");
    nav.removeAttribute("aria-hidden");
  }

  if (shouldOpen) {
    requestAnimationFrame(() => navLinks[0]?.focus());
    return;
  }

  if (wasOpen) {
    document.body.style.top = "";
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: lockedScrollPosition, left: 0, behavior: "auto" });
    document.documentElement.style.scrollBehavior = previousScrollBehavior;

    if (restoreFocus && navigationReturnFocus instanceof HTMLElement) {
      navigationReturnFocus.focus();
    }
  }
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") !== "true";
  setNavigation(isOpen);
});

navLinks.forEach((link) =>
  link.addEventListener("click", () => setNavigation(false, { restoreFocus: false })),
);

document.addEventListener("keydown", (event) => {
  const isOpen = navToggle?.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && isOpen) {
    event.preventDefault();
    setNavigation(false);
    return;
  }

  if (event.key !== "Tab" || !isOpen) return;

  const firstNavigationLink = navLinks[0];
  const lastNavigationLink = navLinks[navLinks.length - 1];

  if (event.shiftKey && document.activeElement === firstNavigationLink) {
    event.preventDefault();
    navToggle.focus();
  } else if (event.shiftKey && document.activeElement === navToggle) {
    event.preventDefault();
    lastNavigationLink?.focus();
  } else if (!event.shiftKey && document.activeElement === lastNavigationLink) {
    event.preventDefault();
    navToggle.focus();
  }
});

const syncNavigationMode = () => {
  if (mobileNavigation.matches) {
    setNavigation(false, { restoreFocus: false });
  } else {
    setNavigation(false, { restoreFocus: false });
    document.body.style.top = "";
  }
};

mobileNavigation.addEventListener("change", syncNavigationMode);
syncNavigationMode();

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
      "Inquiry copied. Paste it into a message to Jon, Coby, or your Snow Development Group contact.";
  } catch {
    formStatus.textContent =
      "Copying is unavailable in this browser. Please select your message and share it directly with your Snow Development Group contact.";
  }
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
