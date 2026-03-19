/* ============================================
   COVER MEDIA — Autoplay / Hover / Click
   Adapted from Osmo Supply media component
   ============================================ */
function initMediaSetup() {
  var mediaElements = document.querySelectorAll("[data-media-init]");
  if (!mediaElements.length) return;

  var pauseDelay = 200;
  var viewportOffset = 0.1;
  var isHoverDevice = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (initMediaSetup._cleanup) {
    initMediaSetup._cleanup.forEach(function(fn) { fn(); });
  }

  var cleanupFns = [];
  var rootMarginValue = viewportOffset * 100;

  mediaElements.forEach(function(mediaEl) {
    var video = mediaEl.querySelector("[data-media-video-src]");
    if (!video) return;

    var mode = mediaEl.dataset.mediaMode || "autoplay";
    var touchMode = mediaEl.dataset.mediaTouchMode;
    var resetAttr = mediaEl.dataset.mediaReset;
    var toggleElements = Array.from(mediaEl.querySelectorAll("[data-media-toggle]"));

    var activeMode = !isHoverDevice
      ? (touchMode || (mode === "hover" ? "autoplay" : mode))
      : mode;
    var shouldResetOnPause = resetAttr === "true" ? true : resetAttr === "false" ? false : activeMode === "hover";
    var clickTargets = toggleElements.length ? toggleElements : [mediaEl];
    var shouldUseClickToggle = activeMode === "click" || (activeMode === "autoplay" && toggleElements.length);

    var isInView = false;
    var isHovering = false;
    var hasLoaded = false;
    var userPaused = false;
    var userActivated = false;
    var isActivated = false;
    var shouldBePlaying = false;
    var pauseTimer = null;

    function setStatus(status) {
      mediaEl.dataset.mediaStatus = status;
    }

    function clearPauseTimer() {
      clearTimeout(pauseTimer);
    }

    function addCleanup(fn) {
      cleanupFns.push(fn);
    }

    function on(target, event, handler) {
      target.addEventListener(event, handler);
      addCleanup(function() { target.removeEventListener(event, handler); });
    }

    function playAttempt() {
      video.play().then(function() {
        if (shouldBePlaying) setStatus("playing");
      }).catch(function() {});
    }

    function loadVideo() {
      if (hasLoaded) return;
      var src = video.dataset.mediaVideoSrc;
      if (!src) return;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.src = src;
      video.load();
      hasLoaded = true;
    }

    function shouldResume() {
      if (!isInView || document.hidden) return false;
      if (activeMode === "autoplay") return !userPaused;
      if (activeMode === "click") return userActivated && !userPaused;
      return isHovering;
    }

    function playVideo() {
      if (!isInView || document.hidden) return;
      shouldBePlaying = true;
      clearPauseTimer();
      loadVideo();
      setStatus(video.readyState < 3 ? "loading" : "playing");
      playAttempt();
    }

    function pauseVideo(delay, reset) {
      shouldBePlaying = false;
      clearPauseTimer();
      pauseTimer = setTimeout(function() {
        video.pause();
        if (reset) video.currentTime = 0;
      }, delay || 0);
    }

    function handleHoverIn() {
      if (!isInView || document.hidden) return;
      isHovering = true;
      clearPauseTimer();
      if (!video.paused) {
        shouldBePlaying = true;
        setStatus("playing");
        return;
      }
      playVideo();
    }

    function handleHoverOut() {
      if (!isInView) return;
      isHovering = false;
      setStatus("not-active");
      pauseVideo(pauseDelay, shouldResetOnPause);
    }

    function handleClick() {
      if (!isInView || document.hidden) return;
      clearPauseTimer();
      if (video.paused) {
        userActivated = true;
        userPaused = false;
        playVideo();
      } else {
        userActivated = true;
        userPaused = true;
        setStatus(activeMode === "click" ? "paused" : "not-active");
        pauseVideo(pauseDelay, shouldResetOnPause);
      }
    }

    function handleViewport(entries) {
      entries.forEach(function(entry) {
        if (entry.target !== mediaEl) return;

        if (!isActivated && entry.isIntersecting) {
          isActivated = true;
          if (shouldUseClickToggle) {
            clickTargets.forEach(function(toggleEl) { on(toggleEl, "click", handleClick); });
          }
          if (activeMode === "hover") {
            on(mediaEl, "mouseenter", handleHoverIn);
            on(mediaEl, "mouseleave", handleHoverOut);
          }
        }

        isInView = entry.isIntersecting;
        if (isInView) {
          if (shouldResume()) playVideo();
        } else {
          isHovering = false;
          if (!video.paused || shouldBePlaying) {
            setStatus("paused");
            pauseVideo(0, false);
          }
        }
      });
    }

    function handlePageVisibilityChange() {
      if (document.hidden) {
        if (!video.paused || shouldBePlaying) {
          setStatus("paused");
          pauseVideo(0, false);
        }
        return;
      }
      if (shouldResume()) playVideo();
    }

    mediaEl.dataset.mediaStatus = "not-active";

    var observer = new IntersectionObserver(handleViewport, {
      rootMargin: rootMarginValue + "% 0px " + rootMarginValue + "% 0px",
      threshold: 0
    });
    observer.observe(mediaEl);

    on(video, "playing", function() { if (shouldBePlaying) setStatus("playing"); });
    on(video, "waiting", function() { if (shouldBePlaying) setStatus("loading"); });
    on(video, "canplay", function() { if (shouldBePlaying && isInView && !document.hidden) playAttempt(); });
    on(video, "loadeddata", function() { if (shouldBePlaying && isInView && !document.hidden) playAttempt(); });
    on(video, "ended", function() { if (!shouldBePlaying || !isInView || document.hidden) return; video.currentTime = 0; playAttempt(); });
    on(document, "visibilitychange", handlePageVisibilityChange);

    addCleanup(function() { observer.disconnect(); });
    addCleanup(function() {
      clearPauseTimer();
      shouldBePlaying = false;
      video.pause();
    });
  });

  initMediaSetup._cleanup = cleanupFns;
}

document.addEventListener("DOMContentLoaded", function() {
  initMediaSetup();
});
