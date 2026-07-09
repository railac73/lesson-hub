/**
 * 공통 교육자료 슬라이드 네비게이션 JS
 * ws_han/common/js/slides.js
 * 
 * 사용법: 각 교육자료 HTML에서 slidesData 배열과 sectionMap 정의 후 이 스크립트 로드
 * 
 * 필수 전역 변수:
 *   slidesData - [{title, html, section}] 배열
 *   sectionMap - 슬라이드 인덱스 → 섹션 클래스 매핑 객체
 */

(function () {
  'use strict';

  let currentSlide = 0;

  const hubView = document.getElementById('hub-view');
  const slideView = document.getElementById('slide-view');
  const slideTitle = document.getElementById('active-slide-title');
  const slideContent = document.getElementById('active-slide-content');
  const prevBtn = document.getElementById('nav-prev-btn');
  const nextBtn = document.getElementById('nav-next-btn');
  const hubBtn = document.getElementById('nav-hub-btn');

  function showHub() {
    slideView.classList.remove('active');
    slideView.className = 'view'; // 섹션 클래스 초기화
    hubView.classList.add('active');
    window.location.hash = '';
  }

  function showSlide(index) {
    if (index < 0 || index >= slidesData.length) return;
    currentSlide = index;
    const slide = slidesData[index];

    slideTitle.textContent = slide.title;
    slideContent.innerHTML = slide.html;

    // 섹션 테마 적용
    slideView.className = 'view active';
    if (typeof sectionMap !== 'undefined' && sectionMap[index]) {
      slideView.classList.add(sectionMap[index]);
    }

    hubView.classList.remove('active');
    slideView.classList.add('active');

    // 네비게이션 업데이트
    const total = slidesData.length;
    hubBtn.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');

    if (index === 0) {
      prevBtn.outerHTML = '<span class="nav-disabled" id="nav-prev-btn">이전</span>';
    } else {
      const prevEl = document.getElementById('nav-prev-btn');
      if (prevEl.tagName === 'SPAN') {
        prevEl.outerHTML = '<a href="#" id="nav-prev-btn">이전</a>';
      }
    }

    if (index === total - 1) {
      nextBtn.outerHTML = '<span class="nav-disabled" id="nav-next-btn">다음</span>';
    } else {
      const nextEl = document.getElementById('nav-next-btn');
      if (nextEl.tagName === 'SPAN') {
        nextEl.outerHTML = '<a href="#" id="nav-next-btn">다음</a>';
      }
    }

    // 이벤트 리바인딩
    rebindNavEvents();

    // Lucide 아이콘 생성
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    window.location.hash = 'slide-' + (index + 1);
  }

  function rebindNavEvents() {
    const prev = document.getElementById('nav-prev-btn');
    const next = document.getElementById('nav-next-btn');
    const hub = document.getElementById('nav-hub-btn');

    if (prev && prev.tagName === 'A') {
      prev.onclick = function (e) { e.preventDefault(); showSlide(currentSlide - 1); };
    }
    if (next && next.tagName === 'A') {
      next.onclick = function (e) { e.preventDefault(); showSlide(currentSlide + 1); };
    }
    if (hub) {
      hub.onclick = function (e) { e.preventDefault(); showHub(); };
    }
  }

  // 해시 기반 라우팅
  function handleHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < slidesData.length) {
        showSlide(idx);
        return;
      }
    }
    showHub();
  }

  // 키보드 네비게이션
  document.addEventListener('keydown', function (e) {
    if (!slideView.classList.contains('active')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      showSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      showSlide(currentSlide - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      showHub();
    }
  });

  // 허브 카드 클릭 이벤트
  document.querySelectorAll('[data-slide]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const idx = parseInt(el.getAttribute('data-slide'), 10);
      showSlide(idx);
    });
  });

  // 초기 로드
  window.addEventListener('hashchange', handleHash);
  rebindNavEvents();
  handleHash();

  // 전역 접근용
  window.showSlide = showSlide;
  window.showHub = showHub;
})();
