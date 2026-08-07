/* =============================================================================
   Cure Link — interaction layer
   -----------------------------------------------------------------------------
   No framework, no dependencies. Everything is progressive: with JS disabled the
   markup still reads and navigates correctly, revealed content is visible, and
   the contact form falls back to native browser validation.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------- sticky header */
  var header = $('#siteHeader');
  if (header) {
    var lastStuck = null;
    var onScroll = function () {
      var stuck = window.scrollY > 8;
      if (stuck !== lastStuck) {
        header.classList.toggle('is-stuck', stuck);
        lastStuck = stuck;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------ desktop mega menu */
  $$('.has-mega').forEach(function (item) {
    var toggle = $('.nav-link--toggle', item);
    var panel = $('.mega', item);
    if (!toggle || !panel) return;

    var closeTimer = null;
    var open = function () {
      window.clearTimeout(closeTimer);
      panel.hidden = false;
      // Force a reflow so the transition has a start state to animate from.
      // Deliberately synchronous rather than requestAnimationFrame: rAF does not
      // fire in a background tab or a non-painting frame, which would leave the
      // panel un-hidden but never transitioned in.
      void panel.offsetWidth;
      panel.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };
    var close = function (immediate) {
      window.clearTimeout(closeTimer);
      var finish = function () {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        window.setTimeout(function () {
          if (!panel.classList.contains('is-open')) panel.hidden = true;
        }, 240);
      };
      if (immediate) finish();
      else closeTimer = window.setTimeout(finish, 140);
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', function () { close(); });
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (toggle.getAttribute('aria-expanded') === 'true') close(true);
      else open();
    });
    // keyboard: close on Escape, and when focus leaves the whole item
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(true); toggle.focus(); }
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) close();
    });
  });

  /* ---------------------------------------------------- mobile drawer */
  var burger = $('.burger');
  var drawer = $('#mobileNav');
  if (burger && drawer) {
    var panel = $('.mnav__panel', drawer);
    var lastFocus = null;

    var openDrawer = function () {
      lastFocus = document.activeElement;
      drawer.hidden = false;
      void drawer.offsetWidth; // see note above — synchronous reflow, not rAF
      drawer.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var first = $('.mnav__close', drawer);
      if (first) first.focus();
    };
    var closeDrawer = function () {
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () {
        if (!drawer.classList.contains('is-open')) drawer.hidden = true;
      }, 380);
      if (lastFocus) lastFocus.focus();
    };

    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') closeDrawer();
      else openDrawer();
    });
    $$('.mnav__close', drawer).forEach(function (b) { b.addEventListener('click', closeDrawer); });
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
    // close after tapping a real link
    $$('.mnav__list a', drawer).forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
    // trap focus inside the drawer while it is open
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !drawer.classList.contains('is-open')) return;
      var focusables = $$('a[href], button:not([disabled]), input, select, textarea', panel)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* accordion sections inside the drawer */
    $$('.mnav__toggle', drawer).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sub = document.getElementById(btn.getAttribute('aria-controls'));
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        if (sub) sub.hidden = isOpen;
      });
    });
  }

  /* ------------------------------------------------------ hero slider */
  var hero = $('[data-slider]');
  if (hero) {
    var slides = $$('.hero__slide', hero);
    var dots = $$('.hero__dot', hero);
    var INTERVAL = 6000;
    var current = 0;
    var timer = null;

    hero.style.setProperty('--hero-interval', INTERVAL + 'ms');

    var goTo = function (n) {
      if (n === current) return;
      slides.forEach(function (s, i) {
        var on = i === n;
        s.classList.toggle('is-active', on);
        if (on) s.removeAttribute('aria-hidden');
        else s.setAttribute('aria-hidden', 'true');
      });
      dots.forEach(function (d, i) {
        var on = i === n;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', String(on));
        // restart the progress animation by forcing a reflow on the fill
        var fill = $('.hero__dot-fill', d);
        if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = ''; }
      });
      current = n;
    };

    var advance = function () { goTo((current + 1) % slides.length); };

    var play = function () {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = window.setInterval(advance, INTERVAL);
      hero.classList.remove('hero--paused');
    };
    var stop = function () {
      if (timer) { window.clearInterval(timer); timer = null; }
      hero.classList.add('hero--paused');
    };

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { goTo(i); play(); });
    });

    // arrow keys move between slides when a dot has focus
    var strip = $('.hero__dots', hero);
    if (strip) {
      strip.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var next = (current + (e.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length;
        goTo(next);
        dots[next].focus();
        play();
      });
    }

    // pause while the visitor is reading or interacting, and off-screen
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', function (e) {
      if (!hero.contains(e.relatedTarget)) play();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else play();
    });

    if (reduceMotion) hero.classList.add('hero--paused');
    else play();
  }

  /* ------------------------------------------------- reveal on scroll */
  var revealables = $$('.reveal');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });

      /* Safety net: content must never be left invisible. If anything has not
         been revealed a few seconds after load — an observer that failed to
         fire, an odd viewport, a print or screenshot context — show it. */
      window.setTimeout(function () {
        revealables.forEach(function (el) {
          if (!el.classList.contains('is-in')) el.classList.add('is-in');
        });
      }, 2500);
    }
  }

  /* --------------------------------------------------------- back to top */
  var toTop = $('.to-top');
  if (toTop) {
    var lastVisible = null;
    var toggleTop = function () {
      var visible = window.scrollY > 600;
      if (visible !== lastVisible) {
        toTop.classList.toggle('is-visible', visible);
        lastVisible = visible;
      }
    };
    window.addEventListener('scroll', toggleTop, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    toggleTop();
  }

  /* ------------------------------------- product gallery + lightbox */
  var galleries = $$('[data-gallery]');
  if (galleries.length) {
    galleries.forEach(function (gal) {
      var slides = $$('.pgal__slide', gal);
      var thumbs = $$('.pgal__thumb', gal);

      var show = function (i) {
        slides.forEach(function (s, n) {
          var on = n === i;
          s.classList.toggle('is-active', on);
          // only the visible slide should be reachable by keyboard
          s.setAttribute('tabindex', on ? '0' : '-1');
        });
        thumbs.forEach(function (t, n) {
          t.classList.toggle('is-active', n === i);
          t.setAttribute('aria-selected', String(n === i));
        });
        gal.dataset.current = String(i);
      };

      thumbs.forEach(function (t, i) {
        t.addEventListener('click', function () { show(i); });
      });

      // arrow keys move between thumbnails, as expected of a tablist
      var strip = $('.pgal__thumbs', gal);
      if (strip) {
        strip.addEventListener('keydown', function (e) {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          e.preventDefault();
          var cur = parseInt(gal.dataset.current || '0', 10);
          var next = (cur + (e.key === 'ArrowRight' ? 1 : -1) + thumbs.length) % thumbs.length;
          show(next);
          thumbs[next].focus();
        });
      }

      slides.forEach(function (s, i) {
        s.addEventListener('click', function () { openLightbox(gal, i); });
      });
    });

    /* one lightbox element, reused by every gallery on the page */
    var lb = document.createElement('div');
    lb.className = 'lbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Product image');
    lb.innerHTML =
      '<button class="lbox__btn lbox__close" type="button" aria-label="Close">' +
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<button class="lbox__btn lbox__prev" type="button" aria-label="Previous image">' +
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12h15"/><path d="m13.5 6 6 6-6 6"/></svg></button>' +
      '<button class="lbox__btn lbox__next" type="button" aria-label="Next image">' +
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12h15"/><path d="m13.5 6 6 6-6 6"/></svg></button>' +
      '<figure class="lbox__figure"><img alt=""><figcaption class="lbox__cap"></figcaption></figure>';
    document.body.appendChild(lb);

    var lbImg = $('img', lb);
    var lbCap = $('.lbox__cap', lb);
    var lbPrev = $('.lbox__prev', lb);
    var lbNext = $('.lbox__next', lb);
    var lbClose = $('.lbox__close', lb);
    var lbShots = [];
    var lbIndex = 0;
    var lbReturn = null;

    var render = function () {
      var s = lbShots[lbIndex];
      if (!s) return;
      lbImg.src = s.src;
      lbImg.alt = s.alt;
      lbCap.textContent = s.alt;
      var many = lbShots.length > 1;
      lbPrev.hidden = !many;
      lbNext.hidden = !many;
    };

    function openLightbox(gal, index) {
      lbShots = $$('.pgal__slide img', gal).map(function (img) {
        return { src: img.currentSrc || img.src, alt: img.alt };
      });
      lbIndex = index;
      lbReturn = document.activeElement;
      lb.hidden = false;
      void lb.offsetWidth;
      lb.classList.add('is-open');
      document.body.classList.add('is-locked');
      render();
      lbClose.focus();
    }

    var closeLightbox = function () {
      lb.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () {
        if (!lb.classList.contains('is-open')) lb.hidden = true;
      }, 300);
      if (lbReturn) lbReturn.focus();
    };

    var step = function (d) {
      lbIndex = (lbIndex + d + lbShots.length) % lbShots.length;
      render();
    };

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { step(-1); });
    lbNext.addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) {
      // clicking the backdrop (but not the image or a control) closes
      if (e.target === lb || e.target.tagName === 'FIGURE') closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        var f = [lbClose, lbPrev, lbNext].filter(function (b) { return !b.hidden; });
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  }

  /* ----------------------------------------- modal dialogs (enquiry) */
  var openModal = null;

  var focusablesIn = function (el) {
    return $$('a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea', el)
      .filter(function (n) { return n.offsetParent !== null; });
  };

  var closeModal = function () {
    if (!openModal) return;
    var m = openModal;
    m.el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () {
      if (!m.el.classList.contains('is-open')) m.el.hidden = true;
    }, 340);
    if (m.opener) m.opener.focus();
    openModal = null;
  };

  /* Carry the variant chosen on the page (e.g. paper weight) into the dialog,
     so the buyer does not have to pick it twice. */
  var syncVariant = function (dialog) {
    var source = $('[data-variant-source]');
    if (!source) return;
    var picked = $('input:checked', source);
    var target = $('[data-variant-target]', dialog);
    if (picked && target) target.value = picked.value;
  };

  $$('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-modal-open'));
      if (!el) return;
      syncVariant(el);
      el.hidden = false;
      void el.offsetWidth;
      el.classList.add('is-open');
      document.body.classList.add('is-locked');
      openModal = { el: el, opener: btn };
      var f = focusablesIn(el);
      // focus the close button rather than the first input, so opening the
      // dialog does not immediately pop up a mobile keyboard
      var close = $('[data-modal-close]', el);
      (close || f[0] || el).focus();
    });
  });

  $$('[data-modal-close]').forEach(function (b) { b.addEventListener('click', closeModal); });

  $$('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) closeModal(); });
  });

  document.addEventListener('keydown', function (e) {
    if (!openModal) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    var f = focusablesIn(openModal.el);
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ------------------------------------ sticky product action bar */
  var pbar = $('[data-pbar]');
  var detailActions = $('[data-detail-actions]');
  if (pbar && detailActions) {
    pbar.hidden = false;

    var footerCta = $('.footer-cta');
    var wasVisible = null;

    /* Measured on scroll rather than observed.
       IntersectionObserver only fires when the intersection state *changes*, so
       jumping straight past the button — an in-page anchor, a restored scroll
       position, a fast flick — takes the element from below the viewport to
       above it without ever intersecting, and the callback never runs. */
    var measure = function () {
      var past = detailActions.getBoundingClientRect().bottom < 0;
      // suppress while the footer call to action is on screen; two competing
      // CTAs at once is just noise
      var nearFooter = footerCta
        ? footerCta.getBoundingClientRect().top < window.innerHeight
        : false;
      var visible = past && !nearFooter;
      if (visible !== wasVisible) {
        pbar.classList.toggle('is-visible', visible);
        // mirrored onto <body> so the back-to-top offset works in browsers
        // without :has() support
        document.body.classList.toggle('has-pbar', visible);
        wasVisible = visible;
      }
    };

    /* Called straight from the scroll handler rather than deferred through
       requestAnimationFrame — rAF does not fire in a background tab or a
       non-painting frame, which would strand the bar in whatever state it was
       last left in. Two getBoundingClientRect reads per scroll is cheap. */
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    measure();
  }

  /* ------------------------------------------------------ current year */
  $$('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* --------------------------------------------------- contact form UX */
  $$('.cform').forEach(function (form) {
    var status = $('[data-status]', form);
    var submit = $('[type="submit"]', form);

    // Stamped now so the server can see how long the visitor took. A bot that
    // posts within a few seconds of the page rendering is rejected.
    var stamp = $('[data-form-time]', form);
    if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));
    var pageUrl = $('[data-page-url]', form);
    if (pageUrl) pageUrl.value = window.location.pathname + window.location.search;

    var setStatus = function (text, ok) {
      if (!status) return;
      status.textContent = text;
      status.classList.toggle('is-ok', !!ok);
      status.classList.toggle('is-error', ok === false);
    };

    var validateField = function (input) {
      var field = input.closest('.field');
      if (!field) return true;
      var ok = input.checkValidity();
      field.classList.toggle('is-invalid', !ok);
      return ok;
    };

    $$('input, textarea, select', form).forEach(function (input) {
      input.addEventListener('blur', function () {
        if (input.value !== '' || input.required) validateField(input);
      });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = $$('input, textarea, select', form);
      var allOk = true;
      var firstBad = null;
      fields.forEach(function (input) {
        if (!validateField(input)) {
          allOk = false;
          if (!firstBad) firstBad = input;
        }
      });

      if (!allOk) {
        setStatus('Please correct the highlighted fields.', false);
        if (firstBad) firstBad.focus();
        return;
      }

      var get = function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
      };

      /* Fallback for browsers without fetch, and for the case where the site is
         served as static files with no PHP behind it: hand the enquiry to the
         visitor's mail client rather than losing it. */
      var handOffToMailClient = function (why) {
        var product = get('product');
        var variant = get('variant');
        var subject = get('subject') || 'Website enquiry';
        var body =
          (product ? 'Product: ' + product + '\n' : '') +
          (variant ? 'Variant: ' + variant + '\n' : '') +
          'Name / company: ' + get('name') + '\n' +
          'Email: ' + get('email') + '\n' +
          'Phone: ' + (get('phone') || '—') + '\n' +
          'Enquiry: ' + subject + '\n\n' +
          get('message');

        window.location.href =
          'mailto:info@curelinkpharma.net' +
          '?subject=' + encodeURIComponent(product ? 'Product enquiry: ' + product : 'Website enquiry: ' + subject) +
          '&body=' + encodeURIComponent(body);

        setStatus(why + ' Opening your email app with the message ready to send.', true);
      };

      if (!window.fetch || !window.FormData) {
        handOffToMailClient('');
        return;
      }

      var original = submit ? submit.innerHTML : '';
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending…';
      }
      setStatus('Sending your message…', null);

      window.fetch(form.getAttribute('action'), {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          return res.json().then(
            function (data) { return { status: res.status, data: data }; },
            // a non-JSON body means PHP is not running this file
            function () { return { status: res.status, data: null }; }
          );
        })
        .then(function (r) {
          if (!r.data) {
            handOffToMailClient('The contact form is not available on this server.');
            return;
          }
          if (r.data.ok) {
            setStatus(r.data.message || 'Thank you — your message has been sent.', true);
            form.reset();
            if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));
          } else {
            setStatus(r.data.error || 'Sorry, your message could not be sent.', false);
          }
        })
        .catch(function () {
          handOffToMailClient('We could not reach the server.');
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            submit.innerHTML = original;
          }
        });
    });
  });
})();
