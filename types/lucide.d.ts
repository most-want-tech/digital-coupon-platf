declare module 'lucide-react/dist/esm/icons/*' {
  import type { ForwardRefExoticComponent, RefAttributes } from 'react';
  import type { IconProps } from 'lucide-react';

  const Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  export default Icon;
}
