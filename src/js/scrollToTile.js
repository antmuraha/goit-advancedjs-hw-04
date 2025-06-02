function scrollToTile(id) {
  setTimeout(() => {
    // Wait for the DOM to update before scrolling
    const tileElement = document.querySelector(`a[data-id="${id}"]`);
    if (tileElement) {
      const margin = document.createElement('div');
      margin.style.position = 'absolute';
      margin.style.top = '-20px';
      tileElement.insertBefore(margin, tileElement.firstChild);
      margin.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    } else {
      console.warn(`Tile with id ${id} not found`);
    }
  }, 200);
}

export default scrollToTile;
