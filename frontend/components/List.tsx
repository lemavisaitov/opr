import { JSX, ReactNode } from "react";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  className?: string;
  itemClassName?: string;
}

const List = <T,>({
  items,
  renderItem,
  keyExtractor,
  className,
  itemClassName,
}: ListProps<T>): JSX.Element => {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li
          key={keyExtractor ? keyExtractor(item, index) : index}
          className={itemClassName}
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
};

export { type ListProps, List };
