import { Button } from '@/components/ui/button';
import { CategoryType } from '@/lib/types';
import { Storefront, ForkKnife, ShoppingBag, Briefcase, FilmSlate } from '@phosphor-icons/react';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const categories = [
  { id: 'all' as const, label: 'Todas las Ofertas', icon: Storefront },
  { id: 'food' as const, label: 'Comida y Restaurantes', icon: ForkKnife },
  { id: 'retail' as const, label: 'Tiendas', icon: ShoppingBag },
  { id: 'services' as const, label: 'Servicios', icon: Briefcase },
  { id: 'entertainment' as const, label: 'Entretenimiento', icon: FilmSlate }
];

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        return (
          <Button
            key={category.id}
            variant={isActive ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category.id)}
            className="snap-start shrink-0 gap-2"
          >
            <Icon className="w-4 h-4" weight={isActive ? 'fill' : 'regular'} />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
