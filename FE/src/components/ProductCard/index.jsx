import PropTypes from 'prop-types';

/**
 * ProductCard component
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {Function} props.onAddToCart - Add to cart handler
 */
const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, price, image, originalPrice } = product;

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  };

  return (
    <div className="product-card group cursor-pointer">
      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 aspect-square rounded-sm">
        <img
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
        />
        <div className="product-action absolute bottom-4 left-0 right-0 px-4 opacity-0 transform translate-y-4">
          <button
            onClick={() => onAddToCart?.(id)}
            className="w-full bg-primary text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-tight text-slate-800 dark:text-slate-200">
          {name}
        </h3>
        <div className="mt-1">
          {originalPrice && originalPrice > price && (
            <span className="text-slate-400 line-through text-sm mr-2">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="text-accent-red font-bold">{formatPrice(price)}</span>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    originalPrice: PropTypes.number,
  }).isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductCard;
