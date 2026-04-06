(function () {
    const wrapper = document.querySelector('.parallax-wrapper');
    const slide2 = wrapper.querySelectorAll('.starex-hero')[1];

    window.addEventListener('scroll', () => {
        const wrapperTop = wrapper.getBoundingClientRect().top;
        const scrollable = wrapper.offsetHeight - window.innerHeight; // = 100vh

        // How far we've scrolled into the wrapper (0 → scrollable)
        const scrolled = Math.max(0, Math.min(scrollable, -wrapperTop));
        const progress = scrolled / scrollable; // 0 to 1

        // Slide 2 moves from translateY(100%) → translateY(0%)
        slide2.style.transform = `translateY(${(1 - progress) * 100}%)`;
    }, { passive: true });
})();