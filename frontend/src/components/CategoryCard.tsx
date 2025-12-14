import React from 'react';

interface CategoryCardProps {
  category: string;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <h3>{category}</h3>
    </div>
  );
};

export default CategoryCard;
