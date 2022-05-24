const cards = document.querySelectorAll('.card');
cards.forEach((element) => {
  element.classList.add('is-shadowless');
  element.addEventListener('mouseenter', (e) => {
    e.target.classList.remove('is-shadowless');
  });
  element.addEventListener('mouseleave', (e) => {
    e.target.classList.add('is-shadowless');
  });
});
