document.addEventListener('DOMContentLoaded', () => {
    const categorySelector = document.getElementById('category-selector');
    const productContainer = document.getElementById('product-container');

    categorySelector.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;

        const allCategories = document.querySelectorAll('.category-container');
        allCategories.forEach(container => {
            if (selectedCategory === 'all' || container.id === selectedCategory) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
    });
});
