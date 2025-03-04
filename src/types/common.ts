import { ComponentProps, ElementType, ReactNode } from 'react';

interface ChildrenProps {
  children?: ReactNode;
}

interface ClassNameProps {
  className?: string;
}

type PolymorphicElementProps<
  E extends ElementType,
  SharedProps extends {} = {}
> = SharedProps & Omit<ComponentProps<E>, keyof SharedProps | 'as'> & {
  as?: E;
};

export type { ChildrenProps, ClassNameProps, PolymorphicElementProps };
