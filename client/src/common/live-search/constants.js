export const INPUT_SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

export const DROPDOWN_MENU_WIDTHS = {
  [INPUT_SIZES.sm]: 250,
  [INPUT_SIZES.md]: 300,
  [INPUT_SIZES.lg]: 400,
};

export const DROPDOWN_ITEM_HEIGHTS = {
  [INPUT_SIZES.sm]: 25,
  [INPUT_SIZES.md]: 30,
  [INPUT_SIZES.lg]: 50,
};

export const DROPDOWN_THEMES = {
  [INPUT_SIZES.sm]: {
    fontSize: 0.7,
    menu: {
      width: 250,
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
      width: 300,
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
