import { breakpoints } from '@/utils/breakpoints';

export const useBreakpoints = () => {
  const width = ref(process.client ? window.innerWidth : 0);

  const handleResize = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  const isMobile = computed(() => width.value <= breakpoints.mobile);
  const isTablet = computed(() =>
    width.value > breakpoints.mobile && width.value <= breakpoints.tablet
  );
  const isSmallDesktop = computed(() =>
    width.value > breakpoints.tablet && width.value <= breakpoints.smallDesktop
  );
  const isMediumDesktop = computed(() =>
    width.value > breakpoints.smallDesktop && width.value <= breakpoints.mediumDesktop
  );
  const isDesktop = computed(() => width.value >= breakpoints.desktop);

  return {
    width,
    isMobile,
    isTablet,
    isSmallDesktop,
    isMediumDesktop,
    isDesktop,
  };
};
