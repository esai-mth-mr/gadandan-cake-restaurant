const icons = Array.from(document.querySelectorAll('.icon'))
icons.forEach((icon) => {
  icon.addEventListener('click', () => {
    icons.forEach((i) => {
      i.classList.remove('icon--expanded');
    });
    icon.classList.add('icon--expanded')
  })
})
