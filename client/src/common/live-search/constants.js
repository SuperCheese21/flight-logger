export const INPUT_SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

export const DROPDOWN_THEMES = {
  [INPUT_SIZES.sm]: {
    fontSize: 0.7,
    menu: {
      width: 300,
    },
    menuItem: {
      height: 35,
      image: {
        width: 50,
      },
    },
  },
  [INPUT_SIZES.md]: {
    fontSize: 0.8,
    menu: {
      width: 350,
    },
    menuItem: {
      height: 40,
      image: {
        width: 60,
      },
    },
  },
  [INPUT_SIZES.lg]: {
    fontSize: 1.0,
    menu: {
      width: 400,
    },
    menuItem: {
      height: 50,
      image: {
        width: 100,
      },
    },
  },
};

export default INPUT_SIZES;
