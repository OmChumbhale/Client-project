import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePageTitle(navigation) {
  const { pathname } = useLocation();

  return useMemo(() => {
    const flatItems = navigation.flatMap((group) => group.items);
    return flatItems.find((item) => item.path === pathname)?.label ?? 'Dashboard';
  }, [navigation, pathname]);
}
